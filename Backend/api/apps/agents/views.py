from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.conversations.models import Conversacion

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

        conversacion = get_object_or_404(
            Conversacion, pk=payload.validated_data["conversacion_id"]
        )
        ejecucion = EjecucionAgente.objects.create(
            conversacion=conversacion,
            agente=payload.validated_data["agente"],
            agent_version=payload.validated_data["agent_version"],
        )
        return Response(
            EjecucionAgenteSerializer(ejecucion).data, status=status.HTTP_201_CREATED
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

        return Response(EjecucionAgenteSerializer(ejecucion).data)
