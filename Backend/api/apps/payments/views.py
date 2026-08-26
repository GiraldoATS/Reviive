import logging
import uuid

import mercadopago
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.quotations.models import Cotizacion

from .models import Pago, PagoCliente
from .serializers import PagoClienteSerializer, PagoSerializer

STAFF_ROLES = {"administrador", "superadministrador"}
logger = logging.getLogger(__name__)


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


def _sdk() -> mercadopago.SDK:
    if not settings.MERCADOPAGO_ACCESS_TOKEN:
        raise ValidationError(
            {"detail": "El cobro real todavía no está configurado (falta MERCADOPAGO_ACCESS_TOKEN)."}
        )
    return mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)


class IniciarPagoMercadoPagoView(APIView):
    """POST /api/v1/payments/mercadopago/iniciar/{cotizacion_id} — el
    cliente ya aceptó la cotización (PATCH estado=aceptada); esto abre el
    cobro real. El pedido todavía NO nace aquí (nace sólo cuando el pago
    se confirma de verdad, ver _procesar_pago_mercadopago)."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, cotizacion_id) -> Response:
        cotizacion = get_object_or_404(Cotizacion, pk=cotizacion_id)
        if cotizacion.recuerdo.cliente_id != request.user.id:
            raise PermissionDenied("Esta cotización no pertenece a tu cuenta.")
        if cotizacion.estado != Cotizacion.Estado.ACEPTADA:
            raise ValidationError(
                {"cotizacion": "Sólo se puede pagar una cotización ya aceptada."}
            )
        pago_existente = getattr(cotizacion, "pago_cliente", None)
        if pago_existente and pago_existente.estado == PagoCliente.Estado.APROBADO:
            raise ValidationError({"cotizacion": "Esta cotización ya fue pagada."})

        if settings.PAGOS_SIMULADOS:
            PagoCliente.objects.update_or_create(
                cotizacion=cotizacion,
                defaults={"preference_id": f"SIMULADO-{uuid.uuid4().hex}", "monto": cotizacion.total},
            )
            return Response({"simulado": True})

        frontend_url = settings.FRONTEND_URL.rstrip("/")
        preference_data = {
            "items": [
                {
                    "title": (cotizacion.producto.nombre if cotizacion.producto else "Servicio Reviive")[:250],
                    "quantity": 1,
                    "unit_price": float(cotizacion.total),
                    "currency_id": "COP",
                }
            ],
            "external_reference": str(cotizacion.id),
            "back_urls": {
                "success": f"{frontend_url}/mis-cotizaciones?pago=exito",
                "failure": f"{frontend_url}/mis-cotizaciones?pago=fallido",
                "pending": f"{frontend_url}/mis-cotizaciones?pago=pendiente",
            },
        }
        # auto_return exige que success sea una URL pública real; en
        # localhost Mercado Pago la rechaza (invalid_auto_return), así que
        # sólo se activa fuera de desarrollo local.
        if "localhost" not in frontend_url and "127.0.0.1" not in frontend_url:
            preference_data["auto_return"] = "approved"
        respuesta = _sdk().preference().create(preference_data)
        if respuesta.get("status") not in (200, 201):
            logger.error("Mercado Pago rechazó la preferencia: %s", respuesta)
            raise ValidationError({"detail": "No se pudo iniciar el pago con Mercado Pago."})

        preferencia = respuesta["response"]
        pago_cliente, _ = PagoCliente.objects.update_or_create(
            cotizacion=cotizacion,
            defaults={"preference_id": preferencia["id"], "monto": cotizacion.total},
        )
        return Response(
            {
                "preference_id": preferencia["id"],
                "checkout_url": preferencia.get("sandbox_init_point") or preferencia["init_point"],
            }
        )


def _procesar_pago_mercadopago(payment_id: str) -> PagoCliente | None:
    """Único lugar que decide si un pago quedó aprobado: siempre se
    confirma contra la API real de Mercado Pago con nuestro access token,
    nunca contra lo que diga la URL de retorno del navegador ni el cuerpo
    del webhook (RN-10 aplicado a dinero real)."""
    from apps.orders.views import crear_pedido_desde_cotizacion

    respuesta = _sdk().payment().get(payment_id)
    if respuesta.get("status") != 200:
        logger.warning("No se pudo consultar el pago %s en Mercado Pago: %s", payment_id, respuesta)
        return None

    pago_mp = respuesta["response"]
    cotizacion_id = pago_mp.get("external_reference")
    estado_mp = pago_mp.get("status")  # approved | pending | rejected | ...
    if not cotizacion_id:
        return None

    try:
        cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    except (Cotizacion.DoesNotExist, ValueError):
        return None

    pago_cliente, _ = PagoCliente.objects.get_or_create(
        cotizacion=cotizacion, defaults={"preference_id": pago_mp.get("preference_id", ""), "monto": cotizacion.total}
    )
    pago_cliente.payment_id = str(payment_id)

    if estado_mp == "approved":
        pago_cliente.estado = PagoCliente.Estado.APROBADO
        pago_cliente.pagado_en = pago_cliente.pagado_en or timezone.now()
        pago_cliente.save(update_fields=["payment_id", "estado", "pagado_en"])
        crear_pedido_desde_cotizacion(cotizacion)
    elif estado_mp == "rejected":
        pago_cliente.estado = PagoCliente.Estado.RECHAZADO
        pago_cliente.save(update_fields=["payment_id", "estado"])
    else:
        pago_cliente.save(update_fields=["payment_id"])

    return pago_cliente


class ConfirmarRetornoPagoView(APIView):
    """GET /api/v1/payments/mercadopago/confirmar — el frontend la llama
    apenas Mercado Pago redirige de vuelta, para saber ya mismo si el
    pago quedó aprobado (sin esperar al webhook)."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        payment_id = request.query_params.get("payment_id") or request.query_params.get("collection_id")
        if not payment_id:
            return Response({"detail": "Falta payment_id."}, status=status.HTTP_400_BAD_REQUEST)
        pago_cliente = _procesar_pago_mercadopago(payment_id)
        if pago_cliente is None:
            return Response({"detail": "No se encontró ese pago."}, status=status.HTTP_404_NOT_FOUND)
        return Response(PagoClienteSerializer(pago_cliente).data)


