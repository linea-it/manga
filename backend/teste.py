from pathlib import Path

from manga.megacube import MangaMegacube

if __name__ == "__main__":
    fits = Path("/workspaces/manga/images").joinpath("manga-11832-6103-MEGACUBE.fits")
    cube = MangaMegacube(fits)

    print(cube.fits_exist())
