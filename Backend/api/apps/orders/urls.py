from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import PedidoEventosView, PedidoViewSet

router = DefaultRouter()
router.register("orders", PedidoViewSet, basename="orders")

urlpatterns = [
    path("orders/<uuid:pedido_id>/events", PedidoEventosView.as_view(), name="orders-events"),
] + router.urls
