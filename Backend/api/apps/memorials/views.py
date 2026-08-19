from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import MemorialDigital
from .serializers import MemorialDigitalSerializer


class MemorialDigitalViewSet(viewsets.ModelViewSet):
    """/api/v1/memorials — visibilidad pública sólo si visibilidad != privado."""

    serializer_class = MemorialDigitalSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return MemorialDigital.objects.filter(recuerdo__cliente=user)
        return MemorialDigital.objects.exclude(visibilidad="privado")
