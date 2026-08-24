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

from .models import MensajePedido, Pedido, Resena
from .serializers import (
    EventoPedidoSerializer,
    MensajePedidoSerializer,
    PedidoSerializer,
    ResenaSerializer,
)

STAFF_ROLES = {"administrador", "superadministrador"}
GESTION_PEDIDO_ROLES = STAFF_ROLES | {"proveedor", "operador_logistico"}


def _crear_pago_pendiente(pedido: Pedido) -> None:
    """Al confirmarse un pedido, se registra la liquidación pendiente al
    proveedor (comisión estándar de Reviive), en vez de dejar los ingresos
    del proveedor sin ningún dato real detrás."""
    from datetime import timedelta

    from apps.payments.models import COMISION_REVIIVE_PCT, Pago

    if Pago.objects.filter(pedido=pedido).exists():
        return
    comision = (pedido.total * COMISION_REVIIVE_PCT) / 100
    Pago.objects.create(
        pedido=pedido,
        monto_bruto=pedido.total,
        comision_pct=COMISION_REVIIVE_PCT,
        monto_neto=pedido.total - comision,
        fecha_estimada=timezone.now().date() + timedelta(days=15),
    )


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

        pedido = serializer.save(
            cliente=cotizacion.recuerdo.cliente,
            codigo=_generar_codigo(),
            total=cotizacion.total,
        )
        _crear_pago_pendiente(pedido)


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


class PedidoResenaView(APIView):
    """POST /api/v1/orders/{id}/review — RN-15: sólo el cliente dueño y
    sólo si el pedido ya fue entregado puede calificar."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, pedido_id) -> Response:
        pedido = get_object_or_404(Pedido, pk=pedido_id)
        if pedido.cliente_id != request.user.id:
            raise PermissionDenied("Sólo el cliente del pedido puede calificarlo.")
        if pedido.estado != Pedido.Estado.ENTREGADO:
            raise ValidationError({"pedido": "Sólo se puede calificar un pedido ya entregado (RN-15)."})
        if Resena.objects.filter(pedido=pedido).exists():
            raise ValidationError({"pedido": "Este pedido ya fue calificado."})

        serializer = ResenaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(pedido=pedido)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PedidoMensajesView(APIView):
    """/api/v1/orders/{id}/messages — mensajería real cliente↔proveedor
    ligada al pedido (no confundir con el chat de Alma)."""

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
        return Response(MensajePedidoSerializer(pedido.mensajes.all(), many=True).data)

    def post(self, request: Request, pedido_id) -> Response:
        pedido = self._get_pedido(request, pedido_id)
        serializer = MensajePedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(pedido=pedido, autor=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MensajePedidoNoLeidosView(APIView):
    """GET /api/v1/orders/messages/unread-count — total de pedidos con
    mensajes de la otra parte que el usuario aún no ha visto, para el
    badge de notificaciones del portal (sin inventar un número fijo)."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = request.user
        es_staff = user.is_staff or user.rol in STAFF_ROLES
        if es_staff:
            pedidos = Pedido.objects.all()
        elif user.rol == "proveedor":
            pedidos = Pedido.objects.filter(cotizacion__proveedor__usuario=user)
        else:
            pedidos = Pedido.objects.filter(cliente=user)

        total = 0
        for pedido in pedidos.prefetch_related("mensajes"):
            ultimo = pedido.mensajes.last()
            if ultimo and ultimo.autor_id != user.id:
                total += 1
        return Response({"pedidos_con_mensajes_nuevos": total})
