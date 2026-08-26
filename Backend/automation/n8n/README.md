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
| `/webhook/reviive/memories/recuerdo-creado` | Web (tras registrar un recuerdo) | Workflow Agente - Recomendación (+ Creativo + Viabilidad) |
| `/webhook/reviive/recommendations/creadas` | API Django (tras crear las recomendaciones de un recuerdo) | Workflow Agente - Cotización (+ Proveedores, matching real) |
| `/webhook/reviive/memorials/memorial-creado` | Web (tras crear un memorial digital) | Workflow Agente - Memorial |

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

Los 3 workflows (`orquestador-chat-alma.json`, `agente-recomendacion.json`,
`agente-memorial.json`) referencian las mismas dos credenciales por
nombre — hay que crearlas una vez (vía UI, o por API con
`POST /api/v1/credentials`) y volver a enlazarlas en los nodos si se
reimporta el JSON en una instancia nueva:

| Nombre | Tipo | Uso |
|---|---|---|
| `OpenAI Reviive` | `httpHeaderAuth` (header `Authorization: Bearer <OPENAI_API_KEY>`) | Nodo "Llamar a OpenAI" |
| `Reviive HMAC` | `crypto` (campo `hmacSecret` = mismo valor que `N8N_WEBHOOK_SECRET`) | Nodos "Firmar request" / "Firmar complete" |

### Importar y activar un workflow

Repetir por cada archivo en `workflows/`:

```bash
curl -X POST http://127.0.0.1:5678/api/v1/workflows \
  -H "X-N8N-API-KEY: $N8N_API_KEY" -H "Content-Type: application/json" \
  --data-binary @workflows/orquestador-chat-alma.json
# copiar el "id" de la respuesta y activarlo:
curl -X POST http://127.0.0.1:5678/api/v1/workflows/<id>/activate -H "X-N8N-API-KEY: $N8N_API_KEY"
```

## Los 12 agentes: dónde vive cada uno

Los 12 agentes de la sección 11.1 de `Reviive_Documento_Arquitectura_y_Diseno_Tecnico_v1`
y la sección 12 de `Reviive_Documento_Definicion_Estrategica_y_Funcional_v1`
están todos implementados, repartidos en 4 workflows:

| Agente | Workflow | Cómo |
|---|---|---|
| Orquestador | Chat con Alma | clasifica riesgo + intención antes de responder |
| Acompañamiento | Chat con Alma | rama por defecto de la intención |
| Seguridad | Chat con Alma | riesgo alto → respuesta fija + escalamiento, sin llamar al LLM creativo |
| Pedidos (Seguimiento) | Chat con Alma | rama `pedidos`, con `GET /orders/` real como contexto |
| Proveedores | Chat con Alma **+** Agente - Cotizacion | en el chat, rama `proveedores` con `GET /providers/` como contexto conversacional; en el agente automático, matching real vía `POST /providers/match` (filtra por producto+ciudad) |
| Cotización | Chat con Alma **+** Agente - Cotizacion | en el chat, rama `cotizacion`: si el cliente ya tiene cotizaciones reales (`GET /quotations/`, incluidas las que dejó en borrador el agente automático), Alma las cita concretas (taller, valor, estado); si no hay ninguna, da una estimación conversacional sobre `precio_base`. El agente automático (dispara solo tras crearse una recomendación) es quien realmente las crea, en estado `borrador`, listas para que el proveedor emparejado las revise y envíe desde su portal (RN-10: nunca queda como oficial sin que el taller la confirme) |
| Extracción | Chat con Alma | rama `extraccion`: convierte la conversación en un `Recuerdo` + `ObjetoMemoria` reales |
| Evaluador | Chat con Alma | corre después de responder (no le agrega espera al usuario), califica la respuesta y crea una `Evaluacion` |
| Recomendación | Agente - Recomendacion | rankea hasta 3 productos reales del catálogo |
| Creativo | Agente - Recomendacion | mismo paso, aporta el `concepto_creativo` de cada recomendación |
| Viabilidad | Agente - Recomendacion | mismo paso, aporta `advertencias` / `requiere_revision_humana` (RN-03) |
| Memorial | Agente - Memorial | redacta la biografía del memorial y la guarda con el token del propio cliente |

### Agente - Cotizacion (automático, no conversacional)

1. Se dispara desde Django (`_disparar_agente_cotizacion` en
   `apps/agents/views.py`) justo después de que el agente Recomendación
   crea sus filas reales, usando el producto mejor rankeado. Si n8n no
   responde, las recomendaciones ya quedaron guardadas igual — no bloquea
   nada para el cliente.
2. **Webhook** recibe `{ recuerdo_id, producto_id, ciudad, access_token }`.
3. Trae el `Recuerdo` real (con Bearer del propio cliente) y el `Producto`
   real (`precio_base` como ancla).
4. Firma y llama `POST /providers/match` (matching real por producto+ciudad,
   sólo proveedores validados) — si falla, sigue con lista vacía.
5. Firma y llama `POST /agent-runs/request` (`agente=cotizacion`).
6. Con la historia, el producto y los proveedores reales como contexto,
   pide a OpenAI hasta 3 borradores de cotización (uno por proveedor
   emparejado), cada uno con `total`, `vigencia_dias` y `notas` (desglose
   aproximado) — nunca inventa un proveedor que no esté en la lista.
