from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Producto
from apps.conversations.models import Conversacion, Mensaje
from apps.evaluations.models import Evaluacion
from apps.memories.models import ObjetoMemoria, Recuerdo
from apps.recommendations.models import Recomendacion

from .models import EjecucionAgente
from .permissions import IsN8nOrchestrator
from .serializers import (
    AgentRunCompleteSerializer,
    AgentRunRequestSerializer,
    EjecucionAgenteSerializer,
)


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
            elif ejecucion.agente == EjecucionAgente.Agente.EXTRACCION:
                _crear_recuerdo_desde_extraccion(ejecucion)
            elif ejecucion.agente == EjecucionAgente.Agente.EVALUADOR:
                _crear_evaluacion(ejecucion)

        return Response(EjecucionAgenteSerializer(ejecucion).data)
