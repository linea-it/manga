# MaNGA Visualization Tool
Application to analyze MaNGA megacubes' data.

---

## Installation

**1. Clone the repository**

```shell
git clone https://github.com/linea-it/manga.git
cd manga
```

**2. Running**

- Run using docker-compose:

```shell
cp docker-compose.yml.development docker-compose.yml
docker-compose up
```
> Running at URL: http://localhost/

**3. Run Migrations**
```shell
docker exec -it manga_backend_1 python manage.py db init && \
docker exec -it manga_backend_1 python manage.py db migrate && \
docker exec -it manga_backend_1 python manage.py db upgrade
``

---

## Release History

* v1.0.0
  * INIT: First version.

