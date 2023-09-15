import statistics
from datetime import datetime, timedelta
from pathlib import Path

import humanize
from django.core.management.base import BaseCommand

from galaxy.models import Image
from manga.megacube import MangaMegacube
from manga.megacubo_utils import get_megacube_parts_root_path


class Command(BaseCommand):
    help = "Extracting image parts to separate files to gain performance"

    def add_arguments(self, parser):
        parser.add_argument(
            "--name",
            dest="name",
            help="Megacube name",
        )

        parser.add_argument(
            "--limit",
            dest="limit",
            default=None,
            help="Limit max objects executed in one run.",
        )
        parser.add_argument(
            "--all",
            dest="all_objects",
            action="store_true",
            help="Use this parameter to execute for all objects.",
        )
        parser.add_argument(
            "--force",
            dest="force_overwrite",
            action="store_true",
            help="Use this parameter to overwrite pre-existing data.",
        )

    def handle(self, *args, **kwargs):
        # TODO: Implementar paralelismo com Celery
        # TODO: Task para Remover arquivos do diretório cache

        t0 = datetime.now()

        if kwargs["all_objects"]:
            # Todos os objetos independente de já ter sido executado.
            objs = Image.objects.all()
        elif kwargs["name"]:
            objs = Image.objects.filter(megacube=kwargs["name"])
        else:
            # Apenas objetos que ainda não foram executados.
            objs = Image.objects.filter(had_parts_extracted=False)

        if kwargs["limit"]:
            objs = objs[0 : int(kwargs["limit"])]

        current = 1
        exec_times = []
        for obj in objs:
            title = "[%s/%s] " % (current, len(objs))
            self.stdout.write(title.ljust(80, "-"))

            if obj.path != None:
                exec_time = self.process_single_object(obj, overwrite=kwargs["force_overwrite"])
                exec_times.append(exec_time)

            current += 1
            # Calculo estimativa de tempo de execução.
            if len(exec_times) > 0:
                estimated = (len(objs) - current) * statistics.mean(exec_times)
                estimated_delta = timedelta(seconds=estimated)
                self.stdout.write("Processed %s of %s objects" % (current, len(objs)))
                self.stdout.write(
                    "Estimated Execution time: %s" % humanize.naturaldelta(estimated_delta, minimum_unit="seconds")
                )

        self.stdout.write("".ljust(80, "-"))

        # Total de objetos sem ter os arquivos extrair.
        total = Image.objects.all().count()
        self.stdout.write(f"Count Objects: {total} ")
        ok = Image.objects.filter(had_parts_extracted=True).count()
        self.stdout.write(f"Had Parts OK: {ok}")
        not_ok = Image.objects.filter(had_parts_extracted=False).count()
        self.stdout.write(f"Missing extract parts: {not_ok}")

        t1 = datetime.now()
        tdelta = t1 - t0
        self.stdout.write("Started [%s]" % t0.strftime("%Y-%m-%d %H:%M:%S"))
        self.stdout.write("Finished [%s]" % t1.strftime("%Y-%m-%d %H:%M:%S"))
        self.stdout.write("Execution Time: [%s]" % humanize.naturaldelta(tdelta, minimum_unit="seconds"))

        self.stdout.write("Done!")

    def process_single_object(self, obj, overwrite=False):
        t0 = datetime.now()

        # Original file compressed
        orinal_filepath = Path(obj.path)
        self.stdout.write("Original File: [%s]" % str(orinal_filepath))
        if not orinal_filepath.exists():
            self.stdout.write(f"[ERROR] File not Found")
            obj.had_parts_extracted = False
            obj.save()
        else:
            # Object directory in Images Megacube Parts.
            parts_root = get_megacube_parts_root_path()
            cube = MangaMegacube(orinal_filepath, parts_root)

            #  Extrair o megacubo bz2 -> fits
            compress = False
            if not cube.fits_exist():
                cube.extract_bz2()
                compress = True

            # A partir daqui utiliza o arquivo Fits.
            cube.extract_megacube_parts(overwrite)
            cube.download_sdss_image(obj.objra, obj.objdec, overwrite)

            if compress:
                cube.compress_bz2(keep_original=True)

            isok = cube.check_extracted_parts()
            print(f"Had Extracted part?: [{isok}]")
            obj.had_parts_extracted = isok
            obj.save()

        t1 = datetime.now()
        tdelta = t1 - t0
        self.stdout.write("Execution Time: [%s]" % humanize.precisedelta(tdelta))

        return tdelta.total_seconds()
