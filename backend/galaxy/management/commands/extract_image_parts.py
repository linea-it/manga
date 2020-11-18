
from django.core.management.base import BaseCommand

from galaxy.models import Image
from manga.verifyer import mclass

import os
import json
from django.conf import settings
from datetime import datetime
import humanize


class Command(BaseCommand):
    help = 'Extracting image parts to separate files to gain performance'

    def handle(self, *args, **kwargs):

        t0 = datetime.now()

        self.stdout.write('Started [%s]' %
                          t0.strftime("%Y-%m-%d %H:%M:%S"))
        self.extract_megacube_header()
        self.exctract_original_image()
        self.extract_list_hud()
        self.extract_image_heatmap()

        t1 = datetime.now()

        tdelta = t1 - t0

        self.stdout.write('Finished [%s]' %
                          t1.strftime("%Y-%m-%d %H:%M:%S"))
        self.stdout.write('Execution Time: [%s]' % humanize.naturaldelta(
            tdelta, minimum_unit="seconds"))

        self.stdout.write('Done!')

    def get_megacube_path(self, filename):
        return os.path.join(os.getenv('IMAGE_PATH', '/images/'), filename)

    def write_in_megacube_path(self, megacube_id, filename, content):

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

        with open(filepath, "w") as f:
            json.dump(content, f)

    def exctract_original_image(self):
        """
            It extracts the Origimal Image (zero) data from 'FLUX' HUD
            for each image and save them in a very small JSON file in the path
            /images/megacube_parts/megacube_{JOB_ID}/original_image.json.
        """

        self.stdout.write("".ljust(100, '-'))
        self.stdout.write('Started Original Image Extraction')

        images = Image.objects.all()

        for image in images:
            self.stdout.write('Extracting Original Image [%s]' % str(image.id))

            megacube = self.get_megacube_path(image.megacube)

            cube_data = mclass().get_original_cube_data(megacube)

            content = dict({
                'z': cube_data,
                'title': 'FLUX',
            })

            filename = 'original_image.json'

            self.write_in_megacube_path(image.id, filename, content)

        self.stdout.write('Finished Original Image Extraction!')

    def extract_list_hud(self):
        """
            It extracts the List of HUDs from 'PoPBins' HUD
            for each image and save them in a very small JSON file in the path
            /images/megacube_parts/megacube_{JOB_ID}/list_hud.json.
        """

        self.stdout.write("".ljust(100, '-'))
        self.stdout.write('Started List Of HUD Extraction')

        images = Image.objects.all()

        for image in images:
            self.stdout.write('Extracting List Of HUD [%s]' % str(image.id))

            megacube = self.get_megacube_path(image.megacube)

            cube_header = mclass().get_headers(megacube, 'PoPBins')

            cube_data = mclass().get_cube_data(megacube, 'PoPBins')

            lHud = mclass().get_all_hud(
                cube_header, cube_data)

            dHud = list()

            for hud in lHud:
                # TODO: recuperar o display name para cada HUD
                dHud.append({
                    'name': hud,
                    'display_name': hud
                })

            dHud = sorted(dHud, key=lambda i: i['display_name'])

            content = ({
                'hud': dHud
            })

            filename = 'list_hud.json'

            self.write_in_megacube_path(image.id, filename, content)

        self.stdout.write('Finished List Of HUD Extraction!')

    def extract_image_heatmap(self):
        """
            It extracts all the Image Heatmaps from 'PoPBins' HUD
            for each image and for each HUD saved in the file
            /images/megacube_parts/megacube_{JOB_ID}/list_hud.json
            and save them in very small JSON files in the path
            /images/megacube_parts/megacube_{JOB_ID}/image_heatmap_{HUD}.json.json.
        """

        self.stdout.write("".ljust(100, '-'))
        self.stdout.write('Started Image Heatmap Extraction')

        images = Image.objects.all()

        for i, image in enumerate(images):
            t0 = datetime.now()
            self.stdout.write('Started Image Heatmap By ID [%s]: [%s]' % (
                image.id, t0.strftime("%Y-%m-%d %H:%M:%S")))

            megacube = self.get_megacube_path(image.megacube)

            cube_header = mclass().get_headers(megacube, 'PoPBins')

            cube_data = mclass().get_cube_data(megacube, 'PoPBins')

            lHud = mclass().get_all_hud(
                cube_header, cube_data)

            for hud in lHud:
                self.stdout.write('Extracting Image Heatmap [%s] Of HUD [%s]' % (
                    str(image.id), str(hud)))

                megacube = self.get_megacube_path(image.megacube)

                image_data = mclass().image_by_hud(
                    megacube, hud)

                z = mclass().image_data_to_array(image_data)

                content = dict({
                    'z': z,
                    'title': hud,
                })

                filename = 'image_heatmap_%s.json' % hud
                self.write_in_megacube_path(image.id, filename, content)

            # End time of Image Heatmap
            t1 = datetime.now()

            self.stdout.write('Finished Image Heatmap By ID [%s]: [%s]' % (
                image.id, t0.strftime("%Y-%m-%d %H:%M:%S")))

            self.stdout.write('Progress: [%s/%s]' % (i + 1, len(images)))

            tdelta = t1 - t0

            self.stdout.write('Execution Time By ID [%s]: [%s]' % (image.id, humanize.naturaldelta(
                tdelta, minimum_unit="seconds")))
            self.stdout.write("".ljust(100, '-'))

        self.stdout.write('Finished Image Heatmap Extraction!')

    def extract_megacube_header(self):
        """
            It extracts the Megacube Header from 'PoPBins' HUD
            for each image and save them in a very small JSON file in the path
            /images/megacube_parts/megacube_{JOB_ID}/cube_header.json.
        """

        self.stdout.write("".ljust(100, '-'))
        self.stdout.write('Started Megacube Header Extraction')

        images = Image.objects.all()

        for image in images:
            self.stdout.write(
                'Extracting Megacube Header [%s]' % str(image.id))

            megacube = self.get_megacube_path(image.megacube)

            content = repr(mclass().get_headers(
                megacube, 'PoPBins')).split('\n')

            filename = 'cube_header.json'

            self.write_in_megacube_path(image.id, filename, content)

        self.stdout.write('Finished Megacube Header Extraction!')
