import matplotlib.pylab as plt
import numpy as np
from astropy.constants import c
from astropy.io import fits as pf

c = c.to("km/s").value  # Velocidade da Luz nas unidades adequadas.


def getrestwl(fitconfig):
    """To get the rest wavelengths from the configurarion file"""
    rest_wl = np.array([])
    for i in fitconfig:
        if ".rest_wavelength" in i[0]:
            rest_wl = np.append(rest_wl, float(i[1]))
    return rest_wl


def gauss(x, rest_wl, p):
    """Compute the gaussian emission line profiles."""
    lam_ratio = (x / rest_wl) ** 2
    vel = c * (lam_ratio - 1.0) / (lam_ratio + 1.0)

    a = p[0]
    v0 = p[1]
    s = p[2]

    w = (vel - v0) / s

    y = a * np.exp(-(w**2) / 2.0) / (1.0 + (vel / c))

    return y


def plot_ifscube_fits(wavelength, obs_flux, pseudo_continuum, stellar_flux):
    """Plotting the continuum"""

    plt.plot(wavelength, obs_flux, label="flux", color="black")
    plt.plot(wavelength, stellar_flux, label="Synt", color="red")
    plt.plot(
        wavelength,
        pseudo_continuum + stellar_flux,
        "r:",
        label="Emission lines +  continuum (stellar & pseudo)",
    )  # Adicionei apenas para a legend
    plt.xlabel(r"$\lambda (\AA)$")
    plt.ylabel("Flux")
    plt.legend(frameon=False, loc=0)


def plot_lines(
    wavelength,
    stellar_flux,
    pseudo_continuum,
    parnames,
    rest_wl_lines,
    solution,
    label_lines=True,
    label_abs_lines=True,
):
    """Plotting the emission-lines profiles, it has to be in a for loop otherwise the
    individual emission-line profiles will not apear individually."""

    for i in range(0, len(parnames), 3):  # esse 3 eh por que tem que ir de 3 em 3
        rest_wl = rest_wl_lines[
            int(i / 3)
        ]  # aqui o 3 eh para pegar o correspondente rest_wl (que eh um array simples)
        parameters = solution[i : i + 3]  # cortando o solution para pegar os parametros para plotar a gaussiana
        line = gauss(wavelength, rest_wl, parameters)  # calculando a linha com a funcao gaussiana
        plt.plot(
            wavelength,
            pseudo_continuum + stellar_flux + line,
            "r:",
            label=parnames[i][0],
        )  # plotando (da mesma cor e tipo de linha da legenda, se plotar no for vai tem uma lista enorme)

        if label_lines:  # para marcar a posicao das linhas em emissao. Isso poderia ser um liga e desliga no plot.
            plt.axvline(rest_wl, ls="--", color="cyan")
            ypos = 1.1 * plt.gca().get_ylim()[0]
            plt.text(rest_wl + 5, ypos, parnames[i][0], rotation="vertical", color="cyan")

    plt.legend(frameon=False)

    if label_abs_lines:  # para marcar a posicao das linhas em absorcao. Isso poderia ser um liga e desliga no plot.
        abs_lines = np.array(
            [
                4536,
                4677,
                5101,
                5176,
                5265,
                5332,
                5401,
                5708,
                5786,
                5893,
                5965,
                6132,
                6230,
                6354,
                6430,
                6507,
            ]
        )
        abs_linesname = [
            "Fe I",
            "Fe I",
            "Mg",
            "Mg b",
            "Fe I",
            "Fe I",
            "Fe I",
            "Fe I",
            "Fe I",
            "Na D",
            "TiO",
            "Fe I",
            "TiO",
            "Fe I",
            "Fe I",
            "Fe I",
        ]
        for i in range(0, len(abs_lines), 1):
            ypos = (
                1.1 * plt.gca().get_ylim()[0]
            )  # to lendo de novo no for por que tive um erro se deixo fora...e nao entendi pq.
            plt.axvline(abs_lines[i], ls="-.", color="green")
            plt.text(
                abs_lines[i] + 5,
                ypos,
                abs_linesname[i],
                rotation="vertical",
                color="green",
            )


plt.clf()
cube = "images/manga-9894-3701-MEGACUBE.fits"
# cube='manga-9894-3701-MEGACUBE.fits'  # lista de cubos, pode usar num for...


y = 20  # Spaxel de exemplo
x = 25  # Spaxel de exemplo

# Lendo os parametros necessarios
parnames = pf.getdata(cube, "PARNAMES")
solution_cube = pf.getdata(cube, "SOLUTION")
h = pf.getheader(cube, "fitspec")
fitspec_cube = pf.getdata(cube, "fitspec")
pseudo_continuum_cube = pf.getdata(cube, "FITCONT")
stelar_cube = pf.getdata(cube, "STELLAR")
fitconfig = pf.getdata(cube, "FITCONFIG")

# Calculando o que precios (o wavelength eh unico para cada cubo os demais eh por para x e y)
wavelength = np.arange(h["crval3"], h["crval3"] + h["naxis3"] * h["cd3_3"], h["cd3_3"])
obs_flux = fitspec_cube[:, y, x]
pseudo_continuum = pseudo_continuum_cube[:, y, x]
stellar_flux = stelar_cube[:, y, x]
solution = solution_cube[:, y, x]


# Usando a funcao para pegar os comprimentos de onda das linhas
rest_wl = getrestwl(fitconfig)

# Plotando espectro observado, e continuos
plot_ifscube_fits(wavelength, obs_flux, pseudo_continuum, stellar_flux)

# Plotando as linhas de emissao
plot_lines(
    wavelength,
    stellar_flux,
    pseudo_continuum,
    parnames,
    rest_wl,
    solution,
    label_lines=True,
    label_abs_lines=True,
)


plt.show()
