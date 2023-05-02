
import json
import os
import shutil
import statistics
from datetime import datetime, timedelta
from pathlib import Path

import humanize
import requests
from astropy.io import fits as pf
from django.conf import settings
from django.core.management.base import BaseCommand
from galaxy.models import Image

from manga.verifyer import mclass
from manga.megacubo_utils import get_megacube_parts_root_path, get_megacube_cache_root_path, extract_bz2, compress_bz2
from manga.gas_maps import GasMaps

class Command(BaseCommand):
    help = 'Extracting image parts to separate files to gain performance'

    def add_arguments(self, parser):

        parser.add_argument(
            '--limit',
            dest='limit',
            default=None,
            help='Limit max objects executed in one run.',
        )

        parser.add_argument(
            '--force',
            dest='force_overwrite',
            action='store_true',
            help='Use this parameter to overwrite pre-existing data.',
        )

    def handle(self, *args, **kwargs):
        # TODO: Implementar paralelismo com Celery
        # TODO: Task para Remover arquivos do diretório cache

        t0 = datetime.now()

        self.stdout.write('Started [%s]' %
                          t0.strftime("%Y-%m-%d %H:%M:%S"))

        if kwargs['force_overwrite']:
            # Todos os objetos independente de já ter sido executado.
            objs = Image.objects.all()
        else:
            # Apenas objetos que ainda não foram executados.
            objs = Image.objects.filter(had_parts_extracted=False)

        if kwargs['limit']:
            objs = objs[0:int(kwargs['limit'])]

        current = 0
        exec_times = []
        for obj in objs:
            title = " [%s/%s] " % (current, len(objs))
            self.stdout.write(title.center(80, '-'))

            exec_time = self.process_single_object(obj)
            exec_times.append(exec_time)
            current += 1

            self.stdout.write("".ljust(80, '-'))

            # Calculo estimativa de tempo de execução.
            estimated = (len(objs) - current) * statistics.mean(exec_times)
            estimated_delta = timedelta(seconds=estimated)
            self.stdout.write("Processed %s of %s objects" %
                              (current, len(objs)))
            self.stdout.write("Estimated Execution time: %s" % humanize.naturaldelta(
                estimated_delta, minimum_unit="seconds"))

        t1 = datetime.now()

        tdelta = t1 - t0

        self.stdout.write('Finished [%s]' %
                          t1.strftime("%Y-%m-%d %H:%M:%S"))
        self.stdout.write('Execution Time: [%s]' % humanize.naturaldelta(
            tdelta, minimum_unit="seconds"))

        self.stdout.write('Done!')

    def process_single_object(self, obj):
        t0 = datetime.now()

        # Original file compressed
        orinal_filepath = Path(obj.path)
        self.stdout.write("Original File: [%s]" % str(orinal_filepath))

        obj_folder_name = obj.folder_name
        self.stdout.write("Folder Name: [%s]" % str(obj_folder_name))

        # Object directory in Megacube Parts.
        obj_path = get_megacube_parts_root_path().joinpath(obj_folder_name)
        self.stdout.write("Megacube Parts Path: [%s]" % str(obj_path))
        obj_path.mkdir(parents=True, exist_ok=True)

        # Object Cache directory.
        # obj_cache_path = get_megacube_cache_root_path().joinpath(obj.megacube)
        # self.stdout.write("Megacube Cache Path: [%s]" % str(obj_cache_path))


        # Uncompressed Fits file in images cache directory.
        # fits_filepath = obj_path.joinpath(obj.megacube)
        
        fits_filepath = get_megacube_cache_root_path().joinpath(obj.megacube)
        self.stdout.write("Extracted Fits: [%s]" % str(fits_filepath))

        self.stdout.write('Processing file: [%s]' % orinal_filepath)
        self.stdout.write('Plate IFU: [%s]' % obj.plateifu)
        self.stdout.write('Manga ID: [%s]' % obj.mangaid)

        self.stdout.write('Extracting tar.bz2 file.')
        extract_bz2(
            compressed_file=orinal_filepath, 
            local_dir=fits_filepath.parent)
        self.stdout.write('Fits file Exists: [%s] Filepath: [%s]' % (
            fits_filepath.exists(), fits_filepath))

        # Rename orinal file to keep backup
        backup_filepath = Path(orinal_filepath.parent , f"{obj.megacube}{obj.compression}_backup")
        if not backup_filepath.exists():
            orinal_filepath.rename(backup_filepath)
            self.stdout.write('Backup Original file: [%s]' % backup_filepath)
        else:
            self.stdout.write('A backup file already exists: [%s]' % backup_filepath)

        # Update Megacubo Headers
        self.update_megacube_header(fits_filepath)

        self.extract_megacube_header(fits_filepath, obj_path)
        self.exctract_original_image(fits_filepath, obj_path)
        self.extract_list_hud(fits_filepath, obj_path)
        self.extract_image_heatmap(fits_filepath, obj_path)
        self.extract_image_gas_heatmap(fits_filepath, obj_path)


        self.download_sdss_images(obj, obj_path)

        self.stdout.write('Compressing to tar.bz2 file.')
        new_compressed_file = Path(obj.path)
        compress_bz2(
            filepath=fits_filepath, 
            compressed_file=new_compressed_file)

        # TODO: Temporariamente não estou removendo os arquivos extraidos para ter o cache para interface 
        # Ate decidirmos se vamos usar o arquivo extraido ou comprimido.
        # fits_filepath.unlink()
        # self.stdout.write('Removed Fits file. Exists: [%s]' % fits_filepath.exists())

        obj.had_parts_extracted = True
        obj.save()

        t1 = datetime.now()
        tdelta = t1 - t0
        self.stdout.write('Execution Time: [%s]' %
                          humanize.precisedelta(tdelta))

        return tdelta.total_seconds()

    # def get_megacube_path(self, filename):
    #     return Path(os.getenv('IMAGE_PATH', '/images/')).joinpath(filename)

    def write_in_megacube_path(self, path, filename, content):
        # Create directories, if they don't exist already:
        path = Path(path)
        path.mkdir(parents=True, exist_ok=True)
        # Join and make the path for the extracted files:
        filepath = path.joinpath(filename)

        # If file already exists, remove it:
        if filepath.exists():
            filepath.unlink()

        with open(filepath, "w") as f:
            json.dump(content, f)

        return filepath

    def exctract_original_image(self, megacube, path):
        """
            It extracts the Origimal Image (zero) data from 'FLUX' HUD
            for each image and save them in a very small JSON file in the path
            /images/megacube_parts/megacube_{JOB_ID}/original_image.json.
        """
        # self.stdout.write('Extracting Original Image.')

        cube_data = mclass().get_original_cube_data(megacube)

        content = dict({
            'z': cube_data,
            'title': 'FLUX',
        })

        filename = 'original_image.json'

        filepath = self.write_in_megacube_path(path, filename, content)
        self.stdout.write('Original Image created: [%s]' % filepath)

    def extract_list_hud(self, megacube, path):
        """
            It extracts the List of HUDs from 'PoPBins' HUD
            for each image and save them in a very small JSON file in the path
            /images/megacube_parts/megacube_{JOB_ID}/list_hud.json.
        """
        # self.stdout.write('Extracting List Of HUD')

        cube_header = mclass().get_headers(megacube, 'PoPBins')

        cube_data = mclass().get_cube_data(megacube, 'PoPBins')

        cube_comments = mclass().get_comments(megacube, 'PoPBins')

        lHud = mclass().get_all_hud(
            cube_header, cube_data)

        dHud = list()

        for hud in lHud:
            # TODO: recuperar o display name para cada HUD
            dHud.append({
                'name': hud,
                'display_name': hud,
                'comment': cube_comments[hud]
            })

        dHud = sorted(dHud, key=lambda i: i['display_name'])

        content = ({
            'hud': dHud
        })

        filename = 'list_hud.json'

        filepath = self.write_in_megacube_path(path, filename, content)
        self.stdout.write('HUD List created: [%s]' % filepath)

    def extract_image_heatmap(self, megacube, path):
        """
            It extracts all the Image Heatmaps from 'PoPBins' HUD
            for each image and for each HUD saved in the file
            /images/megacube_parts/megacube_{JOB_ID}/list_hud.json
            and save them in very small JSON files in the path
            /images/megacube_parts/megacube_{JOB_ID}/image_heatmap_{HUD}.json.json.
        """
        self.stdout.write('Started Image Heatmap By HUD.')

        cube_header = mclass().get_headers(megacube, 'PoPBins')

        cube_data = mclass().get_cube_data(megacube, 'PoPBins')

        lHud = mclass().get_all_hud(
            cube_header, cube_data)

        count = 0
        for hud in lHud:
            # self.stdout.write('Extracting Image Heatmap [%s] Of HUD [%s]' % (
            #     str(image.id), str(hud)))

            image_data = mclass().image_by_hud(
                megacube, hud)

            content = dict({
                'z': image_data,
                'title': hud,
            })

            filename = 'image_heatmap_%s.json' % hud
            filepath = self.write_in_megacube_path(
                path, filename, content)

            self.stdout.write('HUD [%s] created: [%s]' % (
                hud.ljust(10, ' '), str(filepath).ljust(80, ' ')))

            count += 1
        self.stdout.write('Images Heatmap Files created [%s]' % count)

    def extract_megacube_header(self, megacube, path):
        """
            It extracts the Megacube Header from 'PoPBins' HUD
            for each image and save them in a very small JSON file in the path
            /images/megacube_parts/megacube_{JOB_ID}/cube_header.json.
        """
        # self.stdout.write('Extracting Megacube Header.')
        content = repr(mclass().get_headers(
            megacube, 'PoPBins')).split('\n')

        filename = 'cube_header.json'

        filepath = self.write_in_megacube_path(path, filename, content)

        self.stdout.write('Megacube Header created: [%s]' % filepath)

    # def extract_bz2(self, compressed_file, local_dir):
    #     self.stdout.write('Extracting tar.bz2 file.')
    #     with tarfile.open(compressed_file, "r:bz2") as tar:
    #         tar.extractall(local_dir)

    # def compress_bz2(self, filepath, compressed_file):
    #     self.stdout.write('Compressing to tar.bz2 file.')
    #     with tarfile.open(compressed_file, "w:bz2") as tar:
    #         tar.add(filepath, arcname='.')

    def download_sdss_images(self, image, path):
        """
            It downloads the SDSS Image by its RA and Dec
            for each image and save them in the path
            /images/megacube_parts/megacube_{JOB_ID}/sdss_image.jpg
        """

        self.stdout.write('Downloading SDSS Image.')

        ra = image.objra
        dec = image.objdec

        # Set up the image URL and filename
        image_url = "http://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Chart.Image&ra=%s&dec=%s&scale=0.099515875&width=512&height=512&opt=G&query=" % (
            ra, dec)

        filename = 'sdss_image.jpg'
        filepath = Path(path).joinpath(filename)

        # If file already exists, remove it:
        if filepath.exists():
            filepath.unlink()

        # Open the url image, set stream to True, this will return the stream content.
        r = requests.get(image_url, stream=True)

        # Check if the image was retrieved successfully
        if r.status_code == 200:
            # Set decode_content value to True, otherwise the downloaded image file's size will be zero.
            r.raw.decode_content = True

            # Open a local file with wb ( write binary ) permission.
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(r.raw, f)

            self.stdout.write(
                'SDSS Image was downloaded. [%s]' % str(filepath))
        else:
            self.stdout.write('SDSS Image could not be retrieved')

    def update_megacube_header(self, filepath):
        self.stdout.write('Updating fits headers.')
        with pf.open(filepath, mode="update") as file:
            header = file["PopBins"].header
            header.update(
                DATA27=('Mstar', 'Present mass in stars (M_sun, M* from starligh)'))
            header.update(
                DATA28=('Mpross', 'Mass that has been processed in stars (~2xMstar)'))
            file.flush()

    def extract_image_gas_heatmap(self, megacube, path):

        self.stdout.write('Started Image Gas Heatmap.')

        my_cube = GasMaps(megacube)

        maps_names = my_cube.extract_all_maps(path)
        for map in maps_names:
            self.stdout.write('MAP [%s] created: [%s]' % (
                map['name'].ljust(15, ' '), str(map['filepath']).ljust(90, ' ')))

        self.stdout.write('Images Gas Heatmap Files created [%s]' % len(maps_names))

        