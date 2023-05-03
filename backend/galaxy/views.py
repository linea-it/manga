from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from galaxy.models import Image
from galaxy.serializers import ImageSerializer

import os
from pathlib import Path
from django.conf import settings
import json

from manga.verifyer import mclass
from astropy.io import fits as pf
import tarfile
from manga.megacubo_utils import get_megacube_parts_root_path, extract_bz2
from urllib.parse import urljoin
import posixpath
from manga.emission_lines import EmissionLines

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.filter(had_parts_extracted=True)
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

    def get_original_megacube_path(self, obj):
        return Path(obj.path)

    def get_original_megacube_url(self, obj):
        return posixpath.join(settings.DATA_BASE_URL, f'{obj.megacube}{obj.compression}')

    def get_megacube_from_cache(self, obj):
        # Verificar se existe o arquivo megacubo descompactado no diretório de cache.
        megacube_path = self.get_original_megacube_path(obj)
        cache_dir = Path(settings.MEGACUBE_CACHE)
        cache_filepath = cache_dir.joinpath(obj.megacube)

        if cache_filepath.exists():
            return cache_filepath
        else:
            # Extrai o megacubo no diretório de cache.
            extract_bz2(compressed_file=megacube_path, local_dir=cache_filepath)
            return cache_filepath

    def get_obj_path(self, obj):
        return get_megacube_parts_root_path().joinpath(obj.folder_name)

    def get_image_part_path(self, obj, filename):
        # Join and make the path for the extracted files:
        return self.get_obj_path(obj).joinpath(filename)


    def get_sdss_image_url(self, obj, filename='sdss_image.jpg'):
        # Join and make the url for the sdss image:
        file_url = posixpath.join(settings.MEGACUBE_PARTS_URL, obj.folder_name, filename)
        print(file_url)
        base_url =  "{0}://{1}".format(self.request.scheme, self.request.get_host())
        print(base_url)
        return file_url
        # return urljoin(base_url, file_url)


    def get_sdss_image_path(self, obj, filename='sdss_image.jpg'):
        objpath = self.get_obj_path(obj)
        return objpath.joinpath(filename)

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

        original_image_filepath = self.get_image_part_path(galaxy, 'original_image.json')

        with open(original_image_filepath) as f:
            data = json.load(f)


        # Only send the path if the file exists:
        if os.path.exists(self.get_sdss_image_path(galaxy)):
            data['sdss_image'] = self.get_sdss_image_url(galaxy)
        else:
            data['sdss_image'] = None

        return Response(data)

    def get_huds(self, galaxy):

        list_hud_filepath = self.get_image_part_path(
            galaxy, 'list_hud.json')
        
        list_gas_filepath = self.get_image_part_path(
            galaxy, 'list_gas_map.json')
        
        result = dict({
            'hud': list(),
            'gas_maps': list()
        })
        with open(list_hud_filepath) as f:
            huds = json.load(f)
            result['hud'] = huds['hud']

            with open(list_gas_filepath) as f:
                gas = json.load(f)
                result['gas_maps'] = gas['gas_maps']

                # TODO: Provisóriamente a lista de mapas está indo no mesmo array dos hdus. 
                # Solução ideal é a interface ser atualizada para entender o atributo novo gas_maps
                # e renderizar os mapas de gas de forma agrupada.
                for map in gas['gas_maps']:
                    result['hud'].append(map)
        return result

    @action(detail=True, methods=['get'])
    def list_hud(self, request, pk=None):
        """
        Returns a list of all HUDs titles.

        It's being read by the file in:
        `/images/megacube_parts/megacube_{JOB_ID}/list_hud.json` 
        and 
        `/images/megacube_parts/megacube_{JOB_ID}/list_gas_map.json` 
        that has been extracted from `.fits.fz` file.

        Returns: <br>
            ([list[string]]): a list of HUDs titles.
        """

        galaxy = self.get_object()
        result = self.get_huds(galaxy)
        # list_hud_filepath = self.get_image_part_path(
        #     galaxy, 'list_hud.json')
        
        # list_gas_filepath = self.get_image_part_path(
        #     galaxy, 'list_gas_map.json')
        
        # result = dict({
        #     'hud': list(),
        #     'gas_maps': list()
        # })
        # with open(list_hud_filepath) as f:
        #     huds = json.load(f)
        #     result['hud'] = huds['hud']

        #     with open(list_gas_filepath) as f:
        #         gas = json.load(f)
        #         result['gas_maps'] = gas['gas_maps']

        #         # TODO: Provisóriamente a lista de mapas está indo no mesmo array dos hdus. 
        #         # Solução ideal é a interface ser atualizada para entender o atributo novo gas_maps
        #         # e renderizar os mapas de gas de forma agrupada.
        #         for map in gas['gas_maps']:
        #             result['hud'].append(map)

        return Response(result)

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
            'link': self.get_original_megacube_url(galaxy),
            'size': galaxy.compressed_size
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
            galaxy, filename)

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

        huds = self.get_huds(galaxy)

        list_huds = huds['hud'] + huds['gas_maps']
        data = []
        for hud in list_huds:
            filename = 'image_heatmap_%s.json' % hud['name']

            image_heatmap_filepath = self.get_image_part_path(
                galaxy, filename)

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

        megacube = self.get_megacube_from_cache(galaxy)

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

        # my_cube = EmissionLines(megacube)
        # df = my_cube.to_dataframe(int(params['x']),  int(params['y'])

        # for prop in df.columns:

        # result = dict({
        #     'flux': flux.tolist(),
        #     'lamb': lamb.tolist(),
        #     'synt': synt.tolist(),
        # })

        # return Response(result)

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

        megacube = self.get_megacube_from_cache(galaxy)

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

        megacube = self.get_megacube_from_cache(galaxy)

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
            galaxy, 'cube_header.json')

        with open(cube_header_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=['get'])
    def test(self, request, pk=None):

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy.megacube)

        data = mclass().image_by_hud(
            megacube, 'Adev')

        z = mclass().image_data_to_array(
            data,)

        return Response(z)


    @action(detail=True, methods=['get'])
    def spectrum_lines_by_position(self, request, pk=None):
        params = request.query_params

        if 'x' not in params:
            raise Exception("Parameter x is required")

        if 'y' not in params:
            raise Exception("Parameter y is required")

        x = int(params['x'])
        y = int(params['y'])

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy)

        my_cube = EmissionLines(megacube)
        df = my_cube.to_dataframe(x, y)

        data = dict({
            "wavelength": list(),
            "obs_spec": list(),
            "synt_spec": list(),
        })

        for label in df.columns:
            data[label] = df[label].tolist()        
        return Response(data)

    @action(detail=True, methods=['get'])
    def plot_emission_lines(self, request, pk=None):
        """
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

        x = int(params['x'])
        y = int(params['y'])

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy)

        plot_filename = f"{megacube.name.split('.')[0]}_spec_plot_{x}_{y}.html"

        dir = Path(settings.MEGACUBE_PARTS)
        filepath = dir.joinpath(plot_filename)

        cache_url = posixpath.join(settings.DATA_BASE_URL, plot_filename)
        file_url = posixpath.join(settings.MEGACUBE_PARTS_URL, galaxy.folder_name, plot_filename)
    
        my_cube = EmissionLines(megacube)
        my_cube.plot(x, y, filepath, "html")

        return Response(dict({
            "filepath": str(filepath),
            "url": file_url
        }))