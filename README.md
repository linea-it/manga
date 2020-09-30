# MaNGA


## Installation

#### Clone the repository
```
git clone https://github.com/linea-it/manga.git
cd manga
```

### Development

1. Configuration
> You can modify the variables inside the file `.env.dev`.

2. Running
```
docker-compose build
docker-compose up
```

3. Create super user
```
docker-compose exec web manage.py createsuperuser
```

---

### Production

1. Configuration
> You can modify the variables inside the file `.env.prod` and `.env.prod.db`.

2. Running
```
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up
```

3. Create super user
```
docker-compose -f docker-compose.prod.yml exec web manage.py createsuperuser
```