7. Firma y llama `POST /agent-runs/{run_id}/complete`; Django crea las
   filas reales de `Cotizacion` en estado `borrador`, cada una ligada a la
   ejecución del agente para poder auditar su origen
   (`Cotizacion.ejecucion_agente`).
8. El proveedor las ve en `/proveedor/cotizaciones` (ya filtra por
   `borrador`/`enviada`/etc.) y decide si las ajusta y envía — la IA nunca
   confirma un precio oficial por su cuenta (RN-10).

### Chat con Alma (Orquestador + 7 agentes)

1. **Webhook** recibe `{ access_token, conversacion_id, mensaje }` (el
   frontend ya creó la conversación con `POST /api/v1/conversations/`).
2. Guarda el mensaje del usuario (`POST /conversations/{id}/messages`,
   Django fuerza `rol=usuario`).
3. **Clasifica** con OpenAI (`response_format: json_object`):
   `riesgo` (bajo/medio/alto) e `intencion`
   (`acompanamiento` / `pedidos` / `proveedores` / `cotizacion` / `extraccion`).
4. Trae siempre contexto real: `GET /orders/`, `GET /providers/`,
   `GET /products/`, `GET /quotations/` (las cotizaciones reales del
   propio cliente, incluidas las que el agente Cotizacion dejó en
   borrador) — así el modelo sólo puede citar pedidos, proveedores,
   precios y cotizaciones reales, nunca inventados (RN-10).
5. Firma y llama `POST /agent-runs/request` con `agente` = la intención
   detectada (o `seguridad` si el riesgo es alto).
6. **Riesgo alto** → mensaje fijo de contención (línea de ayuda 192) +
   `evaluation.flags: ["riesgo_emocional"]`, sin gastar una llamada
   creativa (RN-14, control "no sustituir atención profesional").
7. **`extraccion`** → el LLM responde en JSON `{reply, persona_recordada,
   historia, objeto}`; si hay suficiente historia, Django crea el
   `Recuerdo`/`ObjetoMemoria` real al completar (RN-01: sólo si el cliente
   dio consentimiento).
8. **Cualquier otra intención** → respuesta de texto normal de Alma, con
   el contexto real inyectado.
9. Firma y llama `POST /agent-runs/{run_id}/complete`; Django crea el
   `Mensaje` de Alma (o el `Recuerdo`, si era `extraccion`).
10. Responde al webhook con `{ conversacion_id, run_id, reply, estado }`.
11. **Después de responder** (no bloquea al usuario): el agente Evaluador
    califica esa misma respuesta con otro llamado a OpenAI y crea una
    `Evaluacion` automática (`puntaje`, `requiere_revision`) sobre la
    ejecución que se acaba de completar.

Si OpenAI falla, el workflow no se cae: registra la ejecución como
`fallido` con una respuesta de respaldo de Alma.

### Agente - Recomendacion (Recomendación + Creativo + Viabilidad)

Se dispara justo después de registrar un recuerdo
(`EjecucionAgente.conversacion` es opcional para esto):

1. Lee el recuerdo (`GET /memories/{id}/`) y el catálogo real
   (`GET /products/`).
2. Un solo llamado a OpenAI en JSON produce, por cada producto sugerido:
   `titulo`, `concepto_creativo` (Creativo), `puntaje` (Recomendación) y
   `advertencias` / `requiere_revision_humana` (Viabilidad — se marca
   `true` si la transformación implica cortar/desarmar material, por
   RN-03, o si el estado descrito sugiere que hace falta inspección
   presencial).
3. Firma y llama `agent-runs/complete`; Django crea las filas reales de
   `Recomendacion` con los 3 agentes fusionados en una sola tabla (ver
   `apps.agents.views._crear_recomendaciones`).

Se auditan como un solo `EjecucionAgente` (`agente=recomendacion`) en vez
de tres separados — decisión deliberada para no triplicar llamadas a
OpenAI por cada recuerdo; la trazabilidad de fondo (qué se generó, con
qué modelo, con qué costo) queda igual de completa.

**El catálogo (`Producto`) tiene que tener datos reales para que esto
funcione** — si está vacío, OpenAI correctamente no recomienda nada. Los
8 servicios base se cargaron una vez a mano desde
`apps.catalog.management.commands.seed_demo.PRODUCTOS` (sólo esas filas,
sin los usuarios/proveedor/pedido de ejemplo que trae ese comando
completo).

### Agente - Memorial

Se dispara tras crear un memorial digital (`POST /memorials/` desde el
frontend, luego este webhook):

1. Lee el memorial (`GET /memorials/{id}/`) y su recuerdo asociado
   (`GET /memories/{id}/`).
2. Le pide a OpenAI una biografía cálida (2-3 párrafos) sobre la persona
   recordada — nunca simulando ser ella (control de la sección 12.2:
   "no afirmar que puede revivir o simular a la persona fallecida"), sin
   inventar datos que no estén en la historia (RN-02).
3. **Guarda el resultado con `PATCH /memorials/{id}/` usando el propio
   JWT del cliente** (no un endpoint interno firmado con HMAC): el
   cliente ya es dueño de ese memorial, así que el agente sólo automatiza
   un campo que el usuario podría editar el mismo. Sigue siendo Django
   quien valida el permiso, n8n no escribe la tabla directo.
4. Registra `agent-runs/request` + `/complete` para trazabilidad, con
   `structured_data: { memorial_id, biografia }`.
