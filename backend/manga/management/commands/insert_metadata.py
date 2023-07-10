
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
import pandas as pd


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

        parser.add_argument(
            '--clear_table',
            dest='clear_table',
            action='store_true',
            help='Use this parameter to overwrite pre-existing data.',
        )

    def handle(self, *args, **kwargs):

        if kwargs['clear_table']:
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

    def read_object_list_fits(self, filename):
        drpall_metadata = mclass().get_metadata(filename)

        columns = self.get_model_fields(Image)
        columns.remove('id')

        for column in list(drpall_metadata):
            if column not in columns:
                del drpall_metadata[column]

        list_metadata = self.dict_list_to_list_dict(drpall_metadata)

        parts_folder = get_megacube_parts_root_path()

        count = 0
        for row in list_metadata:

            original_filename = 'manga-%s-MEGACUBE.fits.tar.bz2' % row['plateifu']
            folder_name = 'manga-%s' % row['plateifu']
            original_megacube_path = get_megacube_path(original_filename)
            megacube_parts = parts_folder.joinpath(folder_name)

            if original_megacube_path.exists() and original_megacube_path.is_file():
                self.stdout.write("original_megacube_path: %s" %
                                  str(original_megacube_path))
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
                    setattr(new_image, 'compressed_size',
                            original_megacube_path.stat().st_size)

                    # Folder name (used in megacubo_parts_directory)
                    setattr(new_image, 'folder_name', folder_name)

                    self.stdout.write('Have parts folder %s' %
                                      megacube_parts.exists())
                    if megacube_parts.exists():
                        setattr(new_image, 'had_parts_extracted', True)

                    new_image.save()

                    self.stdout.write('Inserted metadata for %s' % filename)
                    count += 1

                # Verifying that the there's not duplicates
                except IntegrityError:
                    pass

        self.stdout.write('Finished! %s of %s objects are registered.' % (
            count, len(list_metadata)))

    def read_object_list_csv(self, filename):
        df = pd.read_csv(filename, skiprows=1,
                         names=[
                             'megacube',
                             'mangaid',
                             'plateifu',
                             'objra',
                             'objdec',
                             'fcfc1_50',
                             'xyy_light',
                             'xyo_light',
                             'xiy_light',
                             'xii_light',
                             'xio_light',
                             'xo_light',
                             'xyy_mass',
                             'xyo_mass',
                             'xiy_mass',
                             'xii_mass',
                             'xio_mass',
                             'xo_mass',
                             'sfr_1',
                             'sfr_5',
                             'sfr_10',
                             'sfr_14',
                             'sfr_20',
                             'sfr_30',
                             'sfr_56',
                             'sfr_100',
                             'sfr_200',
                             'av_star',
                             'mage_l',
                             'mage_m',
                             'mz_l',
                             'mz_m',
                             'mstar',
                             'sigma_star',
                             'vrot_star',
                             'f_hb',
                             'f_o3_4959',
                             'f_o3_5007',
                             'f_he1_5876',
                             'f_o1_6300',
                             'f_n2_6548',
                             'f_ha',
                             'f_n2_6583',
                             'f_s2_6716',
                             'f_s2_6731',
                             'eqw_hb',
                             'eqw_o3_4959',
                             'eqw_o3_5007',
                             'eqw_he1_5876',
                             'eqw_o1_6300',
                             'eqw_n2_6548',
                             'eqw_ha',
                             'eqw_n2_6583',
                             'eqw_s2_6716',
                             'eqw_s2_6731',
                             'v_hb',
                             'v_o3_4959',
                             'v_o3_5007',
                             'v_he1_5876',
                             'v_o1_6300',
                             'v_n2_6548',
                             'v_ha',
                             'v_n2_6583',
                             'v_s2_6716',
                             'v_s2_6731',
                             'sigma_hb',
                             'sigma_o3_4959',
                             'sigma_o3_5007',
                             'sigma_he1_5876',
                             'sigma_o1_6300',
                             'sigma_n2_6548',
                             'sigma_ha',
                             'sigma_n2_6583',
                             'sigma_s2_6716',
                             'sigma_s2_6731'
                         ])
        
        rows = list(df.to_dict("records"))

        parts_folder = get_megacube_parts_root_path()

        count_registered = 0
        count_original_file_exists = 0
        count_parts_exist = 0

        for galaxy in rows:
            original_filename = f"{galaxy['megacube']}.tar.bz2"
            folder_name = 'manga-%s' % galaxy['plateifu']
            original_megacube_path = get_megacube_path(original_filename)
            megacube_parts = parts_folder.joinpath(folder_name)

            obj, created = Image.objects.update_or_create(
                mangaid=galaxy['mangaid'],
                defaults=galaxy,
            )
            count_registered += 1

            if original_megacube_path.exists() and original_megacube_path.is_file():
                self.stdout.write("original_megacube_path: %s" %
                                  str(original_megacube_path))
                
                count_original_file_exists += 1
                # Adding compression            
                obj.compression = '.tar.bz2'
                # Complete path to original file
                obj.path = original_megacube_path
                # Compressed file size
                obj.compressed_size = original_megacube_path.stat().st_size
                # Folder name (used in megacubo_parts_directory)
                obj.folder_name = folder_name

                self.stdout.write('Have parts folder %s' %
                                    megacube_parts.exists())
                obj.had_parts_extracted = megacube_parts.exists()            
                if megacube_parts.exists():
                    count_parts_exist += 1
                obj.save()

        self.stdout.write('%s Objects in %s.' % (len(rows), filename))
        self.stdout.write(f'Original bz2 file Exists: {count_original_file_exists}')
        self.stdout.write(f'Megacubo Parts Exists: {count_parts_exist}')

    def update_metadata(self, filename):
        self.stdout.write(
            'Reading object list from : %s' % filename)

        obj_list_filepath = get_megacube_path(filename)
        if not obj_list_filepath.exists():
            raise Exception('No input files found: %s' %
                            str(obj_list_filepath))

        print(obj_list_filepath.suffix)
        if obj_list_filepath.suffix == '.fits':
            list_metadata = self.read_object_list_fits(obj_list_filepath)
        elif obj_list_filepath.suffix == '.csv':
            list_metadata = self.read_object_list_csv(obj_list_filepath)
        else:
            self.stdout.write(
                f'File format {obj_list_filepath.suffix} is not valid use .fits or .csv')

