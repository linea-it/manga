# Pull official base image
FROM python:3.8.3-alpine

# Set work directory
WORKDIR /usr/src/app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install psycopg2 dependencies
RUN apk update \
  && apk add postgresql-dev gcc python3-dev musl-dev

# Install python-ldap dependencies
RUN apk add build-base openldap-dev python2-dev python3-dev

# Install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# Copy entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

# Copy project
COPY . /usr/src/app/

# Run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]