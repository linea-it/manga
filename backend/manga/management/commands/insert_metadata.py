
from django.core.management.base import BaseCommand
from django.db import connection, IntegrityError

from galaxy.models import Image
from manga.verifyer import mclass

import os
import numpy as np

class Command(BaseCommand):
    help = 'Integrating metadata files into the database'

    def handle(self, *args, **kwargs):

        self.stdout.write('Removing all existing entries from the table')

        self.delete_table(Image)

        self.update_metadata()

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


    def update_metadata(self):

        mpl4 = self.get_megacube_path('mpl-4/drpall-v1_5_1.fits')
        mpl9 = self.get_megacube_path('mpl-9/drpall-v2_7_1.fits')

        mpl4_metadata = mclass().get_metadata(mpl4)
        self.stdout.write('Fetched MPL4')

        mpl9_metadata = mclass().get_metadata(mpl9)
        self.stdout.write('Fetched MPL9')



        columns = self.get_model_fields(Image)
        columns.remove('id')


        for column in list(mpl4_metadata):
            if column not in columns:
                del mpl4_metadata[column]

        for column in list(mpl9_metadata):
            if column not in columns:
                del mpl9_metadata[column]

        self.stdout.write('Merged the two MPL file data')

        dict_metadata = self.merge_same_keys_dict(mpl4_metadata, mpl9_metadata)
        list_metadata = self.dict_list_to_list_dict(dict_metadata)

        self.stdout.write('Transformed the dictionary of lists to a list of dictionaries')

        for row in list_metadata:

            filename = 'manga-%s-MEGA.fits' % row['plateifu']
            megacube = self.get_megacube_path(filename)

            if os.path.isfile(megacube):

                try:

                    self.stdout.write('File {} was found!'.format(filename))

                    new_image = Image()

                    for key in row.keys():
                        setattr(new_image, key, row[key])

                    # Adding the filename to table
                    setattr(new_image, 'megacube', filename)

                    new_image.save()

                    self.stdout.write('Inserted its metadata into database')

                # Verifying that the there's not duplicates
                except IntegrityError:
                    pass


        self.stdout.write('Finished the database integration')