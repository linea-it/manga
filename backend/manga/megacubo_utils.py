from pathlib import Path
from django.conf import settings
import tarfile

def get_megacube_path(filename):
    return Path(settings.IMAGES_DIR).joinpath(filename)

def get_megacube_parts_root_path():
    return Path(settings.MEGACUBE_PARTS)

def get_megacube_cache_root_path():
    return Path(settings.MEGACUBE_CACHE)

def extract_bz2(compressed_file, local_dir):
    with tarfile.open(compressed_file, "r:bz2") as tar:
        tar.extractall(local_dir)

def compress_bz2(filepath, compressed_file):
    with tarfile.open(compressed_file, "w:bz2") as tar:
        tar.add(filepath, recursive=False, arcname=filepath.name)      