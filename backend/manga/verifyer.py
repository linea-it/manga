#!/usr/bin/python
# -*- coding: utf-8 -*-

###########################################################################
# Author: Rogerio Riffel                                                  #
# This is an adaptation of fit_scrutinizer written by Daniel Ruschel Duta #
# and avaliable at: https://bitbucket.org/danielrd6/ifscube/              #
#                                                                         #
###########################################################################


import argparse
import re
# local
import sys
# import tkinter as tk

# third party
import matplotlib
from matplotlib import pyplot
import numpy as np
from astropy.io import fits as pf
# from matplotlib.backends.backend_tkagg import (FigureCanvasTkAgg,
#                                                NavigationToolbar2Tk)
# from matplotlib.figure import Figure
# from mpl_toolkits.axes_grid1 import make_axes_locatable
# from numpy import ma

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)


class mclass:
    def flux_by_position(self, megacube, x, y, hud='FLXNORM'):
        flux = pf.getdata(megacube, hud)

        lamb = self.get_lamb(megacube, flux, hud)

        return (flux[:, y, x], lamb)

    def synt_by_position(self, megacube, x, y, hud='FLXSYN'):
        synt = pf.getdata(megacube, hud)

        lamb = self.get_lamb(megacube, synt, hud)

        return (synt[:, int(y), int(x)], lamb)

    def get_lamb(self, megacube, flux, hud='FLXNORM'):
        l0 = pf.getheader(megacube, hud)['CRVAL3']
        dl = pf.getheader(megacube, hud)['CD3_3']

        (size, ypix, xpix) = np.shape(flux)
        lamb = np.arange(l0, (dl * size + l0), dl)

        return lamb

    def get_headers(self, megacube, extension):
        cube_header = pf.getheader(megacube, extension)
        return cube_header

    def get_comments(self, megacube, extension):
        cube_header = self.get_headers(megacube, 'PoPBins')

        cube_data = self.get_cube_data(megacube, 'PoPBins')

        z = np.shape(cube_data)[0]

        cube_comments = dict()

        for i in range(0, z, 1):
            try:
                cube_comments[cube_header['DATA' +
                                          str(i)]] = cube_header.comments['DATA' + str(i)]

            except:
                cube_comments[cube_header['DATA' +
                                          str(i)]] = ''

        return cube_comments

    def get_cube_data(self, megacube, extension, x=None, y=None):
        cube_data = pf.getdata(megacube, extension)

        if x is not None and y is not None:
            return cube_data[:, int(y), int(x)]

        return cube_data

    def get_all_hud(self, cube_header, cube_data):
        z = np.shape(cube_data)[0]

        lHud = list()
        for i in range(0, z, 1):
            lHud.append(cube_header['DATA' + str(i)])

        return lHud

    def get_original_cube_data(self, megacube):
        cube_data = pf.getdata(megacube, 'FLUX')

        z = np.sum(cube_data[:, :, :], axis=0).tolist()

        return z

    def image_by_hud(self, megacube, hud):

        cube_header = self.get_headers(megacube, 'PoPBins')

        cube_data = self.get_cube_data(megacube, 'PoPBins')

        lHud = self.get_all_hud(cube_header, cube_data)

        idxHud = lHud.index(hud)

        image_data = cube_data[idxHud, :, :]

        # Transforming "masked" values to zero:
        image_data[np.isnan(image_data)] = 0

        return image_data

    def image_data_to_array(self, image_data):
        """
            Converte os dados da imagem para um array utilizando pcolormesh.
            neste casa a matriz 52x52 vire um array 2704 elementos.
            este array é dividido em pedaços de 52 elementos.
            o retorno da função é um array com 52 elementos onde cada elemento tem tamanho 52.
            o primeiro elemento corresponde a x=0, y=0, o segundo x=0, y=1 assim sucessivamente.
            o segundo elemento é a posição x=1.
        """
        # Converte o ndarray para um mesh (matplotlib.collections.QuadMesh)
        # https://matplotlib.org/3.1.1/api/collections_api.html#matplotlib.collections.QuadMesh)

        mesh = pyplot.pcolormesh(image_data)

        # O mesh tem a funcao get_array que transforma
        # m = Array com todos os 2704 = 52x52.
        m = list(mesh.get_array())

        # Tamanho total da imagem 52
        n = len(image_data)

        # Divide o array em pedacos de tamanho igual
        z = list()
        for i in range(0, len(m), n):
            z.append(m[i:i + n])

        return z

    def spaxel_fit_by_position(self, megacube, x, y, ):
        """
            Central Spaxel Best Fit
            Return [(Age, Z, Lfrac, Mfrac)]
        """
        cube_header = self.get_headers(megacube, 'PoPBins')
        cube_data = self.get_cube_data(megacube, 'PoPBins')
        data_cube_lfrac = self.get_cube_data(megacube, 'PoPVecsL', x, y)
        data_cube_mfrac = self.get_cube_data(megacube, 'PoPVecsM', x, y)

        z = np.shape(cube_data)[0]

        temp_rows = []
        rows = []
        for idx in range(z + 1, len(cube_header)):
            try:
                # t = Age
                # met = Z
                ssp, t, met = re.split(
                    ',', cube_header['DATA' + str(idx)])

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

        popx = self.get_cube_data(megacube, 'PoPVecsL', x, y)
        popm = self.get_cube_data(megacube, 'PoPVecsM', x, y)

        aux = pf.getdata(megacube, 'BaseAgeMetal')
        popage = aux[:, 0]
        popZ = aux[:, 1]
        zs = np.unique(popZ)[np.unique(popZ) != 0]

        for z in zs:
            if(len(popZ[popZ == z]) == 0):
                print('Metallicity', z,
                      ' is not in the base, I hope you know wath you are doing!')

            summedpopxTemp.append(popx[popZ == z])
            summedpopxTemp2 = np.column_stack(summedpopxTemp)
            summedpopmTemp.append(popm[popZ == z])
            summedpopmTemp2 = np.column_stack(summedpopmTemp)

        for ind in range(0, len(summedpopxTemp2)):
            summedpopx = np.append(summedpopx, sum(summedpopxTemp2[ind]))
            summedpopm = np.append(summedpopm, sum(summedpopmTemp2[ind]))

        summedpopages = popage[popZ == zs[0]]

        result = dict({
            "x": list(np.log10(summedpopages)),
            "y": list(summedpopx),
            "m": list(summedpopm),
        })

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

        cube_header = self.get_headers(megacube, 'PopBins')
        cube_data = self.get_cube_data(megacube, 'PopBins')

        vecs = 0
        for i in range(0, np.shape(cube_data)[0], 1):
            if 'light' in cube_header['DATA' + str(i)]:
                vecs = vecs + 1

        cube_header_list = repr(cube_header).split('\n')

        for k in np.arange(vecs + 1):
            xaxis = np.append(xaxis, k)
            yaxis = np.append(yaxis, cube_data[k, int(y), int(x)])
            maxis = np.append(maxis, cube_header['DATA' + str(k)])
            for j in range(0, len(cube_header_list)):
                if self.index_of('DATA' + str(k) + ' ', str(cube_header_list[j])) > -1:
                    mlegend = np.append(mlegend, str(
                        cube_header_list[j]).split('/')[1].strip())

        return dict({
            "x": list(xaxis),
            "y": list(yaxis),
            "m": list(maxis),
            "mlegend": list(mlegend)
        })

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
                        'mpl4': 'iauname',
                        'mpl9': 'nsa_iauname',
                    },
                    {
                        'mpl4': 'field',
                        'mpl9': 'nsa_field',
                    },
                    {
                        'mpl4': 'run',
                        'mpl9': 'nsa_run',
                    },
                    {
                        'mpl4': 'nsa_id',
                        'mpl9': 'nsa_nsaid',
                    },
                    {
                        'mpl4': 'nsa_redshift',
                        'mpl9': 'nsa_z',
                    },
                    {
                        'mpl4': 'nsa_absmag',
                        'mpl9': 'nsa_sersic_absmag',
                    },
                    {
                        'mpl4': 'nsa_absmag_el',
                        'mpl9': 'nsa_elpetro_absmag',
                    },
                    {
                        'mpl4': 'nsa_amivar_el',
                        'mpl9': 'nsa_elpetro_amivar',
                    },
                    {
                        'mpl4': 'nsa_mstar',
                        'mpl9': 'nsa_sersic_mass',
                    },
                    {
                        'mpl4': 'nsa_mstar_el',
                        'mpl9': 'nsa_elpetro_mass',
                    },
                    {
                        'mpl4': 'nsa_ba',
                        'mpl9': 'nsa_elpetro_ba',
                    },
                    {
                        'mpl4': 'nsa_phi',
                        'mpl9': 'nsa_elpetro_phi',
                    },
                    {
                        'mpl4': 'nsa_petroflux',
                        'mpl9': 'nsa_petro_flux',
                    },
                    {
                        'mpl4': 'nsa_petroflux_ivar',
                        'mpl9': 'nsa_petro_flux_ivar',
                    },
                    {
                        'mpl4': 'nsa_petroflux_el',
                        'mpl9': 'nsa_elpetro_flux',
                    },
                    {
                        'mpl4': 'nsa_petroflux_el_ivar',
                        'mpl9': 'nsa_elpetro_flux_ivar',
                    },
                    {
                        'mpl4': 'nsa_sersicflux',
                        'mpl9': 'nsa_sersic_flux',
                    },
                    {
                        'mpl4': 'nsa_sersicflux_ivar',
                        'mpl9': 'nsa_sersic_flux_ivar'
                    },
                ]

                # Some attributes exist in both mpl4 and mpl9 metadata file with different names.
                # Here we loop through the these columns and change their name according to the latest version, which is the mpl9 file.
                for column in same_attribute_columns:
                    if column['mpl4'] in columns.names:
                        columns.change_name(
                            col_name=column['mpl4'], new_name=column['mpl9'])

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


if __name__ == '__main__':
    filename = sys.argv[1]
