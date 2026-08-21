from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.catalog.models import Producto
from apps.conversations.models import Conversacion, Mensaje
from apps.memories.models import Recuerdo
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
    # workflow no deben acumular duplicados).
    Recomendacion.objects.filter(recuerdo=recuerdo).delete()

    for item in data.get("recomendaciones", []):
        try:
            producto = Producto.objects.get(pk=item["producto_id"])
        except (Producto.DoesNotExist, KeyError, ValueError, TypeError):
            continue
        Recomendacion.objects.create(
            recuerdo=recuerdo,
            producto=producto,
            titulo=item.get("titulo", producto.nombre),
            justificacion=item.get("justificacion", ""),
            puntaje=item.get("puntaje", 0),
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

        if (
            ejecucion.estado == EjecucionAgente.Estado.COMPLETADO
            and ejecucion.agente == EjecucionAgente.Agente.RECOMENDACION
        ):
            _crear_recomendaciones(ejecucion)

        return Response(EjecucionAgenteSerializer(ejecucion).data)
