
from django.core.management.base import BaseCommand
from django.db import connection, IntegrityError

from galaxy.models import Image
from manga.verifyer import mclass
from optparse import make_option
import os
import numpy as np


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

    def get_megacube_path(self, filename):
        return os.path.join(os.getenv("IMAGE_PATH", "/images/"), filename)

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

        drpall = self.get_megacube_path(filename)
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

        count = 0
        for row in list_metadata:

            filename = 'manga-%s-MEGACUBE.fits.tar.bz2' % row['plateifu']
            megacube = self.get_megacube_path(filename)

            if os.path.isfile(megacube):

                try:
                    # self.stdout.write('File {} was found!'.format(filename))

                    new_image = Image()

                    for key in row.keys():
                        setattr(new_image, key, row[key])

                    # Adding the filename to table
                    setattr(new_image, 'megacube', filename)

                    new_image.save()

                    self.stdout.write('Inserted metadata for %s' % filename)
                    count += 1

                # Verifying that the there's not duplicates
                except IntegrityError:
                    pass

        self.stdout.write('Finished! %s of %s objects are registered.' % (count, len(list_metadata)))
