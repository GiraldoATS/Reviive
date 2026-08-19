from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Cotizacion
from .serializers import CotizacionSerializer


class CotizacionViewSet(viewsets.ModelViewSet):
    """/api/v1/quotations"""

    serializer_class = CotizacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in {"administrador", "superadministrador"}:
            return Cotizacion.objects.all()
        if user.rol == "proveedor":
            return Cotizacion.objects.filter(proveedor__usuario=user)
        return Cotizacion.objects.filter(recuerdo__cliente=user)
