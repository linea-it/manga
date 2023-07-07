
from django.core.management.base import BaseCommand
from django.db import connection, IntegrityError

from galaxy.models import Image
from manga.verifyer import mclass
from optparse import make_option
import os
import numpy as np
from pathlib import Path
from django.conf import settings
from manga.megacubo_utils import get_megacube_path, get_megacube_parts_root_path

class Command(BaseCommand):
    help = 'Integrating metadata files into the database'

    def add_arguments(self, parser):
        # filename
        parser.add_argument(
            'filename',
            # dest='filename',
            # default='drpall-v3_1_1.fits',
            help='Arquivo .fits contendo a lista de objetos. ex: drpall-v3_1_1.fits',
        )

        # parser.add_argument(
        #     '--image_host',
        #     dest='image_host',
        #     default='https://desportal.cosmology.illinois.edu',
        #     help='Hostname where the iipserver server is. to devs leave the default value to use production images. for production environments inform the domain where the application is installed. with protocol and without / at the end. example: https://desportal.cosmology.illinois.edu',
        # )

    def handle(self, *args, **kwargs):

        self.stdout.write('Removing all existing entries from the table')

        self.delete_table(Image)

        self.update_metadata(kwargs['filename'])

        self.stdout.write('Done!')

    def delete_table(self, model):
        model.objects.all().delete()

    def get_model_fields(self, model):

        fields = []
        options = model._meta

        for field in options.concrete_fields + options.many_to_many:
            fields.append(field.name)

        return fields

    def merge_same_keys_dict(self, d1, d2):
        ds = [d1, d2]
        d = {}
        for k in d1.keys():
            d[k] = np.concatenate(list(d[k] for d in ds))

        return d

    def dict_list_to_list_dict(self, dl):
        return [dict(zip(dl, t)) for t in zip(*dl.values())]

    def update_metadata(self, filename):
        self.stdout.write(
            'Reading object list from : %s' % filename)

        drpall = get_megacube_path(filename)
        if not drpall.exists():
            raise Exception('No input files found: %s' % str(drpall))

        drpall_metadata = mclass().get_metadata(drpall)

        columns = self.get_model_fields(Image)
        columns.remove('id')

        for column in list(drpall_metadata):
            if column not in columns:
                del drpall_metadata[column]

        # Exemplo concatenando 2 arquivos de metadados.
        # dict_metadata = self.merge_same_keys_dict(mpl4_metadata, mpl9_metadata)
        # list_metadata = self.dict_list_to_list_dict(dict_metadata)
        
        list_metadata = self.dict_list_to_list_dict(drpall_metadata)
        # self.stdout.write(
        #     'Transformed the dictionary of lists to a list of dictionaries')

        self.stdout.write(
            '%s Objects in %s.' %(len(list_metadata), filename))

        parts_folder = get_megacube_parts_root_path()

        count = 0
        for row in list_metadata:

            original_filename = 'manga-%s-MEGACUBE.fits.tar.bz2' % row['plateifu']
            folder_name = 'manga-%s' % row['plateifu']
            original_megacube_path = get_megacube_path(original_filename)
            megacube_parts = parts_folder.joinpath(folder_name)

            if original_megacube_path.exists() and original_megacube_path.is_file():
                self.stdout.write("original_megacube_path: %s" % str(original_megacube_path))
                try:
                    new_image = Image()

                    for key in row.keys():
                        setattr(new_image, key, row[key])

                    # Adding the filename to table
                    filename = 'manga-%s-MEGACUBE.fits' % row['plateifu']
                    setattr(new_image, 'megacube', filename)

                    # Adding compression
                    setattr(new_image, 'compression', '.tar.bz2')

                    # Complete path to original file
                    setattr(new_image, 'path', original_megacube_path)

                    # Compressed file size
                    setattr(new_image, 'compressed_size', original_megacube_path.stat().st_size)

                    # Folder name (used in megacubo_parts_directory)
                    setattr(new_image, 'folder_name', folder_name)

                    self.stdout.write('Have parts folder %s' % megacube_parts.exists())
                    if megacube_parts.exists():
                        setattr(new_image, 'had_parts_extracted', True)

                    new_image.save()

                    self.stdout.write('Inserted metadata for %s' % filename)
                    count += 1

                # Verifying that the there's not duplicates
                except IntegrityError:
                    pass

        self.stdout.write('Finished! %s of %s objects are registered.' % (count, len(list_metadata)))
