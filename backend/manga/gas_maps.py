from astropy.io import fits as pf
from pathlib import Path
import numpy as np
from astropy.constants import c
import matplotlib.pylab as plt
from typing import List, Dict, Union
import pandas as pd
import plotly as pl
import plotly.express as px
import plotly.graph_objects as go
import json

class GasMaps():
    megacube: Path
    parameters: pf.fitsrec.FITS_rec

    solution: np.ndarray
    flux: np.ndarray
    eqw: np.ndarray

    def __init__(self, megacube: Path):
        self.megacube = Path(megacube)
        self.parameters = pf.getdata(self.megacube, 'PARNAMES')

        self.solution = pf.getdata(self.megacube, 'SOLUTION')

        self.flux = pf.getdata(self.megacube, 'FLUX_M')

        self.eqw = pf.getdata(self.megacube, 'EQW_M')

    def write_map_json(self, name, data, output):

        filename = 'image_heatmap_%s.json' % name
        filepath = Path(output)
        filepath.mkdir(parents=True, exist_ok=True)
        filepath = filepath.joinpath(filename)
        # If file already exists, remove it:
        if filepath.exists():
            filepath.unlink()

        with open(filepath, "w") as f:
            json.dump(data, f)

        return filepath

    def write_list_map_json(self, map_names, output):
        filename = 'list_gas_map.json'
        filepath = Path(output)
        filepath.mkdir(parents=True, exist_ok=True)
        filepath = filepath.joinpath(filename)
        # If file already exists, remove it:
        if filepath.exists():
            filepath.unlink()

        data = list()
        for name in map_names:
            data.append({
                "name": name, 
                "display_name": name, 
                "comment": ""
            })
        with open(filepath, "w") as f:
            json.dump(dict({
                'gas_maps': data
            }), f)


    def extract_all_maps(self, output):
        i=0  # indice do solution
        j=0  #indice do flux e do eqw 
        
        plots=int(len(self.parameters)/3) # para controlar os plots 
        k=1 # contador dos plots 
        plt.figure(figsize=(50,50)) # Fazendo uma figura bem grande (pode dar zoom)

        map_names = []       
        maps = []
        for p in self.parameters:
            p=np.asarray(p)
            if p[1] == 'A':
                save_name_flux = 'Flux_'+p[0]   # nome para salvar o mapa de fluxo (usei no label do plot)
                save_flux=self.flux[j]               # array (44,44) com os valores do mapa de flux a serem salvos
                plt.subplot(plots,4,k)
                k=k+1
                # data = plt.imshow(save_flux,origin='lower')
                # plt.gca().set_title(save_name_flux)   # titulo do plot 
                # plt.colorbar()   # barra de cores                 
                map_names.append(save_name_flux)
                data = plt.imshow(save_flux,origin='lower').get_array()  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                maps.append(dict({
                    'z': data.tolist(fill_value=0),
                    'title': save_name_flux,
                }))

                save_name_ew = 'Ew_'+p[0]      # nome para salvar o mapa de eqw (usei no label do plot)
                save_ew = -1*self.eqw[j]               # array (44,44) com os valores do mapa de ew a serem salvos
                plt.subplot(plots,4,k)            # NOTA: O EW precisa ser multiplicado por -1 para inverter o sinal (nao pode usar abs)
                k=k+1
                # plt.imshow(save_ew,origin='lower') # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                # plt.gca().set_title(save_name_ew)  # titulo do plot
                # plt.colorbar()   # barra de cores 
                map_names.append(save_name_ew)
                data = plt.imshow(save_ew, origin='lower').get_array() # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                maps.append(dict({
                    'z': data.tolist(fill_value=0),
                    'title': save_name_ew,
                }))
                              
                j=j+1                              # contador de indice de flux e eqw

            elif p[1] == 'v':
                save_name_vel = 'Vel_'+p[0]  # nome para salvar o mapa de velocidades (usei no label do plot)
                save_vel = self.solution[i]       # array (44,44) com os valores do mapa de velocidade a serem salvos

                plt.subplot(plots,4,k)
                k=k+1
                # plt.imshow(save_vel,origin='lower') # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                # plt.gca().set_title(save_name_vel) # titulo do plot
                # plt.colorbar()   # barra de cores 
                map_names.append(save_name_vel)
                data = plt.imshow(save_vel,origin='lower').get_array() # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                maps.append(dict({
                    'z': data.tolist(fill_value=0),
                    'title': save_name_vel,
                }))

            elif p[1] == 's':
                save_name_sig = 'Sigma_'+p[0] # nome para salvar o mapa de sigma (usei no label do plot)
                save_sig = self.solution[i]       # array (44,44) com os valores do mapa de sigma a serem salvos
                plt.subplot(plots,4,k)
                k=k+1
                # plt.imshow(save_sig,origin='lower')  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                # plt.gca().set_title(save_name_sig)  # titulo do plot 
                # plt.colorbar()   # barra de cores 
                map_names.append(save_name_sig)
                plt.imshow(save_sig,origin='lower').get_array()  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
                maps.append(dict({
                    'z': data.tolist(fill_value=0),
                    'title': save_name_sig,
                }))

            i=i+1                       # contador para o solution (note que eu pulo o A ao salvar por que salvo o Flux e EW no lugar)


        result = []
        for map in maps:
            filepath = self.write_map_json(map['title'], map, output)
            result.append({
                'name': map['title'],
                'filepath': str(filepath)
            })

        self.write_list_map_json(map_names, output)

        return result

# if __name__ == '__main__':
#     my_cube = GasMaps('images/manga-9894-3701-MEGACUBE.fits')
#     map_names = my_cube.extract_all_maps('images/gas')