class ConfirmarPagoSimuladoView(APIView):
    """POST /api/v1/payments/simulado/confirmar/{cotizacion_id} -- sólo
    activo con PAGOS_SIMULADOS=True (ver settings). Aprueba el pago sin
    pasar por Mercado Pago, pero reutiliza crear_pedido_desde_cotizacion:
    el pedido que nace es igual de real que el de un pago aprobado de
    verdad, sólo la aprobación del cobro queda simulada."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, cotizacion_id) -> Response:
        if not settings.PAGOS_SIMULADOS:
            raise PermissionDenied("El pago simulado no está habilitado en este entorno.")

        from apps.orders.views import crear_pedido_desde_cotizacion

        cotizacion = get_object_or_404(Cotizacion, pk=cotizacion_id)
        if cotizacion.recuerdo.cliente_id != request.user.id:
            raise PermissionDenied("Esta cotización no pertenece a tu cuenta.")
        if cotizacion.estado != Cotizacion.Estado.ACEPTADA:
            raise ValidationError(
                {"cotizacion": "Sólo se puede pagar una cotización ya aceptada."}
            )

        pago_cliente, _ = PagoCliente.objects.get_or_create(
            cotizacion=cotizacion,
            defaults={"preference_id": f"SIMULADO-{uuid.uuid4().hex}", "monto": cotizacion.total},
        )
        if pago_cliente.estado == PagoCliente.Estado.APROBADO:
            raise ValidationError({"cotizacion": "Esta cotización ya fue pagada."})
        pago_cliente.payment_id = f"SIMULADO-{uuid.uuid4().hex}"
        pago_cliente.estado = PagoCliente.Estado.APROBADO
        pago_cliente.pagado_en = timezone.now()
        pago_cliente.save(update_fields=["payment_id", "estado", "pagado_en"])
        crear_pedido_desde_cotizacion(cotizacion)

        return Response(PagoClienteSerializer(pago_cliente).data)


class WebhookMercadoPagoView(APIView):
    """POST /api/v1/payments/mercadopago/webhook — Mercado Pago notifica
    aquí server-to-server (más confiable que depender sólo del regreso
    del navegador). Idempotente: si ya se procesó, no duplica el pedido."""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        payment_id = (request.data.get("data") or {}).get("id") or request.query_params.get("id")
        tipo = request.data.get("type") or request.query_params.get("topic")
        if tipo not in ("payment", None) or not payment_id:
            return Response({"ok": True})  # otros tipos de evento (merchant_order, etc.) se ignoran
        _procesar_pago_mercadopago(payment_id)
        return Response({"ok": True})
