#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

rm -f './celerybeat.pid'
celery worker --workdir /usr/src/app --app manga -l INFO --beat