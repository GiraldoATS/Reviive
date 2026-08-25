import logging
from datetime import timedelta
from decimal import Decimal, InvalidOperation

import requests
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import Producto
from apps.conversations.models import Conversacion, Mensaje
from apps.evaluations.models import Evaluacion
from apps.memories.models import ObjetoMemoria, Recuerdo
from apps.providers.models import Proveedor
from apps.quotations.models import Cotizacion
from apps.recommendations.models import Recomendacion

from .models import EjecucionAgente
from .permissions import IsN8nOrchestrator
from .serializers import (
    AgentRunCompleteSerializer,
    AgentRunRequestSerializer,
    EjecucionAgenteSerializer,
)

logger = logging.getLogger(__name__)


class EsSupervisorOAdmin(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return user.is_authenticated and (
            user.is_staff or user.rol in {"supervisor_ia", "administrador", "superadministrador"}
        )


class EjecucionAgenteViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/agent-runs — sólo lectura para supervisión (las escrituras
    siguen siendo exclusivas de n8n vía agent-runs/request y /complete,
    con HMAC). Filtra por ?agente=<codigo>."""

    serializer_class = EjecucionAgenteSerializer
    permission_classes = [EsSupervisorOAdmin]

    def get_queryset(self):
        queryset = EjecucionAgente.objects.order_by("-creado_en")
        agente = self.request.query_params.get("agente")
        if agente:
            queryset = queryset.filter(agente=agente)
        return queryset


class AgentRunRequestView(APIView):
    """POST /api/v1/agent-runs/request — n8n registra el inicio de una ejecución."""

    permission_classes = [IsN8nOrchestrator]

    def post(self, request: Request) -> Response:
        payload = AgentRunRequestSerializer(data=request.data)
        payload.is_valid(raise_exception=True)

        conversacion_id = payload.validated_data.get("conversacion_id")
        conversacion = (
            get_object_or_404(Conversacion, pk=conversacion_id) if conversacion_id else None
        )
        ejecucion = EjecucionAgente.objects.create(
            conversacion=conversacion,
            agente=payload.validated_data["agente"],
            agent_version=payload.validated_data["agent_version"],
        )
        return Response(
            EjecucionAgenteSerializer(ejecucion).data, status=status.HTTP_201_CREATED
        )


def _crear_recomendaciones(ejecucion: EjecucionAgente) -> None:
    """Efecto de agent-runs/complete para el agente `recomendacion`: traduce
    structured_data en filas reales de Recomendacion. Ignora referencias a
    un recuerdo/producto inexistente en vez de tumbar la petición completa,
    ya que es un contrato interno agente->API, no un formulario de usuario.
    """
    data = ejecucion.structured_data or {}
    try:
        recuerdo = Recuerdo.objects.get(pk=data.get("recuerdo_id"))
    except (Recuerdo.DoesNotExist, ValueError, TypeError):
        return

    # Reemplaza cualquier tanda anterior para este recuerdo (reintentos del
    # workflow no deben acumular duplicados). Todo en una transacción para
    # que un fallo a mitad de la tanda no deje al recuerdo sin ninguna
    # recomendación (ni la vieja ni la nueva).
    top_producto_id = None
    with transaction.atomic():
        Recomendacion.objects.filter(recuerdo=recuerdo).delete()

        for item in data.get("recomendaciones", []):
            try:
                producto = Producto.objects.get(pk=item["producto_id"])
            except (Producto.DoesNotExist, KeyError, ValueError, TypeError):
                continue
            # concepto_creativo (agente Creativo) es la narrativa mostrada al
            # cliente; si no viene, se usa justificacion como respaldo.
            justificacion = item.get("concepto_creativo") or item.get("justificacion", "")
            Recomendacion.objects.create(
                recuerdo=recuerdo,
                producto=producto,
                titulo=item.get("titulo", producto.nombre),
                justificacion=justificacion,
                puntaje=item.get("puntaje", 0),
                # Salida del agente Viabilidad para esta misma alternativa.
                advertencias=item.get("advertencias", []),
                requiere_revision_humana=bool(item.get("requiere_revision_humana", False)),
            )
            # El prompt del agente Recomendacion ya pide el ranking ordenado
            # por puntaje descendente; el primero que logra crearse es el
            # mejor candidato real para arrancar el agente Cotizacion.
            if top_producto_id is None:
                top_producto_id = producto.id

    if top_producto_id is not None:
        _disparar_agente_cotizacion(recuerdo, top_producto_id)


def _disparar_agente_cotizacion(recuerdo: Recuerdo, producto_id: int) -> None:
    """Dispara el workflow n8n "Agente - Cotizacion" (ver
    Backend/automation/n8n/workflows/agente-cotizacion.json) para que
    genere borradores reales de cotizacion, con proveedores reales
    (POST /providers/match), sobre el producto mejor recomendado.

    Es una mejora sobre la recomendacion ya creada, no un requisito: si n8n
    no responde o falla, las recomendaciones ya quedaron guardadas igual.
    """
    try:
        perfil = getattr(recuerdo.cliente, "perfil", None)
        access_token = str(RefreshToken.for_user(recuerdo.cliente).access_token)
        requests.post(
            f"{settings.N8N_BASE_URL}/webhook/reviive/recommendations/creadas",
            json={
                "recuerdo_id": str(recuerdo.id),
                "producto_id": producto_id,
                "ciudad": perfil.ciudad if perfil else "",
                "access_token": access_token,
            },
            timeout=20,
        )
    except requests.RequestException:
        logger.exception(
            "No se pudo disparar el agente de cotización para el recuerdo %s", recuerdo.id
        )


def _crear_cotizaciones_desde_agente(ejecucion: EjecucionAgente) -> None:
    """Efecto de agent-runs/complete para el agente `cotizacion`: crea
    cotizaciones reales en estado BORRADOR (RN-10: la IA nunca confirma un
    precio oficial) para que cada proveedor real emparejado la revise,
    ajuste y envíe desde su propio portal — nunca se crean ya "enviadas".
    """
    data = ejecucion.structured_data or {}
    try:
        recuerdo = Recuerdo.objects.get(pk=data.get("recuerdo_id"))
    except (Recuerdo.DoesNotExist, ValueError, TypeError):
        return
    producto = Producto.objects.filter(pk=data.get("producto_id")).first()

    # Se acota al alcance de ESTA ejecucion (no a todo el recuerdo) para no
    # tocar cotizaciones que un proveedor ya haya creado/enviado a mano.
    with transaction.atomic():
        Cotizacion.objects.filter(recuerdo=recuerdo, ejecucion_agente=ejecucion).delete()

        for item in data.get("cotizaciones", []):
            try:
                proveedor = Proveedor.objects.get(
                    pk=item["proveedor_id"], estado_validacion="validado"
                )
                total = Decimal(str(item["total"]))
            except (
                Proveedor.DoesNotExist,
                KeyError,
                ValueError,
                TypeError,
                InvalidOperation,
            ):
                continue

            try:
                dias = int(item.get("vigencia_dias") or 15)
            except (TypeError, ValueError):
                dias = 15
            dias = max(7, min(dias, 30))

            Cotizacion.objects.create(
                recuerdo=recuerdo,
                proveedor=proveedor,
                producto=producto,
                total=total,
                vigencia=timezone.now().date() + timedelta(days=dias),
                estado=Cotizacion.Estado.BORRADOR,
                ejecucion_agente=ejecucion,
            )


def _crear_recuerdo_desde_extraccion(ejecucion: EjecucionAgente) -> None:
    """Efecto de agent-runs/complete para el agente `extraccion`: convierte
    la Ficha de Memoria/Tecnica que devolvio el agente en un Recuerdo real,
    ligado al cliente de la conversacion. RN-01: no se crea nada si el
    cliente no dio su consentimiento de tratamiento de datos.
    """
    if not ejecucion.conversacion_id:
        return
    cliente = ejecucion.conversacion.usuario
    perfil = getattr(cliente, "perfil", None)
    if not perfil or not perfil.consentimiento_datos:
        return

    data = ejecucion.structured_data or {}
    historia = data.get("historia", "")
    if not historia:
        return

    recuerdo = Recuerdo.objects.create(
        cliente=cliente,
        persona_recordada=data.get("persona_recordada", ""),
        historia=historia,
    )
    objeto = data.get("objeto") or {}
    if objeto.get("tipo"):
        ObjetoMemoria.objects.create(
            recuerdo=recuerdo,
            tipo=objeto.get("tipo", ""),
            marca=objeto.get("marca", ""),
            anio_aproximado=objeto.get("anio_aproximado", ""),
            material=objeto.get("material", ""),
            estado=objeto.get("estado", ""),
        )
    # Se guarda el id para que la respuesta de Alma pueda referenciarlo.
    data["recuerdo_id"] = str(recuerdo.id)
    ejecucion.structured_data = data
    ejecucion.save(update_fields=["structured_data"])


def _crear_evaluacion(ejecucion: EjecucionAgente) -> None:
    """Efecto de agent-runs/complete para el agente `evaluador`: registra
    una Evaluacion automatica sobre OTRA ejecucion ya completada.
    """
    data = ejecucion.structured_data or {}
    try:
        ejecucion_evaluada = EjecucionAgente.objects.get(pk=data.get("ejecucion_evaluada"))
    except (EjecucionAgente.DoesNotExist, ValueError, TypeError):
        return

    Evaluacion.objects.create(
        ejecucion=ejecucion_evaluada,
        tipo=Evaluacion.Tipo.AUTOMATICA,
        puntaje=data.get("puntaje", 0),
        requiere_revision=bool(data.get("requiere_revision", False)),
    )


class AgentRunCompleteView(APIView):
    """POST /api/v1/agent-runs/{id}/complete — n8n reporta el resultado final."""

    permission_classes = [IsN8nOrchestrator]

    def post(self, request: Request, run_id) -> Response:
        payload = AgentRunCompleteSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        data = payload.validated_data

        ejecucion = get_object_or_404(EjecucionAgente, pk=run_id)
        ejecucion.estado = data["status"]
        ejecucion.reply = data.get("reply", "")
        ejecucion.structured_data = data.get("structured_data", {})
        ejecucion.tools_used = data.get("tools_used", [])

        metrics = data.get("metrics") or {}
        ejecucion.latencia_ms = metrics.get("latency_ms")
        ejecucion.input_tokens = metrics.get("input_tokens")
        ejecucion.output_tokens = metrics.get("output_tokens")

        evaluation = data.get("evaluation") or {}
        ejecucion.evaluation_score = evaluation.get("score")
        ejecucion.evaluation_flags = evaluation.get("flags", [])

        ejecucion.completado_en = timezone.now()
        ejecucion.save()

        mensajes_ids = data.get("mensajes_ids") or []
        if mensajes_ids and ejecucion.conversacion_id:
            Mensaje.objects.filter(
                conversacion_id=ejecucion.conversacion_id,
                id__in=mensajes_ids,
                rol=Mensaje.Rol.USUARIO,
            ).update(respondido=True)

        # La respuesta de un agente conversacional se convierte en el mensaje
        # de Alma en la conversación; así n8n nunca escribe Mensaje directo,
        # sólo reporta el resultado del agente y Django lo traduce al chat.
        if (
            ejecucion.estado == EjecucionAgente.Estado.COMPLETADO
            and ejecucion.reply
            and ejecucion.conversacion_id
        ):
            Mensaje.objects.create(
                conversacion=ejecucion.conversacion,
                rol=Mensaje.Rol.ALMA,
                contenido=ejecucion.reply,
            )

        if ejecucion.estado == EjecucionAgente.Estado.COMPLETADO:
            if ejecucion.agente == EjecucionAgente.Agente.RECOMENDACION:
                _crear_recomendaciones(ejecucion)
            elif ejecucion.agente == EjecucionAgente.Agente.COTIZACION:
                _crear_cotizaciones_desde_agente(ejecucion)
            elif ejecucion.agente == EjecucionAgente.Agente.EXTRACCION:
                _crear_recuerdo_desde_extraccion(ejecucion)
            elif ejecucion.agente == EjecucionAgente.Agente.EVALUADOR:
                _crear_evaluacion(ejecucion)

        return Response(EjecucionAgenteSerializer(ejecucion).data)
