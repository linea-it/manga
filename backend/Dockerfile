FROM python:3.8-slim as builder

WORKDIR /usr/src/app

# If this is set to a non-empty string, Python won’t try
# to write .pyc files on the import of source modules
ENV PYTHONDONTWRITEBYTECODE=1

# Force the stdout and stderr streams to be unbuffered.
# This option has no effect on the stdin stream.
ENV PYTHONUNBUFFERED=1  

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

# Add venv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install python packages
COPY ./requirements.txt /tmp/pip-tmp/
RUN pip install --upgrade pip wheel \
    && pip --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
    && pip install --upgrade git+https://github.com/danielrd6/ifscube.git \
    && rm -rf /tmp/pip-tmp

#  Runtime Stage
FROM python:3.8-slim

ARG USERNAME=manga
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Copy Dependencies for Python LDAP, Psql, etc.
COPY --from=builder /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu

# add user so we can run things as non-root
# https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user
RUN mkdir /images /log \
    && groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && chown -R $USER_UID:$USER_GID /images /log
    # [Optional] Add sudo support. Omit if you don't need to install software after connecting.
    # && apt-get update \
    # && apt-get install -y sudo \
    # && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    # && chmod 0440 /etc/sudoers.d/$USERNAME

# Copy from builder and set ENV for venv
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set Python ENV
ENV PYTHONUNBUFFERED=1 
ENV PYTHONPATH="/usr/src/app:$PYTHONPATH"
# Matplotlib Config 
ENV MPLCONFIGDIR="/tmp"

ENV SHELL /bin/bash

# Copy app files into container
WORKDIR /usr/src/app
COPY . /usr/src/app

COPY ./entrypoint.sh /entrypoint.sh
COPY ./start.sh /start.sh
COPY ./start-celery-worker.sh /start-celery-worker.sh
COPY ./start-celery-beat.sh /start-celery-beat.sh
COPY ./start-celery-flower.sh /start-celery-flower.sh

# Switch to non-priviliged user and run app
USER manga

# ENTRYPOINT ./entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]


# RUN mkdir /images /log /usr/src/app
# WORKDIR /usr/src/app