import numpy as np
import matplotlib.pylab as plt
from astropy.io import fits as pf


def ifscube_slicer(cube):
    pars = pf.getdata(cube, "PARNAMES")
    print(f"Parnames: {len(pars)}")
    print(pars)
    solution = pf.getdata(cube, "SOLUTION")
    flux = pf.getdata(cube, "FLUX_M")
    eqw = pf.getdata(cube, "EQW_M")

    i = 0  # indice do solution
    j = 0  # indice do flux e do eqw
    #
    #  PARA O PLOT - Tu pode remover tudo isso, mas eh para poder conferir se o que esta sendo salvo esta certo.
    plots = int(len(pars) / 3)  # para controlar os plots
    k = 1  # contador dos plots
    plt.figure(figsize=(50, 50))  # Fazendo uma figura bem grande (pode dar zoom)

    map_names = []
    for p in pars:
        p = np.asarray(p)
        if p[1] == "A":
            save_name_flux = (
                "Flux_" + p[0]
            )  # nome para salvar o mapa de fluxo (usei no label do plot)
            save_flux = flux[
                j
            ]  # array (44,44) com os valores do mapa de flux a serem salvos
            plt.subplot(plots, 4, k)
            k = k + 1
            plt.imshow(
                save_flux, origin="lower"
            )  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
            plt.gca().set_title(save_name_flux)  # titulo do plot
            plt.colorbar()  # barra de cores

            map_names.append(save_name_flux)

            save_name_ew = (
                "Ew_" + p[0]
            )  # nome para salvar o mapa de eqw (usei no label do plot)
            save_ew = (
                -1 * eqw[j]
            )  # array (44,44) com os valores do mapa de ew a serem salvos
            plt.subplot(
                plots, 4, k
            )  # NOTA: O EW precisa ser multiplicado por -1 para inverter o sinal (nao pode usar abs)
            k = k + 1
            plt.imshow(
                save_ew, origin="lower"
            )  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
            plt.gca().set_title(save_name_ew)  # titulo do plot
            plt.colorbar()  # barra de cores

            map_names.append(save_name_ew)
            j = j + 1  # contador de indice de flux e eqw

        elif p[1] == "v":
            save_name_vel = (
                "Vel_" + p[0]
            )  # nome para salvar o mapa de velocidades (usei no label do plot)
            save_vel = solution[
                i
            ]  # array (44,44) com os valores do mapa de velocidade a serem salvos

            plt.subplot(plots, 4, k)
            k = k + 1
            plt.imshow(
                save_vel, origin="lower"
            )  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
            plt.gca().set_title(save_name_vel)  # titulo do plot
            plt.colorbar()  # barra de cores

            map_names.append(save_name_vel)

        elif p[1] == "s":
            save_name_sig = (
                "Sigma_" + p[0]
            )  # nome para salvar o mapa de sigma (usei no label do plot)
            save_sig = solution[
                i
            ]  # array (44,44) com os valores do mapa de sigma a serem salvos
            plt.subplot(plots, 4, k)
            k = k + 1
            plt.imshow(
                save_sig, origin="lower"
            )  # plot para tu poder conferir (note o origim do matplotlib que precisa ser lower para o 0,0 ser no canto inferior esquerdo)
            plt.gca().set_title(save_name_sig)  # titulo do plot
            plt.colorbar()  # barra de cores

            map_names.append(save_name_sig)

        i = (
            i + 1
        )  # contador para o solution (note que eu pulo o A ao salvar por que salvo o Flux e EW no lugar)
    plt.tight_layout()  # deixando o plot mais elegante...
    plt.savefig("teste.png")
    print(f"Plots: {k}")
    print(f"Names: {map_names} [{len(map_names)}]")


cube = "images/manga-9894-3701-MEGACUBE.fits"  # lista de cubos, pode usar num for...

ifscube_slicer(cube)
