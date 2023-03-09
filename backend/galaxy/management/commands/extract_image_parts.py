
from django.core.management.base import BaseCommand

from galaxy.models import Image
from manga.verifyer import mclass

import os
import json
from django.conf import settings
from datetime import datetime, timedelta
import humanize
import tarfile
import requests
import shutil
import statistics

class Command(BaseCommand):
    help = 'Extracting image parts to separate files to gain performance'

    def handle(self, *args, **kwargs):
        # TODO: Implementar paralelismo com Celery
        # TODO: Parametro para ignorar objetos já executados
        # TODO: Parametro para gerar tudo de novo
        # TODO: Task para Remover arquivos do diretório cache

        t0 = datetime.now()

        self.stdout.write('Started [%s]' %
                          t0.strftime("%Y-%m-%d %H:%M:%S"))

        objs = Image.objects.all()
        # objs = objs[0:1]
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
            self.stdout.write("Processed %s of %s objects" % (current, len(objs)))
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

        filepath = self.get_megacube_path(obj.megacube)
        objdir = obj.megacube.split('.fits.tar.bz2')[0]
        objpath = os.path.join(settings.MEGACUBE_PARTS, objdir)
        fitspath = os.path.join(objpath, obj.megacube.split('.tar.bz2')[0])

        self.stdout.write('Processing file: [%s]' % filepath)
        self.stdout.write('Plate IFU: [%s]' % obj.plateifu)
        self.stdout.write('Manga ID: [%s]' % obj.mangaid)
        
        self.extract_bz2(filepath, objpath)
        self.stdout.write('Fits file: [%s]' % fitspath)
        
        self.extract_megacube_header(obj, fitspath, objpath)
        self.exctract_original_image(obj, fitspath, objpath)
        self.extract_list_hud(obj, fitspath, objpath)
        self.extract_image_heatmap(obj, fitspath, objpath)
        self.download_sdss_images(obj, objpath)

        os.remove(fitspath)
        self.stdout.write('Removed Fits file.')

        t1 = datetime.now()
        tdelta = t1 - t0
        self.stdout.write('Execution Time: [%s]' % humanize.precisedelta(tdelta))

        return tdelta.total_seconds()

    def get_megacube_path(self, filename):
        return os.path.join(os.getenv('IMAGE_PATH', '/images/'), filename)

    def write_in_megacube_path(self, path, filename, content):

        # Join and make the path for the extracted files:
        filepath = os.path.join(path,filename)

        # Create directories, if they don't exist already:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        # If file already exists, remove it:
        if os.path.exists(filepath):
            os.remove(filepath)

        with open(filepath, "w") as f:
            json.dump(content, f)

        return filepath


    def exctract_original_image(self, image, megacube, path):
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

    def extract_list_hud(self, image, megacube, path):
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


    def extract_image_heatmap(self, image, megacube, path):
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

            self.stdout.write('HUD [%s] created: [%s]' % (hud.ljust(10, ' '), filepath.ljust(80, ' ')))

            count += 1
        self.stdout.write('Images Heatmap Files created [%s]' % count)


    def extract_megacube_header(self, image, megacube, path):
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


    def extract_bz2(self, filename, path):
        self.stdout.write('Extracting tar.bz2 file.')
        with tarfile.open(filename, "r:bz2") as tar:
            tar.extractall(path)


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
        filepath = os.path.join(path, filename)

        # If file already exists, remove it:
        if os.path.exists(filepath):
            os.remove(filepath)

        # Open the url image, set stream to True, this will return the stream content.
        r = requests.get(image_url, stream=True)

        # Check if the image was retrieved successfully
        if r.status_code == 200:
            # Set decode_content value to True, otherwise the downloaded image file's size will be zero.
            r.raw.decode_content = True

            # Open a local file with wb ( write binary ) permission.
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(r.raw, f)            

            self.stdout.write('SDSS Image was downloaded. [%s]' % str(filepath))
        else:
            self.stdout.write('SDSS Image could not be retrieved')

            