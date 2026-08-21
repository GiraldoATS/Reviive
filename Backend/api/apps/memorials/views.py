from django.db.models import Q
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly

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
