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
        lamb = np.arange(l0, (dl*size+l0), dl)

        return lamb

    def get_headers(self, megacube, extension):
        cube_header = pf.getheader(megacube, extension)
        return cube_header

    def get_cube_data(self, megacube, extension, x=None, y=None):
        cube_data = pf.getdata(megacube, extension)

        if x is not None and y is not None:
            return cube_data[:, int(y), int(x)]

        return cube_data

    def get_all_hud(self, cube_header, cube_data):
        z = np.shape(cube_data)[0]

        lHud = list()
        for i in range(0, z, 1):
            lHud.append(cube_header['DATA'+str(i)])

        return lHud

    def image_by_hud(self, megacube, hud):

        cube_header = self.get_headers(megacube, 'PoPBins')

        cube_data = self.get_cube_data(megacube, 'PoPBins')

        lHud = self.get_all_hud(cube_header, cube_data)

        idxHud = lHud.index(hud)

        image_data = cube_data[idxHud, :, :]

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
        # l = Array com todos os 2704 = 52x52.
        l = list(mesh.get_array())

        # Tamanho total da imagem 52
        n = len(image_data)

        # Divide o array em pedacos de tamanho igual
        z = list()
        for i in range(0, len(l), n):
            z.append(l[i:i + n])

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
        for idx in range(z+1, len(cube_header)):
            try:
                # t = Age
                # met = Z
                ssp, t, met = re.split(
                    ',', cube_header['DATA'+str(idx)])

                temp_rows.append((t.strip(), met.strip()))
            except:
                pass

        for idx in range(0, len(temp_rows)):
            age = temp_rows[idx][0]
            met = temp_rows[idx][1]
            try:
                lfrac = data_cube_lfrac[idx]
            except:
                lfrac = None

            try:
                mfrac = data_cube_mfrac[idx]
            except:
                mfrac = None

            # Age, Z, Lfrac, Mfrac
            row = (age, float(met), float(lfrac), float(mfrac))
            rows.append(row)

        return rows


if __name__ == '__main__':
    filename = sys.argv[1]

    # a = mclass().spaxel_fit_by_position(filename, x=15, y=29)

    # flux, lamb = mclass().flux_by_position(megacube, x=26, y=26)

    # image = mclass().image_by_hud(filename, 'FCFC1.50')

    # aImage = pyplot.pcolormesh(image)

    # l = aImage
    # n = len(list(image.get_array()))

    # for i in range(0, len(l), n):
    #     print(l[i:i + n])

    # for X(i,j) to X(i+1,j+1)
    #     for Y(i,j) to Y(i+1,j+1)

    # x = list()
    # y = list()
    # z = list()

    # for i, j in enumerate(range(len(a))):
    #     print("i: %s j: %s" % (i, j))
    #     x.append(i)
    #     y.append(j)
    #     z.append(a[i, j])
    # print(x)
    # print(y)
    # print(z)

    # print(a[25, 26])
    # # x = list()
    # # y = list()
    # for i in range(len(a)):
    #     print(a[1][i])

    # print(a[26].tolist())

    # header = pf.getheader(megacube, 'FLXNORM')
    # flux = pf.getdata(megacube, 'FLXNORM')

    # l0 = pf.getheader(megacube, 'FLXNORM')['CRVAL3']
    # dl = pf.getheader(megacube, 'FLXNORM')['CD3_3']

    # (size, ypix, xpix) = np.shape(flux)
    # lamb = np.arange(l0, (dl*size+l0), dl)

    # print(flux[:, 26, 25])
    # print(len(flux[:, 26, 25]))
    # print(len(lamb))
    # print(lamb)

    # window = tk.Tk()
    # window.title('Megacube Fit Analyser')
    # start = mclass(window, megacube=megacube)
    # window.mainloop()
