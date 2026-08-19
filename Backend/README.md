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

## Levantar en local

```bash
cd api
python -m venv .venv
.venv/Scripts/activate        # Windows
pip install -r requirements.txt
cp .env.example .env           # ajustar credenciales
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Requiere PostgreSQL con la extensión `pgvector` (imagen `pgvector/pgvector:pg16`),
Redis y un bucket S3/MinIO. La forma más simple de tener todo el stack (API +
frontend + Postgres + Redis + MinIO + n8n) es:

```bash
cd infrastructure/docker
docker compose up --build
```

## Estado de la validación

Los modelos de todas las apps fueron validados con
`python manage.py check` y `python manage.py makemigrations` (migraciones
generadas y consistentes). No se aplicaron migraciones contra una instancia
real de PostgreSQL en esta entrega porque el foco de este avance fue el
frontend; el esquema y los endpoints ya están definidos y listos para
conectar.
