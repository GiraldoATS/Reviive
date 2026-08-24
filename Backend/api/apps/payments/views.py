from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Pago
from .serializers import PagoSerializer

STAFF_ROLES = {"administrador", "superadministrador"}


class EsStaffOMarcaPagos(BasePermission):
    def has_permission(self, request, view) -> bool:
        if view.action != "marcar_pagado":
            return True
        user = request.user
        return user.is_authenticated and (user.is_staff or user.rol in STAFF_ROLES)


class PagoViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/payments — el admin ve todos, el proveedor sólo los suyos."""

    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated, EsStaffOMarcaPagos]

    def get_queryset(self):
        user = self.request.user
        base = Pago.objects.select_related("pedido", "pedido__cotizacion__proveedor")
        if user.is_staff or user.rol in STAFF_ROLES:
            return base.order_by("-creado_en")
        if user.rol == "proveedor":
            return base.filter(pedido__cotizacion__proveedor__usuario=user).order_by("-creado_en")
        return Pago.objects.none()

    @action(detail=True, methods=["post"], url_path="marcar-pagado")
    def marcar_pagado(self, request: Request, pk=None) -> Response:
        pago = self.get_object()
        pago.estado = Pago.Estado.PAGADO
        pago.fecha_pago = timezone.now()
        pago.save(update_fields=["estado", "fecha_pago"])
        return Response(PagoSerializer(pago).data)
