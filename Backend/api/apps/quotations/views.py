from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission, IsAuthenticated

from .models import Cotizacion
from .serializers import CotizacionSerializer

STAFF_ROLES = {"administrador", "superadministrador"}
CREADOR_ROLES = STAFF_ROLES | {"proveedor", "curador"}


class PuedeCrearCotizacion(BasePermission):
    """Sólo proveedor/curador/staff cotizan (RN-04: la cotización la emite el taller)."""

    def has_permission(self, request, view) -> bool:
        if request.method != "POST":
            return True
        return request.user.is_authenticated and (
            request.user.is_staff or request.user.rol in CREADOR_ROLES
        )


class CotizacionViewSet(viewsets.ModelViewSet):
    """/api/v1/quotations"""

    serializer_class = CotizacionSerializer
    permission_classes = [IsAuthenticated, PuedeCrearCotizacion]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in STAFF_ROLES:
            return Cotizacion.objects.all()
        if user.rol == "proveedor":
            return Cotizacion.objects.filter(proveedor__usuario=user)
        return Cotizacion.objects.filter(recuerdo__cliente=user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.rol == "proveedor":
            proveedor = getattr(user, "proveedor", None)
            if proveedor is None or proveedor.pk != serializer.validated_data["proveedor"].pk:
                raise PermissionDenied("Un proveedor sólo puede cotizar en nombre de su propio taller.")
        serializer.save()
