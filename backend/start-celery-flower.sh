#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

worker_ready() {
    celery --app manga inspect ping
}

until worker_ready; do
  >&2 echo 'Celery workers not available'
  sleep 1
done
>&2 echo 'Celery workers is available'

celery --app manga  \
    --broker="${CELERY_BROKER}" \
    flower
