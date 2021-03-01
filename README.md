# MaNGA


## Installation

#### Clone the repository
```
git clone https://github.com/linea-it/manga.git
cd manga
```

### Development

1. Configuration
> You can modify the variables inside the file `.env.dev`.

2. Running
```
docker-compose build
docker-compose up
```

3. Create super user
```
docker-compose exec web manage.py createsuperuser
```

---

### Production

1. Configuration
> You can modify the variables inside the file `.env.prod` and `.env.prod.db`.

2. Running
```
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up
```

3. Create super user
```
docker-compose -f docker-compose.prod.yml exec web manage.py createsuperuser
```

---

## Insert Metadata

1. Configuration
> Make sure that there's at least one galaxy (`.fits.fz`) at the `images` folder.
> You can download one in here: http://dev.linea.gov.br/~matheus.freitas/manga-7443-12701-MEGA.fits.fz.

2. Running Command
```
docker-compose exec backend python manage.py insert_metadata
```

## Extract Image Parts
>This will extract the needed informations of the `.fits.fz` file and store them in separate, and small, files, to decrease the output time on requests.

1. Running Command
```
docker-compose exec backend python manage.py extract_image_parts
```

## Download SDSS Images
>This will download the SDSS image by the object's RA and Dec.
>You can check the images in here: http://skyserver.sdss.org/dr16/en/tools/chart/image.aspx.

1. Running Command
```
docker-compose exec backend python manage.py download_sdss_images
```