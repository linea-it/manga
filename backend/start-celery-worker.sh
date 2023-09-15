#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

celery worker --workdir /usr/src/app --app manga -l INFO
