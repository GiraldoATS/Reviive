import uuid

from datetime import timedelta

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.quotations.models import Cotizacion

from .models import Envio, MensajePedido, Pedido, Reclamacion, Resena
from .serializers import (
    EnvioSerializer,
    EventoPedidoSerializer,
    MensajePedidoSerializer,
    PedidoSerializer,
    ReclamacionSerializer,
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


def crear_pedido_desde_cotizacion(cotizacion: Cotizacion) -> Pedido:
    """Único punto real donde nace un Pedido (RN-04). Lo usan tanto
    PedidoViewSet.perform_create (flujo directo/staff) como la
    confirmación real de pago de Mercado Pago (apps.payments) — nunca se
    crea un pedido sin que la cotización ya esté aceptada."""
    pedido, creado = Pedido.objects.get_or_create(
        cotizacion=cotizacion,
        defaults={
            "cliente": cotizacion.recuerdo.cliente,
            "codigo": _generar_codigo(),
            "total": cotizacion.total,
        },
    )
    if creado:
        _crear_pago_pendiente(pedido)
    return pedido


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

        pedido = crear_pedido_desde_cotizacion(cotizacion)
        serializer.instance = pedido


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

        if pedido.estado == Pedido.Estado.EN_CAMINO:
            Envio.objects.get_or_create(
                pedido=pedido,
                defaults={"fecha_estimada": timezone.now().date() + timedelta(days=5)},
            )

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


class EsStaffOperativo(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return user.is_authenticated and (user.is_staff or user.rol in STAFF_ROLES | {"operador_logistico"})


class EnvioViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """/api/v1/shipments — panel de logística. Los envíos se crean solos
    cuando un pedido pasa a 'en_camino' (ver PedidoEventosView)."""

    serializer_class = EnvioSerializer
    permission_classes = [EsStaffOperativo]
    queryset = Envio.objects.select_related("pedido__cliente__perfil").order_by("-creado_en")


class ReclamacionViewSet(viewsets.ModelViewSet):
    """/api/v1/claims — el cliente crea/ve las suyas, staff ve y gestiona todas."""

    serializer_class = ReclamacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in STAFF_ROLES:
            return Reclamacion.objects.select_related("cliente__perfil", "pedido").order_by("-creado_en")
        return Reclamacion.objects.filter(cliente=user).order_by("-creado_en")

    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user)

    def perform_update(self, serializer):
        user = self.request.user
        if not (user.is_staff or user.rol in STAFF_ROLES):
            # El cliente no puede cambiar estado/prioridad/respuesta de staff, sólo
            # el staff gestiona el ciclo de vida de una reclamación ya creada.
            campos_prohibidos = {"estado", "prioridad", "respuesta_staff"} & set(serializer.validated_data)
            if campos_prohibidos:
                raise PermissionDenied("Sólo el equipo de Reviive puede actualizar el estado de una reclamación.")
        serializer.save()
