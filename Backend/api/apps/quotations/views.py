from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import BasePermission, IsAuthenticated

from .models import Cotizacion
from .serializers import CotizacionSerializer

STAFF_ROLES = {"administrador", "superadministrador"}
CREADOR_ROLES = STAFF_ROLES | {"proveedor", "curador"}

# Quién puede mover una cotización de un estado a otro (RN-04: la emite el
# taller; sólo el cliente dueño decide aceptarla o rechazarla, nunca el
# propio taller). Cualquier transición no listada aquí queda prohibida.
TRANSICIONES_PERMITIDAS = {
    (Cotizacion.Estado.BORRADOR, Cotizacion.Estado.ENVIADA): {"proveedor", "staff"},
    (Cotizacion.Estado.ENVIADA, Cotizacion.Estado.ACEPTADA): {"cliente", "staff"},
    (Cotizacion.Estado.ENVIADA, Cotizacion.Estado.RECHAZADA): {"cliente", "staff"},
}


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
        # El cliente no ve borradores: son propuestas internas del agente o
        # del taller que todavía no fueron revisadas ni enviadas.
        return Cotizacion.objects.filter(recuerdo__cliente=user).exclude(
            estado=Cotizacion.Estado.BORRADOR
        )

    def perform_create(self, serializer):
        user = self.request.user
        if user.rol == "proveedor":
            proveedor = getattr(user, "proveedor", None)
            if proveedor is None or proveedor.pk != serializer.validated_data["proveedor"].pk:
                raise PermissionDenied("Un proveedor sólo puede cotizar en nombre de su propio taller.")
        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        instancia: Cotizacion = self.get_object()
        es_staff = user.is_staff or user.rol in STAFF_ROLES

        nuevo_estado = serializer.validated_data.get("estado")
        if nuevo_estado and nuevo_estado != instancia.estado:
            roles_permitidos = TRANSICIONES_PERMITIDAS.get((instancia.estado, nuevo_estado))
            if roles_permitidos is None:
                raise ValidationError(
                    {"estado": f"No se puede pasar de '{instancia.estado}' a '{nuevo_estado}'."}
                )
            rol_actor = (
                "staff" if es_staff
                else "cliente" if instancia.recuerdo.cliente_id == user.id
                else "proveedor" if user.rol == "proveedor" and instancia.proveedor.usuario_id == user.id
                else None
            )
            if rol_actor not in roles_permitidos:
                raise PermissionDenied(
                    f"No tienes permiso para cambiar esta cotización de '{instancia.estado}' a '{nuevo_estado}'."
                )

        campos_de_precio_tocados = {"total", "vigencia"} & set(serializer.validated_data)
        if campos_de_precio_tocados and not es_staff and instancia.estado != Cotizacion.Estado.BORRADOR:
            raise PermissionDenied("Sólo se puede ajustar el valor mientras la cotización está en borrador.")

        serializer.save()
