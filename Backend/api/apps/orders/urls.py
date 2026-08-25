from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    EnvioViewSet,
    MensajePedidoNoLeidosView,
    PedidoEventosView,
    PedidoMensajesView,
    PedidoResenaView,
    PedidoViewSet,
    ReclamacionViewSet,
)

router = DefaultRouter()
router.register("orders", PedidoViewSet, basename="orders")
router.register("shipments", EnvioViewSet, basename="shipments")
router.register("claims", ReclamacionViewSet, basename="claims")

urlpatterns = [
    path("orders/messages/unread-count", MensajePedidoNoLeidosView.as_view(), name="orders-messages-unread"),
    path("orders/<uuid:pedido_id>/events", PedidoEventosView.as_view(), name="orders-events"),
    path("orders/<uuid:pedido_id>/review", PedidoResenaView.as_view(), name="orders-review"),
    path("orders/<uuid:pedido_id>/messages", PedidoMensajesView.as_view(), name="orders-messages"),
] + router.urls
