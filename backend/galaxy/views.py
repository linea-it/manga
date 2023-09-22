import json
import os
import posixpath
import tarfile
from pathlib import Path
from urllib.parse import urljoin

import numpy as np
from astropy.io import fits as pf
from django.conf import settings
from django.core.cache import cache
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from galaxy.models import Image
from galaxy.serializers import ImageSerializer
from manga.emission_lines import EmissionLines
from manga.megacube import MangaMegacube
from manga.megacubo_utils import extract_bz2, get_megacube_parts_root_path
from manga.verifyer import mclass


class ImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Image.objects.filter(had_parts_extracted=True)
    serializer_class = ImageSerializer
    filter_fields = (
        "id",
        "mangaid",
        "plateifu",
        "ned_name",
        "objra",
        "objdec",
        "fcfc1_50",
        "xyy_light",
        "xyo_light",
        "xiy_light",
        "xii_light",
        "xio_light",
        "xo_light",
        "xyy_mass",
        "xyo_mass",
        "xiy_mass",
        "xii_mass",
        "xio_mass",
        "xo_mass",
        "sfr_1",
        "sfr_5",
        "sfr_10",
        "sfr_14",
        "sfr_20",
        "sfr_30",
        "sfr_56",
        "sfr_100",
        "sfr_200",
        "av_star",
        "mage_l",
        "mage_m",
        "mz_l",
        "mz_m",
        "mstar",
        "sigma_star",
        "vrot_star",
        "f_hb",
        "f_o3_4959",
        "f_o3_5007",
        "f_he1_5876",
        "f_o1_6300",
        "f_n2_6548",
        "f_ha",
        "f_n2_6583",
        "f_s2_6716",
        "f_s2_6731",
        "eqw_hb",
        "eqw_o3_4959",
        "eqw_o3_5007",
        "eqw_he1_5876",
        "eqw_o1_6300",
        "eqw_n2_6548",
        "eqw_ha",
        "eqw_n2_6583",
        "eqw_s2_6716",
        "eqw_s2_6731",
        "v_hb",
        "v_o3_4959",
        "v_o3_5007",
        "v_he1_5876",
        "v_o1_6300",
        "v_n2_6548",
        "v_ha",
        "v_n2_6583",
        "v_s2_6716",
        "v_s2_6731",
        "sigma_hb",
        "sigma_o3_4959",
        "sigma_o3_5007",
        "sigma_he1_5876",
        "sigma_o1_6300",
        "sigma_n2_6548",
        "sigma_ha",
        "sigma_n2_6583",
        "sigma_s2_6716",
        "sigma_s2_6731",
        "had_bcomp",
    )

    search_fields = ("megacube", "ned_name")
    ordering_fields = (
        "id",
        "mangaid",
        "plateifu",
        "ned_name",
        "objra",
        "objdec",
        "fcfc1_50",
        "xyy_light",
        "xyo_light",
        "xiy_light",
        "xii_light",
        "xio_light",
        "xo_light",
        "xyy_mass",
        "xyo_mass",
        "xiy_mass",
        "xii_mass",
        "xio_mass",
        "xo_mass",
        "sfr_1",
        "sfr_5",
        "sfr_10",
        "sfr_14",
        "sfr_20",
        "sfr_30",
        "sfr_56",
        "sfr_100",
        "sfr_200",
        "av_star",
        "mage_l",
        "mage_m",
        "mz_l",
        "mz_m",
        "mstar",
        "sigma_star",
        "vrot_star",
        "f_hb",
        "f_o3_4959",
        "f_o3_5007",
        "f_he1_5876",
        "f_o1_6300",
        "f_n2_6548",
        "f_ha",
        "f_n2_6583",
        "f_s2_6716",
        "f_s2_6731",
        "eqw_hb",
        "eqw_o3_4959",
        "eqw_o3_5007",
        "eqw_he1_5876",
        "eqw_o1_6300",
        "eqw_n2_6548",
        "eqw_ha",
        "eqw_n2_6583",
        "eqw_s2_6716",
        "eqw_s2_6731",
        "v_hb",
        "v_o3_4959",
        "v_o3_5007",
        "v_he1_5876",
        "v_o1_6300",
        "v_n2_6548",
        "v_ha",
        "v_n2_6583",
        "v_s2_6716",
        "v_s2_6731",
        "sigma_hb",
        "sigma_o3_4959",
        "sigma_o3_5007",
        "sigma_he1_5876",
        "sigma_o1_6300",
        "sigma_n2_6548",
        "sigma_ha",
        "sigma_n2_6583",
        "sigma_s2_6716",
        "sigma_s2_6731",
        "had_bcomp",
    )

    def get_original_megacube_path(self, obj):
        return Path(obj.path)

    def get_original_megacube_url(self, obj):
        return posixpath.join(settings.DATA_BASE_URL, f"{obj.megacube}{obj.compression}")

    def get_bcomp_megacube_url(self, obj):
        bcomp_filename = self.get_bcomp_filename(obj)
        if bcomp_filename is not None:
            return posixpath.join(settings.DATA_BASE_URL, bcomp_filename)
        else:
            return None

    def get_bcomp_filename(self, obj):
        if obj.had_bcomp == True:
            bcomp_filename = Path(obj.bcomp_path).name
            return bcomp_filename
        else:
            return None

    def get_megacube_from_cache(self, obj):
        # Verificar se existe o arquivo megacubo descompactado no diretório de cache.
        megacube_path = self.get_original_megacube_path(obj)
        cache_dir = Path(settings.MEGACUBE_CACHE)
        cache_filepath = cache_dir.joinpath(obj.megacube)

        if cache_filepath.exists():
            return cache_filepath
        else:
            cube = MangaMegacube(megacube_path)
            cube.extract_bz2(cache_dir)
            # Extrai o megacubo no diretório de cache.
            # extract_bz2(compressed_file=megacube_path, local_dir=cache_filepath)
            return cache_filepath

    def get_obj_path(self, obj):
        return get_megacube_parts_root_path().joinpath(obj.folder_name)

    def get_image_part_path(self, obj, filename):
        # Join and make the path for the extracted files:
        return self.get_obj_path(obj).joinpath(filename)

    def get_sdss_image_url(self, obj, filename="sdss_image.jpg"):
        # Join and make the url for the sdss image:
        file_url = posixpath.join(settings.MEGACUBE_PARTS_URL, obj.folder_name, filename)

        base_url = f"{self.request.scheme}://{self.request.get_host()}"

        return file_url

    def get_sdss_image_path(self, obj, filename="sdss_image.jpg"):
        objpath = self.get_obj_path(obj)
        return objpath.joinpath(filename)

    @action(detail=True, methods=["get"])
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

        original_image_filepath = self.get_image_part_path(galaxy, "original_image.json")

        with open(original_image_filepath) as f:
            data = json.load(f)

        # Only send the path if the file exists:
        if os.path.exists(self.get_sdss_image_path(galaxy)):
            data["sdss_image"] = self.get_sdss_image_url(galaxy)
        else:
            data["sdss_image"] = None

        return Response(data)

    def get_huds(self, galaxy):
        cache_key = f"galaxy_hdus_{galaxy.pk}"

        data = cache.get(cache_key)
        if data:
            return data

        list_hdu_filepath = self.get_image_part_path(galaxy, "list_hud.json")

        list_gas_filepath = self.get_image_part_path(galaxy, "list_gas_map.json")

        data = dict({"stellar_maps": list(), "gas_maps": list()})

        with open(list_hdu_filepath) as f:
            hdus = json.load(f)
            for hdu in hdus["hud"]:
                hdu.update(
                    {
                        "comment": hdu["comment"].split("(")[0],
                        "internal_name": hdu["name"].lower().replace(" ", "_").replace(".", "_"),
                    }
                )
                data["stellar_maps"].append(hdu)

        with open(list_gas_filepath) as f:
            hdus = json.load(f)
            for hdu in hdus["gas_maps"]:
                hdu.update(
                    {
                        "comment": hdu["comment"].split("(")[0],
                        "internal_name": hdu["name"].lower().replace(" ", "_").replace(".", "_"),
                    }
                )
                data["gas_maps"].append(hdu)

        cache.set(cache_key, data)
        return data

    @action(detail=True, methods=["get"])
    def hdus(self, request, pk=None):
        """
        Returns a list of all HDUs titles.

        It's being read by the file in:
        `/images/megacube_parts/megacube_{JOB_ID}/list_hud.json`
        and
        `/images/megacube_parts/megacube_{JOB_ID}/list_gas_map.json`
        that has been extracted from `.fits.fz` file.

        Returns: <br>
            ([list[string]]): a list of HUDs titles.
        """
        galaxy = self.get_object()
        hdus = self.get_huds(galaxy)

        return Response(hdus)

    @action(detail=True, methods=["get"])
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
        result = {
            "mangaid": galaxy.mangaid,
            "name": galaxy.ned_name,
            "bcomp_name": self.get_bcomp_filename(galaxy),
            "megacube": f"{galaxy.megacube}{galaxy.compression}",
            "link": self.get_original_megacube_url(galaxy),
            "link_bcomp": self.get_bcomp_megacube_url(galaxy),
            "size": galaxy.size,
            "compressed_size": galaxy.compressed_size,
        }

        return Response(result)

    def hdu_by_internal_name(self, galaxy, internal_name):
        hdus = self.get_huds(galaxy)
        all_hdus = hdus["stellar_maps"] + hdus["gas_maps"]
        lhdu = list(filter(lambda d: d["internal_name"] == internal_name, all_hdus))
        if len(lhdu) == 0:
            raise Exception(f"Hdu {internal_name} Not Found.")
        return lhdu[0]

    def read_heatmap_by_hdu(self, galaxy, hdu):
        filename = "image_heatmap_%s.json" % hdu["name"]

        image_heatmap_filepath = self.get_image_part_path(galaxy, filename)

        with open(image_heatmap_filepath) as f:
            map = json.load(f)
            z = np.array(map["z"], dtype=np.float64)
            min = np.nanmin(z)
            max = np.nanmax(z)
            map.update(
                {
                    "internal_name": hdu["internal_name"],
                    "name": hdu["name"],
                    "comment": hdu["comment"],
                    "min": float(min),
                    "max": float(max),
                }
            )

        return map

    @action(detail=True, methods=["get"])
    def heatmap_by_hdu(self, request, pk=None):
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

        if "hdu" not in params:
            raise Exception("Parameter hdu is required")

        galaxy = self.get_object()
        hdu = self.hdu_by_internal_name(galaxy, params["hdu"])
        data = self.read_heatmap_by_hdu(galaxy, hdu)

        return Response(data)

    @action(detail=True, methods=["get"])
    def all_images_heatmap(self, request, pk=None):
        """
        Returns a Object with all images data by all HUDs to create heatmaps.

        It's being read by the files in:
        `/images/megacube_parts/megacube_{JOB_ID}/image_heatmap_{HUD}.json`
        that has been extracted from `.fits.fz` file.

        Returns: <br>
            (dict): dictionaries
            and 'title'. <br>
                - z ([list[list[number]]]): image data (Matrix 52x52:
                20704 elements) converted utilizing pcolormesh. <br>
                - title ([string]): the title of the HUD.
        """
        galaxy = self.get_object()

        cache_key = f"galaxy_all_Images_{galaxy.pk}"
        data = cache.get(cache_key)
        if data:
            return Response(data)

        hdus = self.get_huds(galaxy)

        all_hdus = hdus["stellar_maps"] + hdus["gas_maps"]

        data = {}

        for idx, hdu in enumerate(all_hdus):
            map = self.read_heatmap_by_hdu(galaxy, hdu)
            data[hdu["internal_name"]] = map

        cache.set(cache_key, data)
        return Response(data)

    @action(detail=True, methods=["get"])
    def images_heatmap(self, request, pk=None):
        """
        Returns a Paginated list of image data by all HUDs to create heatmaps.

        It's being read by the files in:
        `/images/megacube_parts/megacube_{JOB_ID}/image_heatmap_{HUD}.json`
        that has been extracted from `.fits.fz` file.

        Args: <br>
            cursor ([int]): Current page requested.
            pageSize ([int]): Page Size.

        Returns: <br>
            ([list[dict]]): a list of dictionaries containing the 'z'
            and 'title'. <br>
                - z ([list[list[number]]]): image data (Matrix 52x52:
                20704 elements) converted utilizing pcolormesh. <br>
                - title ([string]): the title of the HUD.
        """

        galaxy = self.get_object()

        params = request.query_params
        cursor = int(params.get("cursor", 0))
        page_size = int(params.get("pageSize", 12))

        cache_key = f"galaxy_images_{galaxy.pk}_{cursor}"
        data = cache.get(cache_key)
        if data:
            return Response(data)

        hdus = self.get_huds(galaxy)

        all_hdus = hdus["stellar_maps"] + hdus["gas_maps"]

        total_count = len(all_hdus)

        # Split array in pages with page_size elements
        pages = [all_hdus[i : i + page_size] for i in range(0, total_count, page_size)]

        count_pages = len(pages)

        current_page = pages[cursor]
        list_hdus = current_page

        data = []
        for idx, hdu in enumerate(list_hdus):
            filename = "image_heatmap_%s.json" % hdu["name"]

            image_heatmap_filepath = self.get_image_part_path(galaxy, filename)

            with open(image_heatmap_filepath) as f:
                image = json.load(f)

            image.update(
                {
                    "id": idx + (cursor * page_size + 1),
                    "internal_name": hdu["internal_name"],
                    "name": hdu["name"],
                    "comment": hdu["comment"],
                }
            )
            data.append(image)

        next_id = cursor + 1
        if next_id > (count_pages - 1):
            next_id = None

        previous_id = cursor - 1
        if cursor < 0:
            previous_id = None

        result = dict(
            {
                "data": data,
                "nextId": next_id,
                "previousId": previous_id,
                "count": total_count,
                "pageParam": cursor,
            }
        )
        cache.set(cache_key, result)
        return Response(result)

    @action(detail=True, methods=["get"])
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

        if "x" not in params:
            raise Exception("Parameter x is required")

        if "y" not in params:
            raise Exception("Parameter y is required")

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy)

        flux, lamb = mclass().flux_by_position(megacube, int(params["x"]), int(params["y"]))

        synt, lamb2 = mclass().synt_by_position(megacube, int(params["x"]), int(params["y"]))
        result = dict(
            {
                "flux": flux.tolist(),
                "lamb": lamb.tolist(),
                "synt": synt.tolist(),
            }
        )

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

    @action(detail=True, methods=["get"])
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

        if "x" not in params:
            raise Exception("Parameter x is required")

        if "y" not in params:
            raise Exception("Parameter y is required")

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy)

        log_age = mclass().log_age_by_position(megacube, int(params["x"]), int(params["y"]))

        return Response(log_age)

    @action(detail=True, methods=["get"])
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

        if "x" not in params:
            raise Exception("Parameter x is required")

        if "y" not in params:
            raise Exception("Parameter y is required")

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy)

        vecs = mclass().vecs_by_position(megacube, int(params["x"]), int(params["y"]))

        return Response(vecs)

    @action(detail=True, methods=["get"])
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

        cube_header_filepath = self.get_image_part_path(galaxy, "cube_header.json")

        with open(cube_header_filepath) as f:
            data = json.load(f)

        return Response(data)

    @action(detail=True, methods=["get"])
    def test(self, request, pk=None):
        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy.megacube)

        data = mclass().image_by_hud(megacube, "Adev")

        z = mclass().image_data_to_array(
            data,
        )

        return Response(z)

    @action(detail=True, methods=["get"])
    def spectrum_lines_by_position(self, request, pk=None):
        params = request.query_params

        if "x" not in params:
            raise Exception("Parameter x is required")

        if "y" not in params:
            raise Exception("Parameter y is required")

        x = int(params["x"])
        y = int(params["y"])

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy)

        my_cube = EmissionLines(megacube)
        df = my_cube.to_dataframe(x, y)

        data = dict(
            {
                "wavelength": list(),
                "obs_spec": list(),
                "synt_spec": list(),
            }
        )

        for label in df.columns:
            data[label] = df[label].tolist()
        return Response(data)

    @action(detail=True, methods=["get"])
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

        if "x" not in params:
            raise Exception("Parameter x is required")

        if "y" not in params:
            raise Exception("Parameter y is required")

        x = int(params["x"])
        y = int(params["y"])

        galaxy = self.get_object()

        megacube = self.get_megacube_from_cache(galaxy)

        plot_filename = f"{megacube.name.split('.')[0]}_spec_plot_{x}_{y}.html"

        dir = Path(settings.MEGACUBE_PARTS)
        filepath = dir.joinpath(plot_filename)

        cache_url = posixpath.join(settings.DATA_BASE_URL, plot_filename)
        file_url = posixpath.join(settings.MEGACUBE_PARTS_URL, galaxy.folder_name, plot_filename)

        my_cube = EmissionLines(megacube)
        my_cube.plot(x, y, filepath, "html")

        return Response(dict({"filepath": str(filepath), "url": file_url}))
