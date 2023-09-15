import argparse
import copy
import json
import os
import shutil
import subprocess
import traceback
from datetime import datetime
from pathlib import Path

import matplotlib.pylab as plt
import numpy as np
import requests
from astropy.io import fits as pf
from matplotlib import pyplot
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon


class MangaMegacube:
    megacube: Path
    name: str
    plate_ifu: str
    filename: str
    is_bz2: bool = False
    fits_filename: str
    fits_filepath: Path
    bz2_filename: str
    bz2_filepath: Path
    parts_folder: Path

    GAS_DESC = {
        "Flux_hb": "Hβ Flux",
        "Ew_hb": "Hβ Equivalent width",
        "Vel_hb": "Hβ Velocity",
        "Sigma_hb": "Hβ Velocity dispersion",
        "Flux_o3_4959": "[O III]λ4959 Flux",
        "Ew_o3_4959": "[O III]λ4959 Equivalent width",
        "Vel_o3_4959": "[O III]λ4959 Velocity",
        "Sigma_o3_4959": "[O III]λ4959 Velocity dispersion",
        "Flux_o3_5007": "[O III]λ5007 Flux",
        "Ew_o3_5007": "[O III]λ5007 Equivalent width",
        "Vel_o3_5007": "[O III]λ5007 Velocity",
        "Sigma_o3_5007": "[O III]λ5007 Velocity dispersion",
        "Flux_He1_5876": "He I λ5876 Flux",
        "Ew_He1_5876": "He I λ5876 Equivalent width",
        "Vel_He1_5876": "He I λ5876 Velocity",
        "Sigma_He1_5876": "He I λ5876 Velocity dispersion",
        "Flux_o1_6300": "[O I]λ6300 Flux",
        "Ew_o1_6300": "[O I]λ6300 Equivalent width",
        "Vel_o1_6300": "[O I]λ6300 Velocity",
        "Sigma_o1_6300": "[O I]λ6300 Velocity dispersion",
        "Flux_n2_6548": "[N II]λ6548 Flux",
        "Ew_n2_6548": "[N II]λ6548 Equivalent width",
        "Vel_n2_6548": "[N II]λ6548 Velocity",
        "Sigma_n2_6548": "[N II]λ6548 Velocity dispersion",
        "Flux_ha": "HΑ Flux",
        "Ew_ha": "HΑ Equivalent width",
        "Vel_ha": "HΑ Velocity",
        "Sigma_ha": "HΑ Velocity dispersion",
        "Flux_n2_6583": "[N II]λ6583 Flux",
        "Ew_n2_6583": "[N II]λ6583 Equivalent width",
        "Vel_n2_6583": "[N II]λ6583 Velocity",
        "Sigma_n2_6583": "[N II]λ6583 Velocity dispersion",
        "Flux_s2_6716": "[S II]λ6716 Flux",
        "Ew_s2_6716": "[S II]λ6716 Equivalent width",
        "Vel_s2_6716": "[S II]λ6716 Velocity",
        "Sigma_s2_6716": "[S II]λ6716 Velocity dispersion",
        "Flux_s2_6731": "[S II]λ6731 Flux",
        "Ew_s2_6731": "[S II]λ6731 Equivalent width",
        "Vel_s2_6731": "[S II]λ6731 Velocity",
        "Sigma_s2_6731": "[S II]λ6731 Velocity dispersion",
    }

    def __init__(self, megacube: Path, parts_root: Path = None):
        self.megacube = Path(megacube)
        if not self.megacube.exists():
            raise Exception(f"File not found: {self.megacube}")

        self.name = megacube.name.split("-MEGACUBE")[0]
        print(f"Name: {self.name}")

        self.plate_ifu = self.name.replace("manga-", "")
        print(f"Plate_ifu: {self.plate_ifu}")

        self.filename = megacube.name
        print(f"Filename: {self.filename}")

        self.is_bz2 = True if ".tar.bz2" in megacube.name else False
        print(f"Is Bz2: {self.is_bz2}")

        base_filename = megacube.name.split(".")[0]

        self.fits_filename = f"{base_filename}.fits"
        print(f"Fits filename: {self.fits_filename}")
        self.fits_filepath = self.megacube.parent.joinpath(self.fits_filename)
        print(f"Fits filepath: {self.fits_filepath}")

        self.bz2_filename = f"{base_filename}.fits.tar.bz2"
        print(f"Bz2 filename: {self.bz2_filename}")
        self.bz2_filepath = self.megacube.parent.joinpath(self.bz2_filename)
        print(f"Bz2 filepath: {self.bz2_filepath}")

        if parts_root:
            self.parts_folder = parts_root.joinpath(self.name)
        else:
            self.parts_folder = self.megacube.parent.joinpath(self.name)
        self.parts_folder.mkdir(parents=True, exist_ok=True)
        print(f"Parts Folder: {self.parts_folder}")

    def extract_bz2(self, dest_dir=None):
        if not dest_dir:
            dest_dir = self.megacube.parent
        fits_filepath = dest_dir.joinpath(self.fits_filename)
        try:
            print(f"Unpacking {self.megacube} -> {dest_dir}")
            # tar -xvjf manga-9894-3701-MEGACUBE.fits.tar.bz2
            cmd = ["tar", "xvjf", self.bz2_filepath, "-C", dest_dir]
            output = subprocess.check_output(cmd).decode("utf-8").strip()
            print(f"Tar Output: {output}")
        except Exception:
            print(f"Failed to Unpacking. {traceback.format_exc()}")

        if fits_filepath.exists():
            self.fits_filepath = fits_filepath
            print(f"Fits Filepath: {self.fits_filepath}")
            return fits_filepath
        else:
            raise Exception(f"After unpacking fits file not found. {fits_filepath}")

    def compress_bz2(self, keep_original: bool = False):
        print(f"Compressing Bz2 {self.fits_filepath} -> {self.bz2_filepath}")
        try:
            # Paths de execução
            original_path = os.getcwd()
            # Altera o path de execução
            # A raiz agora é o path dos arquivos.
            os.chdir(self.fits_filepath.parent)
            # tar -cvjf manga-9894-3701-MEGACUBE.fits.tar.bz2 manga-9894-3701-MEGACUBE.fits
            cmd = ["tar", "cvjf", self.bz2_filename, self.fits_filename]
            output = subprocess.check_output(cmd).decode("utf-8").strip()
            print(output)
            os.chdir(original_path)
        except Exception:
            print(f"Failed to compress. {traceback.format_exc()}")

        if self.bz2_filepath.exists():
            if keep_original == False:
                self.fits_filepath.unlink()
            return self.bz2_filepath
        else:
            raise Exception(f"After compress bz2 file not found. {self.bz2_filepath}")

    def fits_exist(self):
        return self.fits_filepath.exists()

    def write_parts_json(self, filename, content):
        # Create directories, if they don't exist already:
        path = self.parts_folder
        path.mkdir(parents=True, exist_ok=True)
        # Join and make the path for the extracted files:
        filepath = path.joinpath(filename)
        # If file already exists, remove it:
        if filepath.exists():
            filepath.unlink()

        with open(filepath, "w") as f:
            json.dump(content, f)

        return filepath

    def write_list_map_json(self, map_names):
        filepath = self.parts_folder
        filename = "list_gas_map.json"
        filepath.mkdir(parents=True, exist_ok=True)
        filepath = filepath.joinpath(filename)
        # If file already exists, remove it:
        if filepath.exists():
            filepath.unlink()

        data = []
        for name in map_names:
            data.append(
                {
                    "name": name,
                    "display_name": name,
                    "comment": self.GAS_DESC.get(name, ""),
                }
            )
        with open(filepath, "w") as f:
            json.dump(dict({"gas_maps": data}), f)

    def center_hexa(self, data_cube, x, y):
        """
        Estimates the center of the hexagonal bundle
        """
        xl = []
        yl = []
        for i in range(y):
            for j in range(x):
                if np.sum(data_cube[:, i, j], axis=0) != 0:
                    xl.append(j)
                    yl.append(i)
        xran, yran = [np.max(xl) - np.min(xl), np.max(yl) - np.min(yl)]
        minx, miny = [np.min(xl), np.min(yl)]
        while yran < 2 * self.rad_flat(y):
            yran += 0.5
            if np.average(yl) < (np.max(yl) - np.min(yl)) / 2.0 + np.min(yl):
                miny -= 0.25
        while xran < 2 * self.rad_corner(y):
            xran += 0.5
            if np.average(xl) < (np.max(xl) - np.min(xl)) / 2.0 + np.min(xl):
                minx -= 0.25
        return (xran / 2.0 + minx, yran / 2.0 + miny)

    def rad_flat(self, size):
        """
        Finds smallest hexagon diameter (flat-to-flat)
        """
        hexasizes_flat = [
            6,
            10.4,
            14.7,
            19,
            23.3,
            27.7,
        ]  # nominal flat diameters of all MaNGA bundles
        hexasizes_flat_expanded = np.add(hexasizes_flat, 4)  # border compensation
        # 20 pix is the typical dimensional excess in the vertical direction
        dist = [abs(item - (size - 20) / 2) for item in hexasizes_flat]
        # find the hexagon y size corresponding compatible with the image shape
        return hexasizes_flat_expanded[dist.index(np.min(dist))]

    def rad_corner(self, size):
        """
        Finds largest hexagon diameter (corner-to-corner)
        """
        hexasizes_corner = [
            7,
            12,
            17,
            22,
            27,
            32,
        ]  # nominal corner diameters of all MaNGA bundles
        hexasizes_corner_expanded = np.add(hexasizes_corner, 4)  # border compensation
        # 10 pix is the typical dimensional excess in the horizontal direction
        dist = [abs(item - (size - 10) / 2) for item in hexasizes_corner]
        # find the hexagon x size corresponding compatible with the image shape
        return hexasizes_corner_expanded[dist.index(np.min(dist))]

    def find_corners(self, center, radius):
        xy_array = [[], []]
        xy_tuple = []
        xy_array[0].append(center[0] + radius - 0.5)
        xy_array[1].append(center[1] - 0.5)
        xy_tuple.append((center[0] + radius - 0.5, center[1] - 0.5))
        xy_array[0].append(center[0] + radius / 2.0 - 0.5)
        xy_array[1].append(center[1] + radius * np.sqrt(3) / 2.0 - 0.5)
        xy_tuple.append(
            (
                center[0] + radius / 2.0 - 0.5,
                center[1] + radius * np.sqrt(3) / 2.0 - 0.5,
            )
        )
        xy_array[0].append(center[0] - radius / 2.0 - 0.5)
        xy_array[1].append(center[1] + radius * np.sqrt(3) / 2.0 - 0.5)
        xy_tuple.append(
            (
                center[0] - radius / 2.0 - 0.5,
                center[1] + radius * np.sqrt(3) / 2.0 - 0.5,
            )
        )
        xy_array[0].append(center[0] - radius - 0.5)
        xy_array[1].append(center[1] - 0.5)
        xy_tuple.append((center[0] - radius - 0.5, center[1] - 0.5))
        xy_array[0].append(center[0] - radius / 2.0 - 0.5)
        xy_array[1].append(center[1] - radius * np.sqrt(3) / 2.0 - 0.5)
        xy_tuple.append(
            (
                center[0] - radius / 2.0 - 0.5,
                center[1] - radius * np.sqrt(3) / 2.0 - 0.5,
            )
        )
        xy_array[0].append(center[0] + radius / 2.0 - 0.5)
        xy_array[1].append(center[1] - radius * np.sqrt(3) / 2.0 - 0.5)
        xy_tuple.append(
            (
                center[0] + radius / 2.0 - 0.5,
                center[1] - radius * np.sqrt(3) / 2.0 - 0.5,
            )
        )
        return (xy_array, xy_tuple)

    def get_headers(self, extension):
        cube_header = pf.getheader(self.fits_filepath, extension)
        return cube_header

    def get_data(self, extension, x=None, y=None):
        cube_data = pf.getdata(self.fits_filepath, extension)

        if x is not None and y is not None:
            return cube_data[:, int(y), int(x)]

        return cube_data

    def get_comments(self, extension):
        cube_header = self.get_headers("PoPBins")

        cube_data = self.get_data("PoPBins")

        z = np.shape(cube_data)[0]

        cube_comments = {}

        for i in range(0, z, 1):
            try:
                cube_comments[cube_header["DATA" + str(i)]] = cube_header.comments["DATA" + str(i)]

            except:
                cube_comments[cube_header["DATA" + str(i)]] = ""

        return cube_comments

    def get_all_hud(self, extension):
        cube_header = self.get_headers(extension)

        cube_data = self.get_data(extension)

        z = np.shape(cube_data)[0]

        lHud = []
        for i in range(0, z, 1):
            lHud.append(cube_header["DATA" + str(i)])

        return lHud

    def image_by_hud(self, hud):
        cube_data = self.get_data("PoPBins")
        lHud = self.get_all_hud("PoPBins")
        idxHud = lHud.index(hud)
        mask = self.get_data("SN_MASKS_1")

        (z, y, x) = np.shape(cube_data)

        imag = cube_data[idxHud, :, :]
        center = self.center_hexa(cube_data, x, y)
        corners_array, corners_tuple = self.find_corners(center, self.rad_corner(y))
        polygon = Polygon(corners_tuple)

        fig, ax = pyplot.subplots()
        ax.set_aspect("equal")
        imagb = copy.deepcopy(imag)

        for i in range(x):
            for j in range(y):
                if polygon.contains(Point(j, i)) == False:
                    # imagb[i, j] = 'nan'
                    imagb[i, j] = 0

        imagb[np.where(mask == 1)] = np.nan

        flux_image = ax.imshow(imagb, origin="lower").get_array()

        result = flux_image.tolist(fill_value=None)

        # Close images resolve the Warning "figure.max_open_warning"
        pyplot.close("all")
        return result

    def get_image_flux_data(self):
        cube_data = self.get_data("FLUX")
        mask = self.get_data("SN_MASKS_1")

        (z, y, x) = np.shape(cube_data)
        imag = np.sum(cube_data[:, :, :], axis=0)
        center = self.center_hexa(cube_data, x, y)
        corners_array, corners_tuple = self.find_corners(center, self.rad_corner(y))
        polygon = Polygon(corners_tuple)

        fig, ax = pyplot.subplots()
        ax.set_aspect("equal")
        imagb = copy.deepcopy(imag)

        for i in range(x):
            for j in range(y):
                if polygon.contains(Point(j, i)) == False:
                    # imagb[i, j] = 'nan'
                    imagb[i, j] = 0

        imagb[np.where(mask == 1)] = np.nan

        flux_image = ax.imshow(imagb, origin="lower").get_array()

        return flux_image.tolist(fill_value=None)

    def extract_megacube_header(self):
        """
        It extracts the Megacube Header from 'PoPBins' HUD
        and save them in a very small JSON file in the parts_folder
        {self.name}/cube_header.json.
        """
        content = repr(self.get_headers("PopBins")).split("\n")

        filename = "cube_header.json"

        return self.write_parts_json(filename, content)

    def exctract_original_image(self):
        """
        It extracts the Origimal Image (zero) data from 'FLUX' HUD
        for each image and save them in a very small JSON file in the parts_folder
        /{parts_folders}/original_image.json.
        """
        cube_data = self.get_image_flux_data()
        content = dict(
            {
                "z": cube_data,
                "title": "FLUX",
            }
        )

        filename = "original_image.json"
        return self.write_parts_json(filename, content)

    def extract_list_hud(self):
        """
        It extracts the List of HUDs from 'PoPBins' HUD
        for each image and save them in a very small JSON file in the parts_folder
        /{parts_folders}/list_hud.json.
        """
        cube_comments = self.get_comments("PoPBins")

        lHud = self.get_all_hud("PoPBins")

        dHud = []

        for hud in lHud:
            dHud.append({"name": hud, "display_name": hud, "comment": cube_comments[hud]})

        dHud = sorted(dHud, key=lambda i: i["display_name"])

        content = {"hud": dHud}

        filename = "list_hud.json"

        return self.write_parts_json(filename, content)

    def cube_part_exist(self, filename):
        exists = self.parts_folder.joinpath(filename).exists()
        if not exists:
            print(f"File not Found: {filename}")
        return exists

    def extract_image_heatmap(self, overwrite: bool = False):
        """
        It extracts all the Image Heatmaps from 'PoPBins' HUD
        for each image and for each HUD saved in the file
        /{parts_folder}/list_hud.json
        and save them in very small JSON files in the path
        /{parts_folder}/image_heatmap_{HUD}.json
        """
        lHud = self.get_all_hud("PoPBins")
        files = []

        for hud in lHud:
            filename = "image_heatmap_%s.json" % hud

            if self.cube_part_exist(filename) == True and overwrite == False:
                # print(f"Heatmap: {hud} SKIPED")
                pass
            else:
                image_data = self.image_by_hud(hud)
                content = dict(
                    {
                        "z": image_data,
                        "title": hud,
                    }
                )
                filepath = self.write_parts_json(filename, content)
                files.append(filepath)
                # print(f"Heatmap: {str(filepath).ljust(80, ' ')}")

        return files

    def extract_gas_maps_heatmap(self, overwrite: bool = False):
        parameters = pf.getdata(self.fits_filepath, "PARNAMES")
        solution = pf.getdata(self.fits_filepath, "SOLUTION")
        flux = pf.getdata(self.fits_filepath, "FLUX_M")
        eqw = pf.getdata(self.fits_filepath, "EQW_M")
        mask = pf.getdata(self.fits_filepath, "SN_MASKS_1")

        i = 0  # indice do solution
        j = 0  # indice do flux e do eqw

        plots = int(len(parameters) / 3)  # para controlar os plots
        k = 1  # contador dos plots
        # Fazendo uma figura bem grande (pode dar zoom)
        plt.figure(figsize=(50, 50))

        map_names = []
        maps = []

        for p in parameters:
            p = np.asarray(p)
            if p[1] == "A":
                # nome para salvar o mapa de fluxo (usei no label do plot)
                save_name_flux = "Flux_" + p[0]
                map_names.append(save_name_flux)

                filename = f"image_heatmap_{save_name_flux}.json"
                if self.cube_part_exist(filename) == True and overwrite == False:
                    # print(f"GAS MAP: {save_name_flux} SKIPED")
                    pass
                else:
                    # array (44,44) com os valores do mapa de flux a serem salvos
                    save_flux = flux[j]
                    save_flux[np.where(mask == 1)] = np.nan
                    plt.subplot(plots, 4, k)
                    k = k + 1
                    # data = plt.imshow(save_flux,origin='lower')
                    # plt.gca().set_title(save_name_flux)   # titulo do plot
                    # plt.colorbar()   # barra de cores
                    # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                    data = plt.imshow(save_flux, origin="lower").get_array()
                    maps.append(
                        dict(
                            {
                                "z": data.tolist(fill_value=None),
                                "title": save_name_flux,
                            }
                        )
                    )

                # nome para salvar o mapa de eqw (usei no label do plot)
                save_name_ew = "Ew_" + p[0]
                map_names.append(save_name_ew)

                filename = f"image_heatmap_{save_name_ew}.json"
                if self.cube_part_exist(filename) == True and overwrite == False:
                    # print(f"GAS MAP: {save_name_ew} SKIPED")
                    pass
                else:
                    # array (44,44) com os valores do mapa de ew a serem salvos
                    save_ew = -1 * eqw[j]
                    save_ew[np.where(mask == 1)] = np.nan
                    # NOTA: O EW precisa ser multiplicado por -1 para inverter o sinal (nao pode usar abs)
                    plt.subplot(plots, 4, k)
                    k = k + 1
                    # plt.imshow(save_ew,origin='lower') # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                    # plt.gca().set_title(save_name_ew)  # titulo do plot
                    # plt.colorbar()   # barra de cores
                    # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                    data = plt.imshow(save_ew, origin="lower").get_array()
                    maps.append(
                        dict(
                            {
                                "z": data.tolist(fill_value=None),
                                "title": save_name_ew,
                            }
                        )
                    )

                    j = j + 1  # contador de indice de flux e eqw

            elif p[1] == "v":
                # nome para salvar o mapa de velocidades (usei no label do plot)
                save_name_vel = "Vel_" + p[0]
                map_names.append(save_name_vel)

                filename = f"image_heatmap_{save_name_vel}.json"
                if self.cube_part_exist(filename) == True and overwrite == False:
                    # print(f"GAS MAP: {save_name_vel} SKIPED")
                    pass
                else:
                    # array (44,44) com os valores do mapa de velocidade a serem salvos
                    save_vel = solution[i]
                    save_vel[np.where(mask == 1)] = np.nan
                    plt.subplot(plots, 4, k)
                    k = k + 1
                    # plt.imshow(save_vel,origin='lower') # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                    # plt.gca().set_title(save_name_vel) # titulo do plot
                    # plt.colorbar()   # barra de cores
                    # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                    data = plt.imshow(save_vel, origin="lower").get_array()
                    maps.append(
                        dict(
                            {
                                "z": data.tolist(fill_value=None),
                                "title": save_name_vel,
                            }
                        )
                    )

            elif p[1] == "s":
                # nome para salvar o mapa de sigma (usei no label do plot)
                save_name_sig = "Sigma_" + p[0]
                map_names.append(save_name_sig)

                filename = f"image_heatmap_{save_name_sig}.json"
                if self.cube_part_exist(filename) == True and overwrite == False:
                    # print(f"GAS MAP: {save_name_sig} SKIPED")
                    pass
                else:
                    # array (44,44) com os valores do mapa de sigma a serem salvos
                    save_sig = solution[i]
                    save_sig[np.where(mask == 1)] = np.nan
                    plt.subplot(plots, 4, k)
                    k = k + 1
                    # plt.imshow(save_sig,origin='lower')  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                    # plt.gca().set_title(save_name_sig)  # titulo do plot
                    # plt.colorbar()   # barra de cores
                    # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                    data = plt.imshow(save_sig, origin="lower").get_array()
                    maps.append(
                        dict(
                            {
                                "z": data.tolist(fill_value=None),
                                "title": save_name_sig,
                            }
                        )
                    )

            # contador para o solution (note que eu pulo o A ao salvar por que salvo o Flux e EW no lugar)
            i = i + 1

        result = []
        for map in maps:
            filepath = self.write_parts_json(f"image_heatmap_{map['title']}.json", map)
            result.append({"name": map["title"], "filepath": str(filepath)})
            # print(f"GAS MAP: {str(filepath).ljust(80, ' ')}")

        self.write_list_map_json(map_names)

        return result

    def extract_megacube_parts(self, overwrite: bool = False):
        print("Extracting Megacube Parts")

        headers_json = "SKIPED"
        if self.cube_part_exist("cube_header.json") == False or overwrite == True:
            headers_json = self.extract_megacube_header()
        print(f"Headers Json: {headers_json}")

        # Flux image
        original_image = "SKIPED"
        if self.cube_part_exist("original_image.json") == False or overwrite == True:
            original_image = self.exctract_original_image()
        print(f"Original Image: {original_image}")

        # HDU List
        hdu_list = "SKIPED"
        if self.cube_part_exist("list_hud.json") == False or overwrite == True:
            hdu_list = self.extract_list_hud()
        print(f"HDU List: {hdu_list}")

        # Images Heatmap by HUD
        heatmaps = self.extract_image_heatmap(overwrite)
        print(f"Images Heatmap Created: {len(heatmaps)}")

        maps_names = self.extract_gas_maps_heatmap(overwrite)
        print(f"Gas Map Created: {len(maps_names)}")

    def check_extracted_parts(self, bz2: bool = True, fits: bool = True):
        # Headers
        if not self.cube_part_exist("cube_header.json"):
            return False
        # Original Image
        if not self.cube_part_exist("original_image.json"):
            return False
        # HDU List
        if not self.cube_part_exist("list_hud.json"):
            return False
        # GAS Maps HDUs
        if not self.cube_part_exist("list_gas_map.json"):
            return False
        # SDSS Image
        if not self.cube_part_exist("sdss_image.jpg"):
            return False
        # Check if all HDUs have a json file
        if not self.check_heatmaps():
            return False
        # Check if all GAS HDUs have a json file
        if not self.check_gas_heatmaps():
            return False
        # Check if the bz2 file is still in the directory
        if not self.bz2_filepath.exists():
            print("Bz2 file not found.")
            return False
        # Check if fits file is still in the directory
        if not self.fits_filepath.exists():
            print("Fits file not found.")
            return False

        return True

    def check_heatmaps(self):
        with open(self.parts_folder.joinpath("list_hud.json")) as json_file:
            data = json.load(json_file)
            hdus = data["hud"]
            for hdu in hdus:
                filename = f"image_heatmap_{hdu['name']}.json"
                if not Path(self.parts_folder.joinpath(filename)).exists():
                    return False
        return True

    def check_gas_heatmaps(self):
        with open(self.parts_folder.joinpath("list_gas_map.json")) as json_file:
            data = json.load(json_file)
            hdus = data["gas_maps"]
            for hdu in hdus:
                filename = f"image_heatmap_{hdu['name']}.json"
                if not Path(self.parts_folder.joinpath(filename)).exists():
                    return False
        return True

    def update_megacube_header(self):
        print("Updating fits headers.")
        PAPER = "Riffel et. al. 2023, MNRAS, XXXX, YYYY"
        try:
            with pf.open(self.fits_filepath, mode="update") as file:
                header = file["PopBins"].header
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))
                header.insert(10, "PLATEIFU")
                header.update(PLATEIFU=(self.plate_ifu))
                header.insert(11, "FILENAME")
                header.update(FILENAME=(self.filename))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.update(SUMMARY=("Synthesis Parameters & Binned Population Vectors"))
                header.update(DATA0=("FC1.50   ", "Featureless continuum F_nu ~ nu^-1.5"))
                header.update(DATA1=("xyy_light", "Light binned pop: 9.0E+05 < age <= 1.0E+07"))
                header.update(DATA2=("xyo_light", "Light binned pop: 1.4E+07 < age <= 5.6E+07"))
                header.update(DATA3=("xiy_light", "Light binned pop: 1.0E+08 < age <= 5.0E+08"))
                header.update(DATA4=("xii_light", "Light binned pop: 6.3E+08 < age <= 8.0E+08"))
                header.update(DATA5=("xio_light", "Light binned pop: 8.9E+08 < age <= 2.0E+09"))
                header.update(DATA6=("xo_light", "Light binned pop: 5.0E+09 < age <= 1.3E+10"))
                header.update(DATA7=("xyy_mass", "Mass binned pop:  9.0E+05 < age <= 1.0E+07"))
                header.update(DATA8=("xyo_mass", "Mass binned pop:  1.4E+07 < age <= 5.6E+07"))
                header.update(DATA9=("xiy_mass", "Mass binned pop:  1.0E+08 < age <= 5.0E+08"))
                header.update(DATA10=("xii_mass", "Mass binned pop:  6.3E+08 < age <= 8.0E+08"))
                header.update(DATA11=("xio_mass", "Mass binned pop:  8.9E+08 < age <= 2.0E+09"))
                header.update(DATA12=("xo_mass ", "Mass binned pop:  5.0E+09 < age <= 1.3E+10"))
                header.update(DATA13=("SFR_1   ", "over last 1 Myrs"))
                header.update(DATA14=("SFR_5   ", "over last 5 Myrs"))
                header.update(DATA15=("SFR_10  ", "over last 10 Myrs"))
                header.update(DATA16=("SFR_14  ", "over last 14 Myrs"))
                header.update(DATA17=("SFR_20  ", "over last 20 Myrs"))
                header.update(DATA18=("SFR_30  ", "over last 30 Myrs"))
                header.update(DATA19=("SFR_56  ", "over last 56 Myrs"))
                header.update(DATA20=("SFR_100 ", "over last 100 Myrs"))
                header.update(DATA21=("SFR_200 ", "over last 200 Myrs"))
                header.update(DATA22=("Av      ", "Optical extinction"))
                header.update(DATA23=("Mage_L  ", "Mean age light weigthed"))
                header.update(DATA24=("Mage_M  ", "Mean age mass weigthed"))
                header.update(DATA25=("MZ_L    ", "Mean metalicity light weigthed"))
                header.update(DATA26=("MZ_M    ", "Mean metalicity mass weigthed"))
                header.update(
                    DATA27=(
                        "Mstar   ",
                        "Present mass in stars (Msun, M* from starligh)",
                    )
                )
                header.update(DATA28=("Mpross  ", "Mass processed in stars (~2xMstar)"))
                header.update(DATA29=("F_Norm  ", "Normalization flux in input units"))
                header.update(
                    DATA30=(
                        "Sigma_star",
                        "Stellar dispersion vel. (see starlight manual)",
                    )
                )
                header.update(DATA31=("vrot_star", "Stellar rotation vel. (see starlight manual)"))
                header.update(DATA32=("Adev    ", "Precentage mean deviation (see manual)"))
                header.update(DATA33=("ChiSqrt ", "ChiSqrt/Nl_eff (see manual)"))
                header.update(DATA34=("SNR     ", "SNR on normalization window"))
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                for i in range(35, 121, 1):
                    header.pop("DATA" + str(i))

                header = file["BaseAgeMetal"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(8, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["PoPVecsL"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["PoPVecsM"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["FLXOBS"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["FLXSYN"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["WEIGHT"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["SN_MASKS_1"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["SN_MASKS_5"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["SN_MASKS_10"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                header = file["SN_MASKS_20"].header
                header.update(AUTHORS=("N. D. Mallmann (nicolas.mallmann@ufrgs.br) & R. Riffel (riffel@ufrgs.br)"))
                header.rename_keyword("OBJECT", "SUMMARY")
                header.insert(9, "PAPER")
                header.update(PAPER=(PAPER))

                file.flush()
        except Exception as e:
            msg = f"Failed to update headers. {e}"
            print(msg)
            raise Exception(msg)

    def download_sdss_image(self, ra, dec, overwrite: bool = False):
        """
        It downloads the SDSS Image by its RA and Dec
        for each image and save them in the path
        /images/megacube_parts/megacube_{JOB_ID}/sdss_image.jpg
        """
        # Object directory in Images Megacube Parts.
        parts_path = self.parts_folder
        filename = "sdss_image.jpg"

        if self.cube_part_exist(filename) == True and overwrite == False:
            print("Downloading SDSS Image [SKIPED]")
        else:
            print("Downloading SDSS Image [%s]" % str(self.megacube))

            # Set up the image URL and filename
            image_url = (
                "http://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Chart.Image&ra=%s&dec=%s&scale=0.099515875&width=512&height=512&opt=G&query="
                % (ra, dec)
            )

            # Open the url image, set stream to True, this will return the stream content.
            r = requests.get(image_url, stream=True)

            # Check if the image was retrieved successfully
            if r.status_code == 200:
                # Set decode_content value to True, otherwise the downloaded image file's size will be zero.
                r.raw.decode_content = True

                filepath = Path(parts_path).joinpath(filename)
                if filepath.exists():
                    filepath.unlink()

                # Open a local file with wb ( write binary ) permission.
                with open(filepath, "wb") as f:
                    shutil.copyfileobj(r.raw, f)
                print("Finished Download SDSS Images!")
            else:
                print("SDSS Image [%s] could not be retrieved" % str(self.megacube))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract MANGA megacube.")
    parser.add_argument("filepath")

    args = parser.parse_args()
    filepath = Path(args.filepath)
    filename = filepath.name
    result_folder = filepath.parent

    try:
        log_file = result_folder.joinpath(f"{filename}.log")

        # orig_stdout = sys.stdout
        # f = open(log_file, "w")
        # sys.stdout = f

        t0 = datetime.now()

        print(f"Running: {filepath}")

        cube = MangaMegacube(filepath)

        # print("Extraindo arquivo bz2.")
        fits_filepath = cube.extract_bz2()
        # os.rename(filepath, filepath.with_suffix(".bz2.bk"))
        # filepath.unlink()

        # print("Updating Headers")
        # cube.update_megacube_header()
        # print("Extracting images")
        cube.extract_megacube_parts()
        # print("Compressing Bz2")
        # cube.compress_bz2()
        fits_filepath = cube.fits_filepath()
        fits_filepath.unlink()

        t1 = datetime.now()
        tdelta = t1 - t0
        print(f"Exec Time: {tdelta}")

        # sys.stdout = orig_stdout
        # f.close()

        success_file = result_folder.joinpath(f"{filename}_ok")
        with open(success_file, "w") as f:
            f.write(str(tdelta))

    except Exception as e:
        error_file = result_folder.joinpath(f"{filename}_error")
        with open(error_file, "w") as f:
            f.write(e)
