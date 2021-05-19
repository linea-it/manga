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
from astropy.io import fits as pf


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    filter_fields = ('id', 'megacube', 'mangaid', 'plateifu', 'objra', 'objdec',
                     'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed',
                     'nsa_z',)
    search_fields = ('id', 'megacube', 'mangaid', 'plateifu', 'objra', 'objdec',
                     'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed',
                     'nsa_z',)
    ordering_fields = ('id', 'megacube', 'mangaid', 'plateifu', 'objra', 'objdec',
                       'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed',
                       'nsa_z',)
    ordering = ('mangaid',)

    def get_megacube_path(self, filename):
        return os.path.join(os.getenv('IMAGE_PATH', '/images/'), filename)

    def get_megacube_size(self, filename):
        return os.stat(self.get_megacube_path(filename)).st_size

    def get_image_part_path(self, megacube_name, filename):
        # Join and make the path for the extracted files:
        filepath = os.path.join(
            settings.MEGACUBE_PARTS,
            str(megacube_name) + '/' + filename
        )

        return filepath

    def get_sdss_image_path(self, megacube_name, filename, root_folder="data"):
        # Join and make the path for the sdss image:
        filepath = os.path.join(
            '/' + root_folder + '/megacube_parts/',
            str(megacube_name) + '/' + filename
        )

        return filepath

    @action(detail=True, methods=['get'])
    def original_image(self, request, pk=None):
        """
        Returns the original image data by 'FLUX' hud to create a heatmap.

        It's being read by the file in:
        `/images/megacube_parts/megacube_{JOB_ID}/original_image.json`
        that has been extracted from `.fits.fz` file.

        Returns: <br>
            ([dict]): a dictionary containing the 'z', 'title'
            and 'sdss_image'. <br>
                - z ([list[list[number]]]): image data
                (Matrix 52x52: 20704 elements) converted utilizing
                pcolormesh. <br>
                - title ([string]): the HUD title, which is 'FLUX'.
                - sdss_image ([string]): the SDSS image path.
        """

        galaxy = self.get_object()

        original_image_filepath = self.get_image_part_path(
            galaxy.megacube.split('.fits.fz')[0], 'original_image.json')

        sdss_image_filepath = self.get_sdss_image_path(
            galaxy.megacube.split('.fits.fz')[0], 'sdss_image.jpg')

        with open(original_image_filepath) as f:
            data = json.load(f)

        megacube = self.get_megacube_path(galaxy.megacube)

        # Only send the path if the file exists:
        if os.path.exists(
            self.get_sdss_image_path(
                galaxy.megacube.split('.fits.fz')[0], 'sdss_image.jpg',
                'images')):
            data['sdss_image'] = sdss_image_filepath
        else:
            data['sdss_image'] = None

        return Response(data)

    @action(detail=True, methods=['get'])
    def list_hud(self, request, pk=None):
        """
        Returns a list of all HUDs titles.

        It's being read by the file in:
        `/images/megacube_parts/megacube_{JOB_ID}/list_hud.json`
        that has been extracted from `.fits.fz` file.

        Returns: <br>
            ([list[string]]): a list of HUDs titles.
        """

        galaxy = self.get_object()

        list_hud_filepath = self.get_image_part_path(
            galaxy.megacube.split('.fits.fz')[0], 'list_hud.json')

        with open(list_hud_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=['get'])
    def download_info(self, request, pk=None):
        """
        Returns meta information on a megacube and its link for download.

        Returns: <br>
            ([dict]): a dictionary containing 'mangaid', 'name', 'megacube',
            'link', 'size'. <br>
                - mangaid ([string]): the manga id. <br>
                - name ([string]): the name of the galaxy. <br>
                - megacube ([string]): the megacube filename. <br>
                - link ([string]): the url of the megacube. <br>
                - size ([number]): the size of the file.
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
        Returns the image data by HUD to create a heatmap.

        It's being read by the files in:
        `/images/megacube_parts/megacube_{JOB_ID}/image_heatmap_{HUD}.json`
        that has been extracted from `.fits.fz` file.

        Args: <br>
            hud ([string]): the HUD title.

        Returns: <br>
            ([dict]): a dictionary containing the 'z' and 'title'. <br>
                - z ([list[list[number]]]): image data (Matrix 52x52:
                20704 elements) converted utilizing pcolormesh. <br>
                - title ([string]): the title of the HUD
        """

        params = request.query_params

        if 'hud' not in params:
            raise Exception("Parameter hud is required")

        galaxy = self.get_object()

        filename = 'image_heatmap_%s.json' % params['hud']

        image_heatmap_filepath = self.get_image_part_path(
            galaxy.megacube.split('.fits.fz')[0], filename)

        with open(image_heatmap_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=['get'])
    def all_images_heatmap(self, request, pk=None):
        """
        Returns a list of image data by all HUDs to create heatmaps.

        It's being read by the files in:
        `/images/megacube_parts/megacube_{JOB_ID}/image_heatmap_{HUD}.json`
        that has been extracted from `.fits.fz` file.

        Returns: <br>
            ([list[dict]]): a list of dictionaries containing the 'z'
            and 'title'. <br>
                - z ([list[list[number]]]): image data (Matrix 52x52:
                20704 elements) converted utilizing pcolormesh. <br>
                - title ([string]): the title of the HUD.
        """

        galaxy = self.get_object()

        list_hud_filepath = self.get_image_part_path(
            galaxy.megacube.split('.fits.fz')[0], 'list_hud.json')

        with open(list_hud_filepath) as f:
            list_hud = json.load(f)

        data = []

        for hud in list_hud['hud']:
            filename = 'image_heatmap_%s.json' % hud['name']

            image_heatmap_filepath = self.get_image_part_path(
                galaxy.megacube.split('.fits.fz')[0], filename)

            with open(image_heatmap_filepath) as f:
                image = json.load(f)

            data.append(image)

        return Response(data)

    @action(detail=True, methods=['get'])
    def flux_by_position(self, request, pk=None):
        """
        Returns the Flux, Lambda and Synt by an X, Y position.

        Args: <br>
            x ([number]): position X on Image. <br>
            y ([number]): position Y on Image.

        Returns: <br>
            [dict]: a dictionary with the 'flux', 'lamb' and 'synt'. <br>
                - flux ([list[number]]) <br>
                - lamb ([list[number]]) <br>
                - synt ([list[number]])
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
        Returns the image HUDs by log10 by an X, Y position.

        Args: <br>
            x ([number]): position X on Image. <br>
            y ([number]): position Y on Image. <br>

        Returns: <br>
            [dict]: a dictionary with 'x', 'y' and 'm'. <br>
                - x ([list[number]]) <br>
                - y ([list[number]]) <br>
                - m ([list[number]])
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
        Returns the Vecs by an X, Y position.

        Args: <br>
            x ([number]): position X on Image. <br>
            y ([number]): position Y on Image. <br>

        Returns: <br>
            [dict]: a dictionary with 'x', 'y', 'm' and 'mlegend'. <br>
                - x ([list[number]]) <br>
                - y ([list[number]]) <br>
                - m ([list[number]]) <br>
                - mlegend ([list[string]])
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
        Returns the Image's Megacube Header.

        It's being read by the file in:
        `/images/megacube_parts/megacube_{JOB_ID}/megacube_header.json`
        that has been extracted from `.fits.fz` file.


        Returns: <br>
            ([list[string]]): a list of srings.
        """

        galaxy = self.get_object()

        cube_header_filepath = self.get_image_part_path(
            galaxy.megacube.split('.fits.fz')[0], 'cube_header.json')

        with open(cube_header_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=['get'])
    def test(self, request, pk=None):

        galaxy = self.get_object()

        megacube = self.get_megacube_path(galaxy.megacube)

        data = mclass().image_by_hud(
            megacube, 'Adev')

        z = mclass().image_data_to_array(
            data,)

        return Response(z)
