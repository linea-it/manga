from ifscube.io.line_fit import load_fit
import matplotlib.pyplot as plt


def main():
    fig, ax = plt.subplots(2, 1)
    fit = load_fit("ngc3081_cube_linefit.fits")
    fit_results = fit.plot(figure=fig, spectrum_ax=ax[0], residuals_ax=ax[1], x_0=3, y_0=3, return_results=True)
    plt.show()

    print(fit_results[3, 3])

    print(getattr(fit, "_get_feature_parameter")("ha", "sigma", "initial_guess"))
    print(getattr(fit, "_get_feature_parameter")("n2_6548", "amplitude", "solution")[3, 3])


if __name__ == '__main__':
    main()
