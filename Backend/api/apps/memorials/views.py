from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MemorialDigital
from .serializers import MemorialDigitalSerializer


class MemorialDigitalViewSet(viewsets.ModelViewSet):
    """/api/v1/memorials — visibilidad pública sólo si visibilidad != privado (RN-13)."""

    serializer_class = MemorialDigitalSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return MemorialDigital.objects.exclude(visibilidad="privado")

        propios = MemorialDigital.objects.filter(recuerdo__cliente=user)
        if self.action in {"update", "partial_update", "destroy"}:
            # Sólo el dueño del recuerdo modifica/borra su memorial, aunque
            # otros memoriales públicos también sean visibles en list/retrieve.
            return propios

        publicos = MemorialDigital.objects.exclude(visibilidad="privado")
        return (publicos | propios).distinct()

    def perform_create(self, serializer):
        user = self.request.user
        recuerdo = serializer.validated_data["recuerdo"]
        es_staff = user.is_staff or user.rol in {"administrador", "superadministrador"}
        if not es_staff and recuerdo.cliente_id != user.id:
            raise PermissionDenied("Sólo puedes crear un memorial para tu propio recuerdo.")
        serializer.save()


class MemorialPublicoPorSlugView(APIView):
    """GET /api/v1/memorials/by-slug/{slug}/ — para el enlace público del
    memorial (RN-13: 404 si es privado y no eres el propietario)."""

    permission_classes = [AllowAny]

    def get(self, request: Request, slug: str) -> Response:
        memorial = get_object_or_404(MemorialDigital, slug=slug)
        user = request.user
        es_propietario = user.is_authenticated and memorial.recuerdo.cliente_id == user.id
        if memorial.visibilidad == MemorialDigital.Visibilidad.PRIVADO and not es_propietario:
            raise Http404
        return Response(MemorialDigitalSerializer(memorial).data)
