from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from galaxy.models import Image
from galaxy.serializers import ImageSerializer

import os
import numpy as np

from manga.verifyer import mclass

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    filter_fields = ('id', 'megacube', 'mangaid', 'objra', 'objdec', 'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed', 'nsa_z',)
    search_fields = ('megacube', 'nsa_iauname',)
    ordering_fields = ('id', 'megacube', 'mangaid', 'objra', 'objdec', 'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed', 'nsa_z',)
    ordering = ('id', 'megacube', 'mangaid', 'objra', 'objdec', 'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed', 'nsa_z',)

    def get_megacube_path(self, filename):
        return os.path.join(os.getenv('IMAGE_PATH', '/images/'), filename)

    @action(detail=True, methods=['get'])
    def original_image(self, request, pk=None):
        """
            Retorna a primeira imagem, a original (zero).
        """

        galaxy = self.get_object()

        megacube = self.get_megacube_path(galaxy.megacube)

        cube_data = mclass().get_original_cube_data(megacube)

        result = dict({
            'z': cube_data,
            'title': 'FLUX',
        })

        response = Response(result)

        return response

    @action(detail=True, methods=['get'])
    def list_hud(self, request, pk=None):
        """
            Retorna a lista de HUD disponivel em um megacube.
            Exemplo de requisicao: http://localhost/8/list_hud/
        """

        galaxy = self.get_object()

        megacube = self.get_megacube_path(galaxy.megacube)

        cube_header = mclass().get_headers(megacube, 'PoPBins')

        cube_data = mclass().get_cube_data(megacube, 'PoPBins')

        lHud = mclass().get_all_hud(
            cube_header, cube_data)

        dHud = list()

        for hud in lHud:
            # TODO: recuperar o display name para cada HUD
            dHud.append({
                'name': hud,
                'display_name': hud
            })


        dHud = sorted(dHud, key = lambda i: i['display_name'])

        result = ({
            'download': '/data/' + galaxy.megacube,
            'hud': dHud
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

        megacube = self.get_megacube_path(galaxy.megacube)

        image_data = mclass().image_by_hud(
            megacube, params['hud'])

        z = mclass().image_data_to_array(image_data)

        result = dict({
            'z': z,
            'title': params['hud'],
        })

        return Response(result)


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

        megacube = self.get_megacube_path(galaxy.megacube)

        cube_header = repr(mclass().get_headers(megacube, 'PoPBins')).split('\n')

        return Response(cube_header)
