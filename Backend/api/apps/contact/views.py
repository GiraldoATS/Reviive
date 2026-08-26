from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import MensajeContacto
from .serializers import MensajeContactoSerializer


class MensajeContactoCreateView(generics.CreateAPIView):
    """POST /api/v1/contacto/mensajes — cualquier visitante puede escribir."""

    queryset = MensajeContacto.objects.all()
    serializer_class = MensajeContactoSerializer
    permission_classes = [AllowAny]
