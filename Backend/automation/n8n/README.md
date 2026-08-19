# Automatización — n8n

n8n es el orquestador de todos los agentes de IA de Reviive (Orquestador,
Acompañamiento, Extracción, Creativo, Viabilidad, Recomendación, Proveedores,
Cotización, Pedidos, Memorial, Seguridad, Evaluador). Corre como servicio
independiente (ver `infrastructure/docker/docker-compose.yml`), con su propia
base de datos (`n8n_db`, separada de `reviive_db`).

Regla de arquitectura: **n8n nunca escribe directo en las tablas de negocio**.
Toda escritura pasa por la API de Django (`/api/v1/...`), en particular por
`POST /api/v1/agent-runs/request` y `POST /api/v1/agent-runs/{id}/complete`.

## Webhooks que expone n8n

n8n recibe los eventos externos y dispara los workflows correspondientes:

| Webhook | Origen | Dispara |
|---|---|---|
| `/webhook/reviive/conversations/message` | Web (chat con Alma) | Workflow Orquestador → Agente correspondiente |
| `/webhook/reviive/telegram/update` | Telegram Bot API | Workflow Orquestador (canal Telegram) |
| `/webhook/reviive/email/inbound` | Correo entrante (IMAP) | Workflow Orquestador (canal correo) |
| `/webhook/reviive/orders/status-changed` | API Django (evento saliente) | Workflow de notificaciones al cliente |

Todos los webhooks se firman con HMAC-SHA256 usando `N8N_WEBHOOK_SECRET`
(la misma variable que Django usa para validar las llamadas entrantes a
`agent-runs/*`). Reintentos con backoff: 30s / 2m / 10m. Cada workflow debe
ser idempotente (usar el `run_id` o el id del evento como clave de dedupe).

## Carpeta de trabajo

Esta carpeta se monta como volumen de datos de n8n (`/home/node/.n8n`).
Los workflows exportados (`.json`) se agregan aquí a medida que se
construyen en el editor visual de n8n; todavía no hay workflows exportados
en esta entrega — el backend ya expone los endpoints que n8n necesita para
integrarse (`agent-runs/request`, `agent-runs/{id}/complete`).
