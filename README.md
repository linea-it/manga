# MaNGA Portal

## Installation

#### Clone the repository

```bash
git clone https://github.com/linea-it/manga.git
cd manga
```

### Development

1; Configuration

> You can modify the variables inside the file `.env.dev`.

2; Running database only in first time.

```bash
docker-compose up database
```

After message: database system is ready to accept connections
stop database container ctrl + c

3; Build and run backend

```bash
docker-compose up backend
```

Create django super user

```bash
docker-compose exec backend python manage.py createsuperuser
```

4; Build and run Frontend

```bash
docker-compose run frontend yarn
```

---

## Insert Data

Os dados do portal Manga consitem em duas entidades principais a lista de objetos e os megacubos.

Cada objeto possui um arquivo megacubo que possui varios HDUs.

Para que o portal tenha acesso aos dados de um megacubo primeiro temos que importar a lista de objetos que será registrada em uma tabela no database.

No momento que escrevo o arquivo com os objetos, foi disponibilizado pelo Rogerio Riffel.
O arquivo contem varios atributos dos objetos, mas para o portal o importante são os campos necessários para montar o path para os megacubos. O nome do arquivo que foi disponibilizado é `drpall-v3_1_1.fits`

Pontos de atenção:

- Só é ingerido no banco os objetos que possuem o arquivo Megacubo no diretóiro /images.
- O filename do arquivo está sendo montado dinamicamente dentro do código, pode acontecer dos arquivos no diretório estarem com um nome diferente, neste caso é necessário alterar o código. O filename é `manga-<plateifu>-MEGACUBE.fits` sendo plateifu extraido da lista de objetos.

Considerando que o arquivo de objetos se chama `drpall-v3_1_1.fits` e está no diretório montado como /images e que existam arquivos megacubo neste diretório.

Estando com os containers do ambiente ligado execute o seguinte comando para preencher a tabela de objetos.

```bash
docker-compose exec backend python manage.py insert_metadata drpall-v3_1_1.fits
```

Proximo passo é extrair os HDUs do megacubo em arquivos menores. isto é necessário para permitir um acesso rápido aos dados pela interface. Cada megacubo tem ~1GB o que torna inviavel a sua leitura em tempo real, para isso esse comando abre cada megacubo que foi registrado pelo `insert_metada` e executa rotinas para extrair os dados. Para cada megacubo no diretório /images que tenha cido registrado na etapa anterior, será criado um diretório `/images/megacube_parts/manga-<plateifu>-MEGACUBE.fits/` com um arquivo .json para cada HDU extraido.

```bash
docker-compose exec backend python manage.py extract_image_parts
```

## Build Manual das imagens docker

```bash
cd frontend
docker build -t linea/manga_frontend:$(git describe --always) .
```

```bash
cd backend
docker build -t linea/manga_backend:$(git describe --always) .
```

<!-- Download SDSS Images
This will download the SDSS image by the object's RA and Dec.
You can check the images in here: <http://skyserver.sdss.org/dr16/en/tools/chart/image.aspx>.
Executar o seguinte comando para baixar as imagens para cada objeto.

```bash
docker-compose exec backend python manage.py download_sdss_images
``` -->

---
Arquivos de exemplo: https://www.dropbox.com/sh/ksyxnnm4l7rgbjy/AADRj3hu6b7FIetRThbZCWpJa?dl=0


https://github.com/danielrd6/ifscube

tar -xvjf manga-8261-3702-MEGACUBE.fits.tar.bz2 manga-8261-3702-MEGACUBE.fits

https://github.com/danielrd6/ifscube/blob/master/bin/fit_scrutinizer

fit_scrutinizer manga-8261-3702-MEGACUBE.fits --small-screen