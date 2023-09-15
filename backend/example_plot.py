from ifscube.io.line_fit import load_fit
import matplotlib.pyplot as plt

from ifscube.io.line_fit import load_fit
import matplotlib.pyplot as plt
def main3():
    x0, y0 = 23, 23
    fig, ax = plt.subplots(2, 1)
    fit = load_fit("images/manga-9894-3701-MEGACUBE.fits")
    fit_results = fit.plot(figure=fig, spectrum_ax=ax[0], residuals_ax=ax[1], x_0=x0, y_0=y0, return_results=True)
    # pd = fit.plot_data(True)
    # print(type(pd))
    plt.show()
    # print(pd)
    # plt.show()

def main2():
    x0, y0 = 23, 23
    fig, ax = plt.subplots(2, 1)
    fit = load_fit("images/manga-9894-3701-MEGACUBE.fits")
    fit_results = fit.plot(figure=fig, spectrum_ax=ax[0], residuals_ax=ax[1], x_0=x0, y_0=y0, return_results=True)
    print(fig.get_axes())
    allaxes = fig.get_axes()
    # https://stackoverflow.com/questions/8938449/how-to-extract-data-from-matplotlib-plot
    print(allaxes[0].get_lines()[0])

    # Usando get_xdata()
    wavelength_x = allaxes[0].get_lines()[0].get_xdata()
    wavelength_y = allaxes[0].get_lines()[0].get_ydata()
    print(wavelength_x)
    print(wavelength_y)
    # Ou usando get_data()
    # wavelength = allaxes[0].get_lines()[0].get_data()

    line1_x = allaxes[0].get_lines()[1].get_xdata()
    line1_y = allaxes[0].get_lines()[1].get_ydata()

    line2_x = allaxes[0].get_lines()[2].get_xdata()
    line2_y = allaxes[0].get_lines()[2].get_ydata()

    # print(allaxes[0].get_lines()[2])
    otherlines = []
    for line in allaxes[0].get_lines()[3:]:
        # print(line)
        otherlines.append([line.get_xdata(), line.get_ydata()])
    # plt.show()
    plt.clf()
    plt.plot(wavelength_x, wavelength_y)
    plt.plot(line1_x, line1_y)
    plt.plot(line2_x, line2_y)
    for line in otherlines:
        plt.plot(line[0], line[1], '--')

    plt.show()
    # print(fit_results[23, 23])
    # print(getattr(fit, "_get_feature_parameter")("ha", "sigma", "initial_guess"))
    # print(getattr(fit, "_get_feature_parameter")("n2_6548", "amplitude", "solution")[y0, x0])

# # Versão 1
# def main():
#     fig, ax = plt.subplots(2, 1)
#     fit = load_fit("images/manga-9894-3701-MEGACUBE.fits")
#     fit_results = fit.plot(figure=fig, spectrum_ax=ax[0], residuals_ax=ax[1], x_0=3, y_0=3, return_results=True)
#     plt.show()

#     print(fit_results[25, 25])

#     print(getattr(fit, "_get_feature_parameter")("ha", "sigma", "initial_guess"))
#     print(getattr(fit, "_get_feature_parameter")("n2_6548", "amplitude", "solution")[3, 3])

if __name__ == '__main__':
    main3()
