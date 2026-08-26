import logging
import uuid

import requests
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Recuerdo
from .serializers import RecuerdoSerializer

logger = logging.getLogger(__name__)


def _disparar_agente_recomendacion(recuerdo: Recuerdo) -> None:
    """Dispara el workflow n8n "Agente - Recomendacion" (ver
    Backend/automation/n8n/workflows/agente-recomendacion.json) para que
    genere sugerencias reales de producto sobre este recuerdo.

    Es una mejora sobre la creación del recuerdo, no un requisito: si n8n
    no responde o falla, el recuerdo ya quedó guardado igual — sólo se
    registra el error, nunca se lo propaga al cliente.
    """
    try:
        access_token = str(RefreshToken.for_user(recuerdo.cliente).access_token)
        requests.post(
            f"{settings.N8N_BASE_URL}/webhook/reviive/memories/recuerdo-creado",
            json={"recuerdo_id": str(recuerdo.id), "access_token": access_token},
            timeout=20,
        )
    except requests.RequestException:
        logger.exception(
            "No se pudo disparar el agente de recomendación para el recuerdo %s", recuerdo.id
        )


class RecuerdoViewSet(viewsets.ModelViewSet):
    """/api/v1/memories — CRUD del recuerdo del cliente autenticado."""

    serializer_class = RecuerdoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base = Recuerdo.objects.select_related("cliente__perfil").prefetch_related(
            "objetos", "recomendaciones"
        )
        if user.is_staff or user.rol in {"administrador", "superadministrador"}:
            return base.order_by("-creado_en")
        return base.filter(cliente=user).order_by("-creado_en")

    def perform_create(self, serializer):
        recuerdo = serializer.save()
        _disparar_agente_recomendacion(recuerdo)


class AssetPresignView(APIView):
    """POST /api/v1/assets/presign — genera una URL firmada para subir a S3/MinIO.

    Los binarios nunca se guardan en Postgres; sólo referencias/URLs firmadas.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        content_type = request.data.get("content_type", "application/octet-stream")
        file_name = request.data.get("file_name", str(uuid.uuid4()))
        object_key = f"uploads/{request.user.id}/{uuid.uuid4()}-{file_name}"

        return Response(
            {
                "upload_url": f"{settings.AWS_S3_ENDPOINT_URL}/{settings.AWS_STORAGE_BUCKET_NAME}/{object_key}",
                "object_key": object_key,
                "content_type": content_type,
                "expires_in": 900,
            }
        )
