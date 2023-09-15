from pathlib import Path
from typing import Dict, List, Union

import matplotlib.pylab as plt
import numpy as np
import pandas as pd
import plotly as pl
import plotly.express as px
import plotly.graph_objects as go
from astropy.constants import c
from astropy.io import fits as pf


class EmissionLines:
    megacube: Path
    parameters: pf.fitsrec.FITS_rec
    fitconfig: pf.fitsrec.FITS_rec
    solution: np.ndarray
    pseudo_continuum: np.ndarray
    stelar: np.ndarray
    h: pf.header.Header
    fitspec: np.ndarray
    wavelength: np.ndarray

    # Velocidade da Luz nas unidades adequadas.
    c: np.float64

    # Comprimentos de onda das linhas
    rest_wl: np.ndarray

    def __init__(self, megacube: Path):
        self.megacube = Path(megacube)

        self.parameters = pf.getdata(self.megacube, "PARNAMES")

        self.solution = pf.getdata(self.megacube, "SOLUTION")

        # Headers do fitspec
        self.h = pf.getheader(self.megacube, "fitspec")
        # fitspec Data
        self.fitspec = pf.getdata(self.megacube, "fitspec")

        self.pseudo_continuum = pf.getdata(self.megacube, "FITCONT")

        self.stelar = pf.getdata(self.megacube, "STELLAR")

        self.fitconfig = pf.getdata(self.megacube, "FITCONFIG")

        self.wavelength = self.calc_wavelength()

        # Usando a funcao para pegar os comprimentos de onda das linhas
        self.rest_wl = self.get_restwl(self.fitconfig)

        # Velocidade da Luz em km/s.
        self.c = c.to("km/s").value

    def calc_wavelength(self) -> np.ndarray:
        wavelength = np.arange(
            self.h["crval3"],
            self.h["crval3"] + self.h["naxis3"] * self.h["cd3_3"],
            self.h["cd3_3"],
        )

        return wavelength

    def get_restwl(self, fitconfig):
        """To get the rest wavelengths from the configurarion file"""
        rest_wl = np.array([])
        for i in fitconfig:
            if ".rest_wavelength" in i[0]:
                rest_wl = np.append(rest_wl, float(i[1]))
        return rest_wl

    def gauss(self, x: np.ndarray, rest_wl: np.ndarray, p: np.ndarray) -> np.ndarray:
        """Compute the gaussian emission line profiles."""
        lam_ratio = (x / rest_wl) ** 2
        vel = self.c * (lam_ratio - 1.0) / (lam_ratio + 1.0)

        a = p[0]
        v0 = p[1]
        s = p[2]

        w = (vel - v0) / s

        y = a * np.exp(-(w**2) / 2.0) / (1.0 + (vel / self.c))

        return y

    def emission_lines_profile(self, x: int, y: int) -> pd.DataFrame:
        pseudo_continuum = self.pseudo_continuum[:, y, x]
        stellar_flux = self.stelar[:, y, x]
        solution = self.solution[:, y, x]

        df = pd.DataFrame()

        for i in range(0, len(self.parameters), 3):  # esse 3 eh por que tem que ir de 3 em 3
            rest_wl = self.rest_wl[
                int(i / 3)
            ]  # aqui o 3 eh para pegar o correspondente rest_wl (que eh um array simples)
            parameters = solution[i : i + 3]  # cortando o solution para pegar os parametros para plotar a gaussiana
            line = self.gauss(self.wavelength, rest_wl, parameters)  # calculando a linha com a funcao gaussiana
            label = self.parameters[i][0]
            data = pseudo_continuum + stellar_flux + line
            df[label] = data

        return df

    def emission_lines(self, x: int, y: int) -> List[Dict[str, Union[np.float64, str]]]:
        data = []
        for i in range(0, len(self.parameters), 3):  # esse 3 eh por que tem que ir de 3 em 3
            rest_wl = self.rest_wl[
                int(i / 3)
            ]  # aqui o 3 eh para pegar o correspondente rest_wl (que eh um array simples)

            data.append({"value": rest_wl, "label": self.parameters[i][0]})
        return data

    def absortion_lines(self) -> List[Dict[str, Union[str, int]]]:
        # para marcar a posicao das linhas em absorcao.
        data = []
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
            data.append({"value": abs_lines[i], "label": abs_linesname[i]})
        return data

    def obs_spec(self, x: int, y: int) -> list:
        obs_flux = self.fitspec[:, y, x]
        return obs_flux.tolist()

    def synt_spec(self, x: int, y: int) -> list:
        stellar_flux = self.stelar[:, y, x]
        return stellar_flux.tolist()

    def to_dataframe(self, x, y) -> pd.DataFrame:
        wavelength = self.wavelength
        obs_spec = self.obs_spec(x, y)
        synt_spec = self.synt_spec(x, y)

        df = self.emission_lines_profile(x, y)

        df.insert(0, "wavelength", wavelength)
        df.insert(1, "obs_spec", obs_spec)
        df.insert(2, "synt_spec", synt_spec)

        return df

    def plot(self, x: int, y: int, output: Path, format: str = "html"):
        print(f"Megacube: {self.megacube} X: [{x}] Y: [{y}]")

        df = self.to_dataframe(x, y)
        em_lines = self.emission_lines(x, y)
        abs_lines = self.absortion_lines()

        fig = go.Figure()
        fig.update_layout(
            title=dict(
                text="Spectrum",
            ),
            xaxis_title="Wavelength ($\AA$)",
            yaxis_title="Spectral flux density",
            # legend=dict(
            #     title_font_family='Courier New',
            #     font=dict(
            #         size=8
            #     )
            # )
            # legend=dict(
            #     orientation="h",
            #     yanchor="bottom",
            #     y=1.02,
            #     xanchor="right",
            #     x=1
            # )
        )

        fig.add_trace(
            go.Scatter(
                x=df["wavelength"],
                y=df["obs_spec"],
                name="Obs. Spec",
                mode="lines",
                line=dict(color="blue"),
                showlegend=True,
            )
        )

        fig.add_trace(
            go.Scatter(
                x=df["wavelength"],
                y=df["synt_spec"],
                name="Synt. Spec",
                mode="lines",
                line=dict(color="orange"),
                showlegend=True,
            )
        )

        show_legend = True
        for label in df.columns:
            if label in ["wavelength", "obs_spec", "synt_spec"]:
                continue

            fig.add_trace(
                go.Scatter(
                    x=df["wavelength"],
                    y=df[label],
                    legendgroup="em_lines",
                    name="Emission-lines",
                    mode="lines",
                    line=dict(color="black", dash="dot"),
                    showlegend=show_legend,
                )
            )
            show_legend = False

        plot_y_min = fig.data[0].y.min()
        plot_y_max = fig.data[0].y.max()
        show_legend = True
        for line in em_lines:
            fig.add_trace(
                go.Scatter(
                    x=[line["value"], line["value"]],
                    y=[plot_y_min, plot_y_max],
                    legendgroup="v_em_lines",
                    name="Em. Lines",
                    mode="lines",
                    line=dict(color="green", dash="dash"),
                    showlegend=show_legend,
                )
            )
            show_legend = False

        plot_y_min = fig.data[0].y.min()
        plot_y_max = fig.data[0].y.max()
        show_legend = True
        for line in abs_lines:
            fig.add_trace(
                go.Scatter(
                    x=[line["value"], line["value"]],
                    y=[plot_y_min, plot_y_max],
                    legendgroup="v_abs_lines",
                    name="Abs. Lines",
                    mode="lines",
                    line=dict(color="cyan", dash="dash"),
                    showlegend=show_legend,
                )
            )
            show_legend = False

        # fig.show()

        if format == "html":
            fig.write_html(output)

    # def plot_emission_lines_and_continuos(self, x: int, y: int):
    #     print(f"Megacube: {self.megacube} X: [{x}] Y: [{y}]")

    #     obs_spec = self.obs_spec(x, y)
    #     synt_spec = self.synt_spec(x, y)

    #     plt.plot(self.wavelength, obs_spec, label="Obs. Spec", color='blue')
    #     plt.plot(self.wavelength, synt_spec, label="Synt. Spec", color='orange')
    #     plt.xlabel('$\lambda (\AA)$')
    #     plt.ylabel('Flux')
    #     plt.legend(frameon=False, loc=0)

    #     em_lines = self.emission_lines_profile(x, y)
    #     for line in em_lines:
    #         plt.plot(self.wavelength, line['data'], 'r:', label=line['label'])
    #     # print(em_lines)

    #     v_em_lines = self.emission_lines(x, y)
    #     print(type(v_em_lines))
    #     # para marcar a posicao das linhas em emissao. Isso poderia ser um liga e desliga no plot.
    #     for line in v_em_lines:
    #         plt.axvline(line['value'], ls='--', color='cyan')
    #         ypos=1.1*plt.gca().get_ylim()[0]
    #         plt.text(line['value']+5, ypos, line['label'], rotation='vertical', color='cyan')

    #     v_abs_lines = self.absortion_lines()
    #     # print(type(v_abs_lines))
    #     # linhas em absorcao
    #     for line in v_abs_lines:
    #         plt.axvline(line['value'], ls='--', color='green')
    #         ypos=1.1*plt.gca().get_ylim()[0]
    #         plt.text(line['value']+5, ypos, line['label'], rotation='vertical', color='green')

    # plt.show()


# def main(filepath, x: int, y: int):
#     my_cube = EmissionLines(filepath)
#     # my_cube.plot_emission_lines_and_continuos(x, y)

#     # filename =f"{Path(filepath).name.split('.')[0]}_spec_{x}_{y}.format"
#     filename = f"manga-9894-3701-MEGACUBE_spec_{x}_{y}.html"
#     output = Path("images").joinpath(filename)

#     my_cube.plot(x, y, output)
#     # df = my_cube.to_dataframe(x,y)
#     # print(df.head())
#     # obs_synt = my_cube.obs_and_synt_spec(x, y)

#     # df1 = pd.DataFrame(dict(
#     #     wavelength=my_cube.wavelength,
#     #     flux=obs_synt['flux']['data'],
#     #     synt=obs_synt['synt']['data']))

#     # print(df1.head())

#     # fig = px.line(df1, x='wavelength', y="flux")

#     # fig.show()

# # if __name__ == '__main__':
# #     main(filepath='images/manga-9894-3701-MEGACUBE.fits', x=20, y=25)
