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
| `/webhook/reviive/memories/recuerdo-creado` | Web (tras registrar un recuerdo) | Workflow Agente - Recomendación |

Todos los webhooks se firman con HMAC-SHA256 usando `N8N_WEBHOOK_SECRET`
(la misma variable que Django usa para validar las llamadas entrantes a
`agent-runs/*`). Reintentos con backoff: 30s / 2m / 10m. Cada workflow debe
ser idempotente (usar el `run_id` o el id del evento como clave de dedupe).

## Carpeta de trabajo

Esta carpeta se monta como volumen de datos de n8n (`/home/node/.n8n`) cuando
se usa `infrastructure/docker/docker-compose.yml`. Los workflows exportados
viven en `workflows/*.json` y se versionan en git; las credenciales (OpenAI,
firma HMAC) **no** se exportan por valor — sólo quedan referenciadas por
nombre/ID en el JSON y hay que volver a crearlas en cada instancia de n8n
(ver abajo).

## Levantar n8n en local (sin Docker)

Para desarrollo en Windows es más simple correr n8n directo con Node que a
través de Docker (evita la complejidad de red entre contenedores para llegar
al `manage.py runserver` de Django en el host):

```bash
npm install -g n8n
cd Backend/automation/n8n
cp .env.example .env        # completar OPENAI_API_KEY y N8N_WEBHOOK_SECRET
                              # (igual al de Backend/api/.env)

# cargar el .env y arrancar (PowerShell/bash, ajustar según shell)
set -a && source .env && set +a
export N8N_USER_FOLDER="$(pwd)/.data"
export N8N_PORT=5678
n8n start
```

Primer arranque (una sola vez): n8n pide crear una cuenta owner. Se puede
hacer desde el navegador en `http://127.0.0.1:5678`, o sin UI:

```bash
curl -X POST http://127.0.0.1:5678/rest/owner/setup -H "Content-Type: application/json" \
  -d '{"email":"admin@reviive.local","firstName":"Reviive","lastName":"Admin","password":"<una-clave-segura>"}'
```

Luego, desde **Settings → n8n API** en la UI (o vía `/rest/api-keys` con la
cookie de sesión) generar una API key personal y guardarla como
`N8N_API_KEY` en `.env`; con eso ya se puede administrar n8n por API en vez
de por la interfaz visual.

### Credenciales que hay que crear en cada instancia

Ambos workflows (`orquestador-chat-alma.json` y `agente-recomendacion.json`)
referencian las mismas dos credenciales por nombre — hay que crearlas una
vez (vía UI, o por API con `POST /api/v1/credentials`) y volver a
enlazarlas en los nodos si se reimporta el JSON en una instancia nueva:

| Nombre | Tipo | Uso |
|---|---|---|
| `OpenAI Reviive` | `httpHeaderAuth` (header `Authorization: Bearer <OPENAI_API_KEY>`) | Nodo "Llamar a OpenAI" |
| `Reviive HMAC` | `crypto` (campo `hmacSecret` = mismo valor que `N8N_WEBHOOK_SECRET`) | Nodos "Firmar request" / "Firmar complete" |

### Importar y activar un workflow

Repetir por cada archivo en `workflows/` (`orquestador-chat-alma.json`,
`agente-recomendacion.json`):

```bash
curl -X POST http://127.0.0.1:5678/api/v1/workflows \
  -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" \
  --data-binary @workflows/orquestador-chat-alma.json
# copiar el "id" de la respuesta y activarlo:
curl -X POST http://127.0.0.1:5678/api/v1/workflows/<id>/activate -H "X-N8N-API-KEY: $N8N_API_KEY"
```

## Workflow implementado: "Orquestador - Chat con Alma"

Cubre de punta a punta el flujo de chat (agente `acompanamiento`):

1. **Webhook** recibe `{ access_token, conversacion_id, mensaje }` (el
   `access_token` es el JWT del usuario ya autenticado en Django; la
   conversación se crea antes, con una llamada normal del frontend a
   `POST /api/v1/conversations/`).
2. Guarda el mensaje del usuario con `POST /conversations/{id}/messages`
   (usando el JWT del usuario — Django fuerza `rol=usuario`).
3. Firma y llama `POST /agent-runs/request` (HMAC) para registrar el inicio
   de la ejecución del agente.
4. Llama a OpenAI (`gpt-4o-mini`) con la persona de Alma.
5. Firma y llama `POST /agent-runs/{run_id}/complete` (HMAC) con la
   respuesta; Django crea automáticamente el `Mensaje` de Alma en la
   conversación (ver `apps.agents.views.AgentRunCompleteView`) — n8n nunca
   escribe el mensaje directo, sólo reporta el resultado del agente.
6. Responde al webhook con `{ conversacion_id, run_id, reply, estado }`.

Si OpenAI falla (por ejemplo, sin crédito o key inválida), el workflow no se
cae: registra la ejecución como `fallido` con una respuesta de repaldo de
Alma, para que el chat nunca quede colgado.

## Workflow implementado: "Agente - Recomendacion"

Se dispara justo después de que el cliente registra un recuerdo (no es un
agente conversacional, por eso `EjecucionAgente.conversacion` es opcional):

1. **Webhook** recibe `{ access_token, recuerdo_id }`.
2. Lee el recuerdo completo (`GET /memories/{id}/`, con el JWT del cliente)
   y el catálogo real de servicios (`GET /products/`).
3. Firma y llama `POST /agent-runs/request` (agente `recomendacion`, sin
   `conversacion_id`).
4. Llama a OpenAI (`gpt-4o-mini`, `response_format: json_object`) con la
   historia del recuerdo + el catálogo, pidiendo hasta 3 recomendaciones en
   JSON (`{producto_id, titulo, justificacion, puntaje}`). El prompt exige
   que el `producto_id` exista en el catálogo dado y prohíbe confirmar
   precios/tiempos (RN-10).
5. Firma y llama `POST /agent-runs/{run_id}/complete` con
   `structured_data: { recuerdo_id, recomendaciones }`; Django crea las
   filas reales de `Recomendacion` como efecto de ese POST (ver
   `apps.agents.views._crear_recomendaciones`) — de nuevo, n8n nunca
   escribe la tabla de negocio directo.
6. Responde al webhook con `{ recuerdo_id, run_id, estado }`; el frontend
   lee las recomendaciones ya guardadas con
   `GET /recommendations/?recuerdo=<id>`.

**El catálogo (`Producto`) tiene que tener datos reales para que esto
funcione** — si está vacío, OpenAI correctamente no recomienda nada (el
prompt le prohíbe inventar productos). Los 8 servicios base se cargaron una
vez a mano desde `apps.catalog.management.commands.seed_demo.PRODUCTOS`
(sólo esas filas, sin los usuarios/proveedor/pedido de ejemplo que trae ese
comando completo).

Los demás agentes (Extracción, Creativo, Viabilidad, Proveedores,
Cotización, Pedidos, Memorial, Seguridad, Evaluador) se pueden construir
como workflows adicionales siguiendo el mismo patrón: firmar y llamar
`agent-runs/request` → hacer el trabajo (LLM y/o llamadas a los demás
endpoints de la API) → firmar y llamar `agent-runs/{id}/complete`, y decidir
ahí qué efecto de negocio dispara esa finalización (igual que el mensaje de
Alma o las recomendaciones).
