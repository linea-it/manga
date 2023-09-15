
from django.core.management.base import BaseCommand
from django.db import connection
from django.db import connection
from galaxy.models import Image
import numpy as np
from manga.megacubo_utils import get_megacube_path, get_megacube_parts_root_path
import pandas as pd
from astropy.table import Table
from tqdm import tqdm

class Command(BaseCommand):
    help = 'Integrating metadata files into the database'
    verbosity = 1

    columns = [
                'megacube', 'mangaid', 'plateifu', 'ned_name', 'objra', 'objdec',
                'fcfc1_50', 'xyy_light', 'xyo_light', 'xiy_light', 'xii_light',
                'xio_light', 'xo_light', 'xyy_mass', 'xyo_mass', 'xiy_mass',
                'xii_mass', 'xio_mass', 'xo_mass', 'sfr_1', 'sfr_5', 'sfr_10',
                'sfr_14', 'sfr_20', 'sfr_30', 'sfr_56', 'sfr_100', 'sfr_200',
                'av_star', 'mage_l', 'mage_m', 'mz_l', 'mz_m', 'mstar',
                'sigma_star', 'vrot_star', 'f_hb', 'f_o3_4959', 'f_o3_5007',
                'f_he1_5876', 'f_o1_6300', 'f_n2_6548', 'f_ha', 'f_n2_6583',
                'f_s2_6716', 'f_s2_6731', 'eqw_hb', 'eqw_o3_4959', 'eqw_o3_5007',
                'eqw_he1_5876', 'eqw_o1_6300', 'eqw_n2_6548', 'eqw_ha', 'eqw_n2_6583',
                'eqw_s2_6716', 'eqw_s2_6731', 'v_hb', 'v_o3_4959', 'v_o3_5007', 'v_he1_5876',
                'v_o1_6300', 'v_n2_6548', 'v_ha', 'v_n2_6583', 'v_s2_6716',
                'v_s2_6731', 'sigma_hb', 'sigma_o3_4959', 'sigma_o3_5007', 'sigma_he1_5876',
                'sigma_o1_6300', 'sigma_n2_6548', 'sigma_ha', 'sigma_n2_6583',
                'sigma_s2_6716', 'sigma_s2_6731'
            ]

    def add_arguments(self, parser):
        # filename
        parser.add_argument(
            'filename',
            help='Arquivo .csv contendo a lista de objetos. ex: megacube_mean_properties_table_Riffel_2023.csv',
        )

        parser.add_argument(
            '--clear_table',
            dest='clear_table',
            action='store_true',
            help='Use this parameter to overwrite pre-existing data.',
        )

    def handle(self, *args, **kwargs):

        self.verbosity = kwargs['verbosity']
        self.update_metadata(filename=kwargs['filename'], clear_table=kwargs['clear_table'])

        self.stdout.write('Done!')

    def delete_table(self, model):
        model.objects.all().delete()
        self.reset_sequence()


    def reset_sequence(self):
        with connection.cursor() as cursor:
            cursor.execute("ALTER SEQUENCE galaxy_image_id_seq RESTART WITH 1")
        self.stdout.write('Restarted sequence to 1')

    def update_metadata(self, filename, clear_table=False):
        self.stdout.write(
            'Reading object list from : %s' % filename)

        obj_list_filepath = get_megacube_path(filename)
        if not obj_list_filepath.exists():
            raise Exception('No input files found: %s' %
                            str(obj_list_filepath))

        df = pd.DataFrame()
        if obj_list_filepath.suffix == '.csv':
            df = self.csv_to_pandas(obj_list_filepath)
        if obj_list_filepath.suffix == '.gz':
            df = self.tar_gz_to_pandas(obj_list_filepath)
        else:
            self.stdout.write(
                f'File format {obj_list_filepath.suffix} is not valid. Use .fits.tar.gz or .csv')

        if df.empty:
            return

        if clear_table == True:
            self.stdout.write('Removing all existing entries from the table')
            self.delete_table(Image)

        count = len(df)
        self.stdout.write(f'{count} Objects in {filename}.')
        self.insert_metadata(df)

    def insert_metadata(self, df):

        # Convert dataframe to list of dicts.
        rows = list(df.to_dict("records"))

        parts_folder = get_megacube_parts_root_path()

        count_registered = 0
        count_original_file_exists = 0
        count_bcomp_exist = 0
        count_parts_exist = 0
        count_created=0
        count_updated=0

        for galaxy in tqdm(rows):
            original_filename = f"{galaxy['megacube']}.tar.bz2"
            bcomp_filename = f"{galaxy['megacube'].replace('-MEGACUBE.fits', '-MEGACUBE-BComp.fits')}.tar.bz2"
            folder_name = 'manga-%s' % galaxy['plateifu']
            original_megacube_path = get_megacube_path(original_filename)
            fits_path = get_megacube_path(galaxy['megacube'])
            bcomp_path = get_megacube_path(bcomp_filename)
            megacube_parts = parts_folder.joinpath(folder_name)

            obj, created = Image.objects.update_or_create(
                megacube=galaxy['megacube'],
                defaults=galaxy,
            )
            if created:
                count_created += 1
            else:
                count_updated += 1

            count_registered += 1

            if original_megacube_path.exists() and original_megacube_path.is_file():

                if self.verbosity > 1:
                    self.stdout.write(f"original_megacube_path: {original_megacube_path}")

                count_original_file_exists += 1
                # Adding compression
                obj.compression = '.tar.bz2'
                # Complete path to original file
                obj.path = original_megacube_path
                # Compressed file size
                obj.compressed_size = original_megacube_path.stat().st_size
                # Folder name (used in megacubo_parts_directory)
                obj.folder_name = folder_name

                if self.verbosity > 1:
                    self.stdout.write(f"Have parts folder: {megacube_parts.exists()}")

                obj.had_parts_extracted = megacube_parts.exists()
                if megacube_parts.exists():
                    count_parts_exist += 1

                # Check Bcomp atribute
                if galaxy['had_bcomp'] == True:
                    if bcomp_path.exists():
                        obj.had_bcomp = True
                        obj.bcomp_path = bcomp_path
                        if self.verbosity > 1:
                            self.stdout.write(f"Have BComp bz2: {bcomp_path.exists()}")
                        count_bcomp_exist += 1
                    else:
                        raise Exception(f"{galaxy['plateifu']} object is marked with bcomp=True flag but bz2 file {bcomp_path} was not found.")

                # Check Fits File
                if fits_path.exists() and fits_path.is_file():
                    # Uncompressed file size
                    obj.size = fits_path.stat().st_size

                obj.save()

        self.stdout.write(f'Records Created: {count_created}')
        self.stdout.write(f'Records Updated: {count_updated}')
        self.stdout.write(f'Original bz2 file Exists: {count_original_file_exists}')
        self.stdout.write(f'Megacubo Parts Exists: {count_parts_exist}')
        self.stdout.write(f'BComp bz2 file Exists: {count_bcomp_exist}')


    def csv_to_pandas(self, filename):
        df = pd.read_csv(
            filename,
            skiprows=1,
            names=[
                'megacube', 'mangaid', 'plateifu', 'ned_name', 'objra', 'objdec',
                'fcfc1_50', 'xyy_light', 'xyo_light', 'xiy_light', 'xii_light',
                'xio_light', 'xo_light', 'xyy_mass', 'xyo_mass', 'xiy_mass',
                'xii_mass', 'xio_mass', 'xo_mass', 'sfr_1', 'sfr_5', 'sfr_10',
                'sfr_14', 'sfr_20', 'sfr_30', 'sfr_56', 'sfr_100', 'sfr_200',
                'av_star', 'mage_l', 'mage_m', 'mz_l', 'mz_m', 'mstar',
                'sigma_star', 'vrot_star', 'f_hb', 'f_o3_4959', 'f_o3_5007',
                'f_he1_5876', 'f_o1_6300', 'f_n2_6548', 'f_ha', 'f_n2_6583',
                'f_s2_6716', 'f_s2_6731', 'eqw_hb', 'eqw_o3_4959', 'eqw_o3_5007',
                'eqw_he1_5876', 'eqw_o1_6300', 'eqw_n2_6548', 'eqw_ha', 'eqw_n2_6583',
                'eqw_s2_6716', 'eqw_s2_6731', 'v_hb', 'v_o3_4959', 'v_o3_5007', 'v_he1_5876',
                'v_o1_6300', 'v_n2_6548', 'v_ha', 'v_n2_6583', 'v_s2_6716',
                'v_s2_6731', 'sigma_hb', 'sigma_o3_4959', 'sigma_o3_5007', 'sigma_he1_5876',
                'sigma_o1_6300', 'sigma_n2_6548', 'sigma_ha', 'sigma_n2_6583',
                'sigma_s2_6716', 'sigma_s2_6731', 'had_bcomp'
            ])

        df = df.sort_values(by=['plateifu'], ascending=True)

        df['had_bcomp'] = df['had_bcomp'].fillna(np.nan).replace([np.nan], [False])
        df = df.fillna(np.nan).replace([np.nan], [None])

        return df

    def tar_gz_to_pandas(self, filename):

        # Read fits hdu with astropy table
        tb = Table.read(filename, hdu="R_INT_0")
        # Convert Table to pd.Dataframe
        df = tb.to_pandas(index=None)
        # Rename all Columns (in same order)
        df.columns = self.columns
        # Convert all bytes columns to string
        str_df = df.select_dtypes([object])
        str_df = str_df.stack().str.decode('utf-8').unstack()
        for col in str_df:
            df[col] = str_df[col]

        # Add had_bcomp column with default False
        df['had_bcomp'] = False
        # Replace all NaN to None
        df = df.fillna(np.nan).replace([np.nan], [None])
        # Sort dataset for plateifu
        df = df.sort_values(by=['plateifu'], ascending=True)

        return df
