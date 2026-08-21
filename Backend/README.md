# Reviive — Backend

Monolito modular en Django + Django REST Framework. Es la única fuente de
verdad de las reglas de negocio; el orquestador de agentes de IA (n8n) llama
a esta API y nunca escribe directo en la base de datos de negocio.

## Estructura

```
api/                    Proyecto Django
  config/               settings, urls, wsgi/asgi
  apps/
    identity/            Usuarios, roles, perfiles, auth (JWT)
    memories/            Recuerdos, objetos de memoria, archivos (assets/presign)
    catalog/             Catálogo de servicios (con embeddings pgvector)
    providers/           Proveedores/talleres y matching
    conversations/       Conversaciones y mensajes (web/telegram/correo)
    agents/              Registro de ejecuciones de agentes de IA (n8n)
    recommendations/     Recomendaciones por recuerdo
    quotations/          Cotizaciones
    orders/              Pedidos y su línea de tiempo de eventos
    memorials/            Memoriales digitales
    evaluations/         Evaluación de agentes + dataset de mejora continua
    analytics/           Dashboard administrativo
automation/n8n/          Workflows y webhooks del orquestador de IA
contracts/openapi/       Contrato de la API (openapi.yaml)
infrastructure/docker/   docker-compose y nginx
ml/                       Modelo de ML del entregable académico (pendiente)
```

## Base de datos: MySQL + MySQL Workbench

El backend usa MySQL como única fuente de datos (sin datos quemados en el
código: todo lo que expone la API viene de consultas reales a estas tablas).

1. Instalar MySQL Server localmente (o usar el contenedor de
   `infrastructure/docker`) y abrir MySQL Workbench.
2. Crear el esquema con una conexión nueva en Workbench, o por SQL:
   ```sql
   CREATE DATABASE reviive_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Copiar `api/.env.example` a `api/.env` y ajustar `MYSQL_USER`,
   `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT` con las credenciales del
   servidor MySQL usado en Workbench.

## Levantar en local

```bash
cd api
python -m venv .venv
.venv/Scripts/activate        # Windows
pip install -r requirements.txt
cp .env.example .env           # ajustar credenciales de MySQL
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Tras el `migrate`, las tablas quedan visibles en MySQL Workbench dentro del
esquema `reviive_db` (Schemas > reviive_db > Tables). También requiere Redis
y un bucket S3/MinIO para las funciones de caché y archivos. La forma más
simple de tener todo el stack (API + frontend + MySQL + Redis + MinIO + n8n)
es:

```bash
cd infrastructure/docker
docker compose up --build
```

## Estado de la validación

Los modelos de todas las apps fueron validados con `python manage.py check`
y `python manage.py makemigrations` (migraciones generadas y consistentes).
El esquema y los endpoints están definidos y aplicados contra MySQL mediante
`migrate`; no se usan fixtures ni datos hardcodeados en las vistas — el único
dato de ejemplo es el comando opcional de abajo, pensado sólo para poblar un
entorno de desarrollo/demo, nunca para producción.

### Datos de demostración (opcional)

```bash
python manage.py seed_demo
```

Crea un catálogo, un proveedor, un cliente y un pedido de ejemplo en la base
MySQL configurada. No se ejecuta automáticamente ni afecta a producción.
