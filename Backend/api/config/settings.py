"""
Configuración base de Django para el backend de Reviive.

Arquitectura: monolito modular Django + orquestador externo n8n.
n8n nunca escribe directo en las tablas de negocio: sólo a través de la API de Django.
"""

from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY", default="dev-secret-key-change-me")
DEBUG = env("DEBUG", default=True)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "apps.identity",
    "apps.memories",
    "apps.catalog",
    "apps.providers",
    "apps.conversations",
    "apps.agents",
    "apps.recommendations",
    "apps.quotations",
    "apps.orders",
    "apps.memorials",
    "apps.evaluations",
    "apps.analytics",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

AUTH_USER_MODEL = "identity.Usuario"

# DB_ENGINE=sqlite (por defecto, para desarrollo local sin dependencias externas)
# DB_ENGINE=postgres (para docker-compose / despliegue, ver infrastructure/docker)
if env("DB_ENGINE", default="sqlite") == "postgres":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("POSTGRES_DB", default="reviive_db"),
            "USER": env("POSTGRES_USER", default="reviive"),
            "PASSWORD": env("POSTGRES_PASSWORD", default="reviive"),
            "HOST": env("POSTGRES_HOST", default="postgres-reviive"),
            "PORT": env("POSTGRES_PORT", default="5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

if env("REDIS_URL", default=None):
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": env("REDIS_URL"),
        }
    }
else:
    CACHES = {
        "default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "es-co"
TIME_ZONE = "America/Bogota"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS", default=["http://localhost:3000"]
)

# Almacenamiento de archivos (S3/MinIO). Los binarios nunca se guardan en Postgres,
# sólo referencias/URLs firmadas (ver apps.memories.models.Archivo).
AWS_ACCESS_KEY_ID = env("S3_ACCESS_KEY", default="reviive")
AWS_SECRET_ACCESS_KEY = env("S3_SECRET_KEY", default="reviive123")
AWS_STORAGE_BUCKET_NAME = env("S3_BUCKET", default="reviive-media")
AWS_S3_ENDPOINT_URL = env("S3_ENDPOINT_URL", default="http://minio:9000")

# Webhooks entrantes de n8n (firmados con HMAC-SHA256, ver apps.agents).
N8N_WEBHOOK_SECRET = env("N8N_WEBHOOK_SECRET", default="dev-webhook-secret")
N8N_BASE_URL = env("N8N_BASE_URL", default="http://n8n:5678")
