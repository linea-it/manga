FROM python:3.6

MAINTAINER Glauber Costa Vila Verde <glauber.vila.verde@gmail.com>

ENV APP_PATH=/app
ENV STATIC_PATH=/app/static

RUN mkdir ${APP_PATH} ${STATIC_PATH}

COPY . ${APP_PATH}

WORKDIR ${APP_PATH}

RUN pip install --upgrade pip

RUN pip install -r ${APP_PATH}/requirements.txt


EXPOSE 8000

CMD gunicorn -b 0.0.0.0:8000 --workers=3 --reload wsgi:app