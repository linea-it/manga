FROM python:3.8-slim as builder

# WORKDIR /usr/src/app

# If this is set to a non-empty string, Python won’t try
# to write .pyc files on the import of source modules
ENV PYTHONDONTWRITEBYTECODE=1

# Force the stdout and stderr streams to be unbuffered.
# This option has no effect on the stdin stream.
ENV PYTHONUNBUFFERED=1  

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  python3-tk \
  libaio-dev \
  build-essential \
  libcfitsio-bin \ 
  libsasl2-dev \
  libldap2-dev \
  libssl-dev \
  libpq-dev \
  gfortran \
  libmemcached-dev \
  zlib1g-dev \
  git \
  && apt-get clean \
  && apt-get autoclean \
  && apt-get autoremove --purge  -y \
  && rm -rf /var/lib/apt/lists/* 

COPY ./requirements.txt /tmp/pip-tmp/
RUN pip install --upgrade pip wheel setuptools \
    && pip --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
    && rm -rf /tmp/pip-tmp

ARG USERNAME=manga
ARG USER_UID=1000
ARG USER_GID=$USER_UID


# add user so we can run things as non-root
# https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && mkdir /usr/src/app \
    && chown ${USER_UID}:${USER_GID} /usr/src/app

# Set Python ENV
ENV PYTHONPATH="/usr/src/app:$PYTHONPATH"

# Matplotlib Config 
ENV MPLCONFIGDIR="/tmp"

ENV SHELL /bin/bash

# Copy app files into container
WORKDIR /usr/src/app
COPY . /usr/src/app

COPY --chmod=0775 ./entrypoint.sh /entrypoint.sh
COPY --chmod=0775 ./start.sh /start.sh
COPY --chmod=0775 ./start-celery-worker.sh /start-celery-worker.sh
COPY --chmod=0775 ./start-celery-beat.sh /start-celery-beat.sh
COPY --chmod=0775 ./start-celery-flower.sh /start-celery-flower.sh

# Switch to non-priviliged user and run app
USER manga

ENTRYPOINT ["/entrypoint.sh"]

