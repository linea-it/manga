#!/usr/bin/env python
from setuptools import find_packages, setup

setup(
    name="manga",
    version="1.2.0",
    packages=find_packages(),
    scripts=["manage.py"],
    license="MIT",
    python_requires=">=3.8",
    url="https://github.com/linea-it/manga",
)
