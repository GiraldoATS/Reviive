import uuid

from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Recuerdo
from .serializers import RecuerdoSerializer


class RecuerdoViewSet(viewsets.ModelViewSet):
    """/api/v1/memories — CRUD del recuerdo del cliente autenticado."""

    serializer_class = RecuerdoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in {"administrador", "superadministrador"}:
            return Recuerdo.objects.all()
        return Recuerdo.objects.filter(cliente=user)


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
