FROM python:3.8-slim

RUN mkdir /images /log /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  python-dev \
  libaio-dev \
  build-essential \
  libcfitsio-bin \ 
  libsasl2-dev \
  libldap2-dev \
  libssl-dev \
  libpq-dev \
  gfortran \
  git \
  && apt-get clean \
  && apt-get autoclean \
  && apt-get autoremove --purge  -y \
  && rm -rf /var/lib/apt/lists/* 

COPY requirements.txt /tmp/pip-tmp/
RUN pip install --upgrade pip wheel \
    && pip --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
    && pip install --upgrade git+https://github.com/danielrd6/ifscube.git \
    && rm -rf /tmp/pip-tmp

COPY . /usr/src/app

ENTRYPOINT ./entrypoint.sh