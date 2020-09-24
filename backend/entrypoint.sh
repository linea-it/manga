# #!/bin/sh

# if [ "$DATABASE" = "postgres" ]
# then
#   echo "Waiting for postgres..."

#   while ! nc -z $SQL_HOST $SQL_PORT; do
#     sleep 0.1
#   done

#   echo "PostgreSQL started"
# fi

# python manage.py flush --no-input
# python manage.py migrate
# python manage.py collectstatic --no-input --clear

# exec "$@"


#!/bin/sh

cd $APP_PATH

YELLOW='\033[00;33m'
NO_COLOR='\033[0m'

# Se nao tiver o manage.py e a primeira vez que o container e executado, apenas abre o terminal.
ls
if [ -e manage.py ]
then
    # Usar o server do django so para desenvolvimento
    echo "Running Django with ${YELLOW} DEVELOPMENT SERVER ${NO_COLOR}, for production use Gunicorn."

    echo "Running Migrate to apply changes in database"
    python manage.py migrate

    echo "Running Collect Statics"
    python manage.py collectstatic --clear --noinput --verbosity 0

    echo "Running Insert Metadata"
    python manage.py insert_metadata

    python manage.py runserver 0.0.0.0:$GUNICORN_PORT

    # Dar Permissao aos arquivos de log
    chmod -R 775 $LOG_DIR

    # Para producao usar Gunicorn
    # Exemplo usando Gunicorn mais faltou o log no output do container.
    # echo "Starting Gunicorn"
    # gunicorn --bind 0.0.0.0:$GUNICORN_PORT \
    #     $GUNICORN_MODULE:$GUNICORN_CALLABLE \
    #     --reload
else
    /bin/bash
fi



