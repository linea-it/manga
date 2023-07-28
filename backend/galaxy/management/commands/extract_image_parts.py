
import statistics
from datetime import datetime, timedelta
from pathlib import Path

import humanize
from django.core.management.base import BaseCommand
from galaxy.models import Image

from manga.megacubo_utils import get_megacube_parts_root_path
from manga.megacube import MangaMegacube
import json
import requests
import shutil

class Command(BaseCommand):
    help = 'Extracting image parts to separate files to gain performance'

    def add_arguments(self, parser):

        parser.add_argument(
            '--name',
            dest='name',
            help='Megacube name',
        )

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
        elif kwargs['name']:
            objs = Image.objects.filter(megacube=kwargs['name'])
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
            
            if obj.path != None:
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
        self.stdout.write('Plate IFU: [%s]' % obj.plateifu)
        self.stdout.write('Manga ID: [%s]' % obj.mangaid)
        # Object directory in Images Megacube Parts.
        parts_path = get_megacube_parts_root_path().joinpath(obj.folder_name)
        self.stdout.write("Megacube Parts: [%s]" % str(parts_path))

        cube = MangaMegacube(orinal_filepath)

        #  Extrair o megacubo bz2 -> fits
        cube.extract_bz2()
        cube.extract_megacube_parts(parts_path)
        # cube.compress_bz2()

        obj.had_parts_extracted = True
        obj.save()

        self.download_images(obj)

        t1 = datetime.now()
        tdelta = t1 - t0
        self.stdout.write('Execution Time: [%s]' %
                        humanize.precisedelta(tdelta))

        return tdelta.total_seconds()


    def download_images(self, obj):
        """
            It downloads the SDSS Image by its RA and Dec
            for each image and save them in the path
            /images/megacube_parts/megacube_{JOB_ID}/sdss_image.jpg
        """
        self.stdout.write('Downloading SDSS Image [%s]' % str(obj.megacube))
        # Object directory in Images Megacube Parts.
        parts_path = get_megacube_parts_root_path().joinpath(obj.folder_name)
        ra = obj.objra
        dec = obj.objdec

        # Set up the image URL and filename
        image_url = "http://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Chart.Image&ra=%s&dec=%s&scale=0.099515875&width=512&height=512&opt=G&query=" % (ra, dec)
        filename = 'sdss_image.jpg'

        # Open the url image, set stream to True, this will return the stream content.
        r = requests.get(image_url, stream=True)

        # Check if the image was retrieved successfully
        if r.status_code == 200:
            # Set decode_content value to True, otherwise the downloaded image file's size will be zero.
            r.raw.decode_content = True

            filepath = Path(parts_path).joinpath(filename)
            if filepath.exists():
                filepath.unlink()

            # Open a local file with wb ( write binary ) permission.
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(r.raw, f)  
            self.stdout.write('Finished Download SDSS Images!')                
        else:
            self.stdout.write(
                'SDSS Image [%s] could not be retrieved' % str(obj.megacube))



