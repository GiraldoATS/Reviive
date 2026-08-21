import uuid

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.quotations.models import Cotizacion

from .models import Pedido
from .serializers import EventoPedidoSerializer, PedidoSerializer

STAFF_ROLES = {"administrador", "superadministrador"}
GESTION_PEDIDO_ROLES = STAFF_ROLES | {"proveedor", "operador_logistico"}


def _generar_codigo() -> str:
    """Código único legible; reintenta ante una colisión (muy improbable)."""
    for _ in range(5):
        codigo = f"RV-{timezone.now().year}-{uuid.uuid4().hex[:8].upper()}"
        if not Pedido.objects.filter(codigo=codigo).exists():
            return codigo
    raise RuntimeError("No se pudo generar un código de pedido único.")


class PedidoViewSet(viewsets.ModelViewSet):
    """/api/v1/orders — RN-04: sin producción sin pedido confirmado."""

    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in STAFF_ROLES:
            return Pedido.objects.all()
        if user.rol == "proveedor":
            return Pedido.objects.filter(cotizacion__proveedor__usuario=user)
        return Pedido.objects.filter(cliente=user)

    def perform_create(self, serializer):
        cotizacion: Cotizacion = serializer.validated_data["cotizacion"]
        user = self.request.user
        es_staff = user.is_staff or user.rol in STAFF_ROLES

        if not es_staff and cotizacion.recuerdo.cliente_id != user.id:
            raise PermissionDenied("Esta cotización no pertenece a tu cuenta.")
        if cotizacion.estado != Cotizacion.Estado.ACEPTADA:
            raise ValidationError(
                {"cotizacion": "Sólo se puede confirmar un pedido a partir de una cotización aceptada (RN-04)."}
            )

        serializer.save(
            cliente=cotizacion.recuerdo.cliente,
            codigo=_generar_codigo(),
            total=cotizacion.total,
        )


class PedidoEventosView(APIView):
    """/api/v1/orders/{id}/events — RN-06: recepción exige evidencia."""

    permission_classes = [IsAuthenticated]

    def _get_pedido(self, request: Request, pedido_id) -> Pedido:
        pedido = get_object_or_404(Pedido, pk=pedido_id)
        user = request.user
        es_staff = user.is_staff or user.rol in STAFF_ROLES
        es_proveedor_asignado = (
            user.rol == "proveedor" and pedido.cotizacion.proveedor.usuario_id == user.id
        )
        if not (es_staff or es_proveedor_asignado or pedido.cliente_id == user.id):
            raise PermissionDenied("No tienes acceso a este pedido.")
        return pedido

    def get(self, request: Request, pedido_id) -> Response:
        pedido = self._get_pedido(request, pedido_id)
        return Response(EventoPedidoSerializer(pedido.eventos.all(), many=True).data)

    def post(self, request: Request, pedido_id) -> Response:
        pedido = self._get_pedido(request, pedido_id)
        user = request.user
        es_staff = user.is_staff or user.rol in STAFF_ROLES
        if not (es_staff or user.rol in GESTION_PEDIDO_ROLES):
            raise PermissionDenied("Sólo el taller o logística pueden registrar eventos del pedido.")

        serializer = EventoPedidoSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(pedido=pedido)
        pedido.estado = serializer.validated_data["estado"]
        pedido.save(update_fields=["estado"])
        return Response(serializer.data, status=status.HTTP_201_CREATED)
