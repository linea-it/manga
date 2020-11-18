from django.core.management.base import BaseCommand

from galaxy.models import Image

import os
import json
from django.conf import settings
import requests
import shutil


class Command(BaseCommand):
    help = 'Downloading SDSS images of the galaxies'

    def handle(self, *args, **kwargs):

        self.stdout.write('Started')

        self.download_images()

        self.stdout.write('Done!')

    def save_in_megacube_path(self, megacube_id, filename, content):
        # Join and make the path for the extracted files:
        filepath = os.path.join(
            settings.MEGACUBE_PARTS,
            'megacube_' + str(megacube_id) + '/' + filename
        )

        # Create directories, if they don't exist already:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        # If file already exists, remove it:
        if os.path.exists(filepath):
            os.remove(filepath)

        # Open a local file with wb ( write binary ) permission.
        with open(filepath, 'wb') as f:
            shutil.copyfileobj(content, f)

    def download_images(self):
        """
            It downloads the SDSS Image by its RA and Dec
            for each image and save them in the path
            /images/megacube_parts/megacube_{JOB_ID}/sdss_image.jpg
        """

        self.stdout.write('Started Download SDSS Images')

        images = Image.objects.all()

        for image in images:
            self.stdout.write('Downloading SDSS Image [%s]' % str(image.id))

            ra = image.objra
            dec = image.objdec

            # Set up the image URL and filename

            image_url = "http://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Chart.Image&ra=%s&dec=%s&scale=0.049515875&width=1024&height=1024&opt=&query=" % (
                ra, dec)
            filename = 'sdss_image.jpg'

            # Open the url image, set stream to True, this will return the stream content.
            r = requests.get(image_url, stream=True)

            # Check if the image was retrieved successfully
            if r.status_code == 200:
                # Set decode_content value to True, otherwise the downloaded image file's size will be zero.
                r.raw.decode_content = True

                # Open a local file with wb ( write binary ) permission.
                self.save_in_megacube_path(image.id, filename, r.raw)

                self.stdout.write(
                    'SDSS Image [%s] was downloaded' % str(image.id))
            else:
                self.stdout.write(
                    'SDSS Image [%s] could not be retrieved' % str(image.id))

            self.stdout.write("".ljust(100, '-'))

        self.stdout.write('Finished Download SDSS Images!')
