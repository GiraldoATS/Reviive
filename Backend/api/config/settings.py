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
    "apps.ml",
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

# Base de datos: MySQL (administrada localmente con MySQL Workbench).
# Ver Backend/README.md para la creación del esquema y la configuración de .env.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": env("MYSQL_DATABASE", default="reviive_db"),
        "USER": env("MYSQL_USER", default="root"),
        "PASSWORD": env("MYSQL_PASSWORD", default=""),
        "HOST": env("MYSQL_HOST", default="127.0.0.1"),
        "PORT": env("MYSQL_PORT", default="3306"),
        "OPTIONS": {"charset": "utf8mb4"},
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

# Usado para armar el enlace de restablecimiento de contraseña
# (FRONTEND_URL + /auth/restablecer?uid=...&token=...) en el correo.
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:3000")

# El enlace de restablecimiento de contraseña es válido por 24h (coincide
# con el texto de Backend/api/apps/identity/templates/identity/emails/
# restablecer_contrasena.html). default_token_generator.check_token lo
# valida contra esto automáticamente.
PASSWORD_RESET_TIMEOUT = 60 * 60 * 24

# Sin credenciales SMTP reales configuradas (desarrollo), los correos se
# imprimen en la consola del servidor en vez de enviarse -- se puede
# probar el flujo completo sin depender de una cuenta de correo real.
# Al configurar EMAIL_HOST_USER/EMAIL_HOST_PASSWORD en .env, se envían de
# verdad automáticamente (sin necesidad de tocar tambien EMAIL_BACKEND).
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
EMAIL_HOST = env("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="Reviive <no-responder@reviive.com>")
EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
    if EMAIL_HOST_USER
    else "django.core.mail.backends.console.EmailBackend"
)

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
    # Todos los errores de la API (validacion, 404, permisos, limite de
    # rafaga, bugs no controlados) llegan al frontend con una sola forma:
    # {"error": {"codigo", "mensaje", "detalles"}}. Ver config/exceptions.py.
    "EXCEPTION_HANDLER": "config.exceptions.manejador_excepciones",
    # Freno tecnico contra abuso real (scripts, no usuarios humanos): las
    # rafagas normales ya se agrupan en una sola respuesta desde n8n (ver
    # el nodo "Evaluar rafaga" en orquestador-chat-alma.json), asi que este
    # limite es solo un ultimo recurso, no el mecanismo de control de UX.
    "DEFAULT_THROTTLE_RATES": {
        "mensajes_chat": "60/min",
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS", default=["http://localhost:3000"]
)

# Almacenamiento de archivos (S3/MinIO). Los binarios nunca se guardan en la base
# de datos, sólo referencias/URLs firmadas (ver apps.memories.models.Archivo).
AWS_ACCESS_KEY_ID = env("S3_ACCESS_KEY", default="reviive")
AWS_SECRET_ACCESS_KEY = env("S3_SECRET_KEY", default="reviive123")
AWS_STORAGE_BUCKET_NAME = env("S3_BUCKET", default="reviive-media")
AWS_S3_ENDPOINT_URL = env("S3_ENDPOINT_URL", default="http://minio:9000")

# Webhooks entrantes de n8n (firmados con HMAC-SHA256, ver apps.agents).
N8N_WEBHOOK_SECRET = env("N8N_WEBHOOK_SECRET", default="dev-webhook-secret")
N8N_BASE_URL = env("N8N_BASE_URL", default="http://n8n:5678")
