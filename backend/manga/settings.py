"""
Django settings for manga project.

Generated by 'django-admin startproject' using Django 3.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import ldap
from django_auth_ldap.config import LDAPSearch

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = int(os.environ.get("DEBUG", default=0))

# 'DJANGO_ALLOWED_HOSTS' should be a single string of hosts with a space between each.
# For example: 'DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]'
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework.authtoken',

    # Apps
    'manga.apps.MangaConfig',
    'galaxy.apps.GalaxyConfig',
    'classification.apps.ClassificationConfig',
    'common.apps.CommonConfig',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'manga.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'manga.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('SQL_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.environ.get('SQL_DATABASE', os.path.join(BASE_DIR, 'db.sqlite3')),
        'USER': os.environ.get('SQL_USER', 'user'),
        'PASSWORD': os.environ.get('SQL_PASSWORD', 'password'),
        'HOST': os.environ.get('SQL_HOST', 'localhost'),
        'PORT': os.environ.get('SQL_PORT', '5432'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'common.pagination.StandardResultsSetPagination',
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'url_filter.integrations.drf.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}

# Project Path
IMAGES_DIR = "/images"

# Sub directories of /images
MEGACUBE_ROOT = 'megacube_parts'
MEGACUBE_PARTS = os.path.join(IMAGES_DIR, MEGACUBE_ROOT)

if not os.path.exists(MEGACUBE_PARTS):
    os.mkdir(MEGACUBE_PARTS)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

# LDAP Authentication
# Responsible for turn on and off the LDAP authentication:
AUTH_LDAP_ENABLED = os.environ.get('AUTH_LDAP_ENABLED')

if AUTH_LDAP_ENABLED == 'True':

    # The address of the LDAP server:
    AUTH_LDAP_SERVER_URI = os.environ.get('AUTH_LDAP_SERVER_URI')

    # The password of the LDAP server (leave empty if anonymous requests are available):
    AUTH_LDAP_BIND_PASSWORD = os.environ.get('AUTH_LDAP_BIND_PASSWORD')

    # The distinguishable name, used to identify entries:
    AUTH_LDAP_BIND_DN = os.environ.get('AUTH_LDAP_BIND_DN')

    # The distinguishable name for searching users, used to identify entries:
    AUTH_LDAP_USER_SEARCH_DN = os.environ.get('AUTH_LDAP_USER_SEARCH_DN')

    AUTH_LDAP_USER_SEARCH = LDAPSearch(
        AUTH_LDAP_USER_SEARCH_DN,
        ldap.SCOPE_SUBTREE, "(uid=%(user)s)"
    )

    # Adding LDAP as an authentication method:
    AUTHENTICATION_BACKENDS += ('django_auth_ldap.backend.LDAPBackend',)


# Logging

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}


# HOST URL url para onde o app está disponivel. em desenvolvimento //localhost
# No ambiente de testes é //manga.linea.gov.br
HOST_URL = None
try:
    HOST_URL = os.environ["HOST_URL"]
except:
    raise ("Environment variable HOST_URL can not be null.")

# Configurando os redirects padrao de login e logout, para apontar para o HOST_URL.
if HOST_URL is not None:
    LOGOUT_REDIRECT_URL = HOST_URL
    LOGIN_REDIRECT_URL = HOST_URL

# # Email Notification configs
# # Dados de configuração do servidor de email que será usado para envio das notificações.
# EMAIL_HOST = 'smtp.linea.gov.br'
# EMAIL_PORT = '587'
# EMAIL_HOST_USER = None
# EMAIL_HOST_PASSWORD = None
# EMAIL_USE_TLS = False
# # Email utilizado para enviar as notificacoes do science server
# EMAIL_NOTIFICATION = 'noreply@linea.gov.br'
# # Lista de email que receberão uma copia de todas as notificacoes
# EMAIL_NOTIFICATION_COPY_TO = list([])
# # Email para o helpdesk LIneA
# EMAIL_HELPDESK = 'helpdesk@linea.gov.br'
# # Email de contato do LIneA
# EMAIL_HELPDESK_CONTACT = 'manga-portal@linea.gov.br'

# Email Notification configs
# Dados de configuração do servidor de email que será usado para envio das notificações.
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = os.environ.get('EMAIL_PORT')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')
# Email utilizado para enviar as notificacoes do science server
EMAIL_NOTIFICATION = os.environ.get('EMAIL_NOTIFICATION')
# Email para o helpdesk LIneA
EMAIL_HELPDESK = os.environ.get('EMAIL_HELPDESK')
# Email de contato do LIneA
EMAIL_HELPDESK_CONTACT = os.environ.get('EMAIL_HELPDESK_CONTACT')
