#!/usr/bin/python

###########################################################################
# Author: Rogerio Riffel                                                  #
# This is an adaptation of fit_scrutinizer written by Daniel Ruschel Duta #
# and avaliable at: https://bitbucket.org/danielrd6/ifscube/              #
#                                                                         #
###########################################################################


import copy

# import the logging library
import logging
import re

# local
import sys

# third party
import numpy as np
from astropy.io import fits as pf
from django.core.cache import cache
from matplotlib import pyplot
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

# import tkinter as tk


# Get an instance of a logger
logger = logging.getLogger(__name__)


class mclass:
    def flux_by_position(self, megacube, x, y, hud="FLXOBS"):
        cache_key = f"{megacube.name}_{hud}"
        flux = cache.get(cache_key)
        if not flux:
            flux = pf.getdata(megacube, hud)
            cache.set(cache_key, flux)

        lamb = self.get_lamb(megacube, flux, hud)

        return (flux[:, y, x], lamb)

    def synt_by_position(self, megacube, x, y, hud="FLXSYN"):
        synt = pf.getdata(megacube, hud)

        lamb = self.get_lamb(megacube, synt, hud)

        return (synt[:, int(y), int(x)], lamb)

    def get_lamb(self, megacube, flux, hud="FLXOBS"):
        l0 = pf.getheader(megacube, hud)["CRVAL3"]
        dl = pf.getheader(megacube, hud)["CD3_3"]

        (size, ypix, xpix) = np.shape(flux)
        lamb = np.arange(l0, (dl * size + l0), dl)

        return lamb

    def get_headers(self, megacube, extension):
        cube_header = pf.getheader(megacube, extension)
        return cube_header

    def get_comments(self, megacube, extension):
        cube_header = self.get_headers(megacube, "PoPBins")

        cube_data = self.get_cube_data(megacube, "PoPBins")

        z = np.shape(cube_data)[0]

        cube_comments = {}

        for i in range(0, z, 1):
            try:
                cube_comments[cube_header["DATA" + str(i)]] = cube_header.comments["DATA" + str(i)]

            except:
                cube_comments[cube_header["DATA" + str(i)]] = ""

        return cube_comments

    def get_cube_data(self, megacube, extension, x=None, y=None):
        cube_data = pf.getdata(megacube, extension)

        if x is not None and y is not None:
            return cube_data[:, int(y), int(x)]

        return cube_data

    def get_all_hud(self, cube_header, cube_data):
        z = np.shape(cube_data)[0]

        lHud = []
        for i in range(0, z, 1):
            lHud.append(cube_header["DATA" + str(i)])

        return lHud

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

    def get_original_cube_data(self, megacube):
        cube_data = pf.getdata(megacube, "FLUX")
        mask = pf.getdata(megacube, "SN_MASKS_1")

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

    # def get_original_cube_data(self, megacube):
    #     cube_data = pf.getdata(megacube, 'FLUX')

    #     z = np.sum(cube_data[:, :, :], axis=0).tolist()

    #     return z

    def image_by_hud(self, megacube, hud):
        cube_header = self.get_headers(megacube, "PoPBins")

        cube_data = self.get_cube_data(megacube, "PoPBins")

        lHud = self.get_all_hud(cube_header, cube_data)

        idxHud = lHud.index(hud)

        mask = pf.getdata(megacube, "SN_MASKS_1")

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

    def spaxel_fit_by_position(
        self,
        megacube,
        x,
        y,
    ):
        """
        Central Spaxel Best Fit
        Return [(Age, Z, Lfrac, Mfrac)]
        """
        cube_header = self.get_headers(megacube, "PoPBins")
        cube_data = self.get_cube_data(megacube, "PoPBins")
        data_cube_lfrac = self.get_cube_data(megacube, "PoPVecsL", x, y)
        data_cube_mfrac = self.get_cube_data(megacube, "PoPVecsM", x, y)

        z = np.shape(cube_data)[0]

        temp_rows = []
        rows = []
        for idx in range(z + 1, len(cube_header)):
            try:
                # t = Age
                # met = Z
                ssp, t, met = re.split(",", cube_header["DATA" + str(idx)])

                temp_rows.append((t.strip(), met.strip()))
            except Exception:
                pass

        for idx in range(0, len(temp_rows)):
            age = temp_rows[idx][0]
            met = temp_rows[idx][1]
            try:
                lfrac = data_cube_lfrac[idx]
            except Exception:
                lfrac = None

            try:
                mfrac = data_cube_mfrac[idx]
            except Exception:
                mfrac = None

            # Age, Z, Lfrac, Mfrac
            row = (age, float(met), float(lfrac), float(mfrac))
            rows.append(row)

        return rows

    def log_age_by_position(self, megacube, x, y):
        summedpopx = []
        summedpopxTemp = []
        summedpopxTemp2 = []
        summedpopm = []
        summedpopmTemp = []
        summedpopmTemp2 = []

        popx = self.get_cube_data(megacube, "PoPVecsL", x, y)
        popm = self.get_cube_data(megacube, "PoPVecsM", x, y)

        aux = pf.getdata(megacube, "BaseAgeMetal")
        popage = aux[:, 0]
        popZ = aux[:, 1]
        zs = np.unique(popZ)[np.unique(popZ) != 0]

        for z in zs:
            if len(popZ[popZ == z]) == 0:
                print(
                    "Metallicity",
                    z,
                    " is not in the base, I hope you know wath you are doing!",
                )

            summedpopxTemp.append(popx[popZ == z])
            summedpopxTemp2 = np.column_stack(summedpopxTemp)
            summedpopmTemp.append(popm[popZ == z])
            summedpopmTemp2 = np.column_stack(summedpopmTemp)

        for ind in range(0, len(summedpopxTemp2)):
            summedpopx = np.append(summedpopx, sum(summedpopxTemp2[ind]))
            summedpopm = np.append(summedpopm, sum(summedpopmTemp2[ind]))

        summedpopages = popage[popZ == zs[0]]

        result = dict(
            {
                "x": list(np.log10(summedpopages)),
                "y": list(summedpopx),
                "m": list(summedpopm),
            }
        )

        return result

    def index_of(self, val, in_list):
        try:
            return in_list.index(val)
        except ValueError:
            return -1

    def vecs_by_position(self, megacube, x, y):
        xaxis = np.array([])
        yaxis = np.array([])
        maxis = np.array([])
        mlegend = np.array([])

        cube_header = self.get_headers(megacube, "PopBins")
        cube_data = self.get_cube_data(megacube, "PopBins")

        vecs = 0
        for i in range(0, np.shape(cube_data)[0], 1):
            if "light" in cube_header["DATA" + str(i)]:
                vecs = vecs + 1

        cube_header_list = repr(cube_header).split("\n")

        for k in np.arange(vecs + 1):
            xaxis = np.append(xaxis, k)
            yaxis = np.append(yaxis, cube_data[k, int(y), int(x)])
            maxis = np.append(maxis, cube_header["DATA" + str(k)])
            for j in range(0, len(cube_header_list)):
                if self.index_of("DATA" + str(k) + " ", str(cube_header_list[j])) > -1:
                    mlegend = np.append(mlegend, str(cube_header_list[j]).split("/")[1].strip())

        return dict(
            {
                "x": list(xaxis),
                "y": list(yaxis),
                "m": list(maxis),
                "mlegend": list(mlegend),
            }
        )

    def get_metadata(self, megacube):
        result = dict({})

        # The drpall-v2_7_1.fits file has two HDUs, different from the drpall-v1_5_1.fits. So, because of this, a range of bigger than 1 and smaller than 3 was set, joined with a try/except to ignore the unexisting HDU index in drpall-v1_5_1.fits.
        for index in range(1, 3):
            try:
                # BinTableHDU FITS_rec
                data = self.get_cube_data(megacube, index)

                # Requested columns
                columns = data.columns

                # Same attributes, in both files, with different names
                same_attribute_columns = [
                    {
                        "mpl4": "iauname",
                        "mpl9": "nsa_iauname",
                    },
                    {
                        "mpl4": "field",
                        "mpl9": "nsa_field",
                    },
                    {
                        "mpl4": "run",
                        "mpl9": "nsa_run",
                    },
                    {
                        "mpl4": "nsa_id",
                        "mpl9": "nsa_nsaid",
                    },
                    {
                        "mpl4": "nsa_redshift",
                        "mpl9": "nsa_z",
                    },
                    {
                        "mpl4": "nsa_absmag",
                        "mpl9": "nsa_sersic_absmag",
                    },
                    {
                        "mpl4": "nsa_absmag_el",
                        "mpl9": "nsa_elpetro_absmag",
                    },
                    {
                        "mpl4": "nsa_amivar_el",
                        "mpl9": "nsa_elpetro_amivar",
                    },
                    {
                        "mpl4": "nsa_mstar",
                        "mpl9": "nsa_sersic_mass",
                    },
                    {
                        "mpl4": "nsa_mstar_el",
                        "mpl9": "nsa_elpetro_mass",
                    },
                    {
                        "mpl4": "nsa_ba",
                        "mpl9": "nsa_elpetro_ba",
                    },
                    {
                        "mpl4": "nsa_phi",
                        "mpl9": "nsa_elpetro_phi",
                    },
                    {
                        "mpl4": "nsa_petroflux",
                        "mpl9": "nsa_petro_flux",
                    },
                    {
                        "mpl4": "nsa_petroflux_ivar",
                        "mpl9": "nsa_petro_flux_ivar",
                    },
                    {
                        "mpl4": "nsa_petroflux_el",
                        "mpl9": "nsa_elpetro_flux",
                    },
                    {
                        "mpl4": "nsa_petroflux_el_ivar",
                        "mpl9": "nsa_elpetro_flux_ivar",
                    },
                    {
                        "mpl4": "nsa_sersicflux",
                        "mpl9": "nsa_sersic_flux",
                    },
                    {"mpl4": "nsa_sersicflux_ivar", "mpl9": "nsa_sersic_flux_ivar"},
                ]

                # Some attributes exist in both mpl4 and mpl9 metadata file with different names.
                # Here we loop through the these columns and change their name according to the latest version, which is the mpl9 file.
                for column in same_attribute_columns:
                    if column["mpl4"] in columns.names:
                        columns.change_name(col_name=column["mpl4"], new_name=column["mpl9"])

                for column in columns.names:
                    # In case of having the column in the file, insert its data to the result dictionary
                    try:
                        # The index 3218, in the drpall-v1_5_1.fits file, had a numpy float64 nan.
                        # Because of this, I've set this nan_to_num, where the nan will be converted to 0.
                        field_data = np.nan_to_num(data.field(column))

                        # If the current column index does not exist, then fill it with the new data
                        if column not in result:
                            result[column] = field_data

                        # Otherwise, concatenate the values. It'll happen only in drpall-v2_7_1.fits file, because of its two HDUs.
                        else:
                            result[column] = [*result[column], *field_data]

                    except:
                        pass
            except:
                pass

        return result


if __name__ == "__main__":
    filename = sys.argv[1]
