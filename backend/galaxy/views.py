from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from galaxy.models import Image
from galaxy.serializers import ImageSerializer

import os
from django.conf import settings
import json

from manga.verifyer import mclass


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    filter_fields = ('id', 'megacube', 'mangaid', 'objra', 'objdec',
                     'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed',
                     'nsa_z',)
    search_fields = ('megacube', 'nsa_iauname',)
    ordering_fields = ('id', 'megacube', 'mangaid', 'objra', 'objdec',
                       'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed',
                       'nsa_z',)
    ordering = ('mangaid',)

    def get_megacube_path(self, filename):
        return os.path.join(os.getenv('IMAGE_PATH', '/images/'), filename)

    def get_megacube_size(self, filename):
        return os.stat(self.get_megacube_path(filename)).st_size

    def get_image_part_path(self, megacube_id, filename):
        # Join and make the path for the extracted files:
        file_dir = os.path.join(
            settings.MEGACUBE_PARTS,
            'megacube_' + str(megacube_id) + '/' + filename
        )

        filepath = self.get_megacube_path(file_dir)

        return filepath

    @action(detail=True, methods=['get'])
    def original_image(self, request, pk=None):
        """
            Retorna a primeira imagem, a original (zero).
        """

        galaxy = self.get_object()

        original_image_filepath = self.get_image_part_path(
            galaxy.id, 'original_image.json')

        with open(original_image_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=['get'])
    def list_hud(self, request, pk=None):
        """
            Retorna a lista de HUD disponivel em um megacube.
            Exemplo de requisicao: http://localhost/8/list_hud/
        """

        galaxy = self.get_object()

        list_hud_filepath = self.get_image_part_path(
            galaxy.id, 'list_hud.json')

        with open(list_hud_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=['get'])
    def download_info(self, request, pk=None):
        """
        Returns the megacube's link for download

        Returns:
            mangaid [String]: the manga id
            name [String]: the name of the galaxy
            megacube [String]: the megacube filename
            link [String]: the url of the megacube
            size [Number]: the size of the file
        """

        galaxy = self.get_object()

        result = ({
            'mangaid': galaxy.mangaid,
            'name': galaxy.nsa_iauname,
            'megacube': galaxy.megacube,
            'link': '/data/' + galaxy.megacube,
            'size': self.get_megacube_size(galaxy.megacube)
        })

        return Response(result)

    @action(detail=True, methods=['get'])
    def image_heatmap(self, request, pk=None):
        """
            Retorna os dados que permitem plotar a imagem usando um heatmap.
            Exemplo de Requisicao: http://localhost/image_2d_histogram?megacube=manga-8138-6101-MEGA.fits&hud=xyy
        """

        params = request.query_params

        if 'hud' not in params:
            raise Exception("Parameter hud is required")

        galaxy = self.get_object()

        filename = 'image_heatmap_%s.json' % params['hud']

        image_heatmap_filepath = self.get_image_part_path(
            galaxy.id, filename)

        with open(image_heatmap_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=['get'])
    def all_images_heatmap(self, request, pk=None):
        """
            Retorna os dados que permitem plotar a imagem usando um heatmap.
            Exemplo de Requisicao: http://localhost/image_2d_histogram?megacube=manga-8138-6101-MEGA.fits&hud=xyy
        """

        galaxy = self.get_object()

        list_hud_filepath = self.get_image_part_path(
            galaxy.id, 'list_hud.json')

        with open(list_hud_filepath) as f:
            list_hud = json.load(f)

        data = []

        for hud in list_hud['hud']:
            filename = 'image_heatmap_%s.json' % hud['name']

            image_heatmap_filepath = self.get_image_part_path(
                galaxy.id, filename)

            with open(image_heatmap_filepath) as f:
                image = json.load(f)

            data.append(image)

        return Response(data)

    @action(detail=True, methods=['get'])
    def flux_by_position(self, request, pk=None):
        """
            Retorna o Fluxo e lambda para uma posicao x,y.

            Exemplo de requisicao.
            http://localhost/flux_by_position?megacube=manga-8138-6101-MEGA.fits&x=25&y=26
        """

        params = request.query_params

        if 'x' not in params:
            raise Exception("Parameter x is required")

        if 'y' not in params:
            raise Exception("Parameter y is required")

        galaxy = self.get_object()

        megacube = self.get_megacube_path(galaxy.megacube)

        flux, lamb = mclass().flux_by_position(
            megacube, int(params['x']), int(params['y']))

        synt, lamb2 = mclass().synt_by_position(
            megacube, int(params['x']), int(params['y']))

        result = dict({
            'flux': flux.tolist(),
            'lamb': lamb.tolist(),
            'synt': synt.tolist(),
        })

        return Response(result)

    @action(detail=True, methods=['get'])
    def log_age_by_position(self, request, pk=None):
        """
            Retorna o "Central Spaxel Best Fit" para uma posicao x,y.

            Exemplo de requisicao.
            http://localhost/spaxel_fit_by_position?megacube=manga-8138-6101-MEGA.fits&x=15&y=29
        """

        params = request.query_params

        if 'x' not in params:
            raise Exception("Parameter x is required")

        if 'y' not in params:
            raise Exception("Parameter y is required")

        galaxy = self.get_object()

        megacube = self.get_megacube_path(galaxy.megacube)

        log_age = mclass().log_age_by_position(
            megacube, int(params['x']), int(params['y']))

        return Response(log_age)

    @action(detail=True, methods=['get'])
    def vecs_by_position(self, request, pk=None):
        """
            Retorna o "Central Spaxel Best Fit" para uma posicao x,y.

            Exemplo de requisicao.
            http://localhost/spaxel_fit_by_position?megacube=manga-8138-6101-MEGA.fits&x=15&y=29
        """

        params = request.query_params

        if 'x' not in params:
            raise Exception("Parameter x is required")

        if 'y' not in params:
            raise Exception("Parameter y is required")

        galaxy = self.get_object()

        megacube = self.get_megacube_path(galaxy.megacube)

        vecs = mclass().vecs_by_position(
            megacube, int(params['x']), int(params['y']))

        return Response(vecs)

    @action(detail=True, methods=['get'])
    def megacube_header(self, request, pk=None):
        """
            Retorna o "Header" de um determinado megacubo.

            Exemplo de requisicao.
            http://localhost/megacube_header?megacube=manga-8138-6101-MEGA.fits
        """

        galaxy = self.get_object()

        cube_header_filepath = self.get_image_part_path(
            galaxy.id, 'cube_header.json')

        with open(cube_header_filepath) as f:
            data = json.load(f)

        return Response(data)
