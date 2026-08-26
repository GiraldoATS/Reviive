from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ConfirmarPagoSimuladoView,
    ConfirmarRetornoPagoView,
    IniciarPagoMercadoPagoView,
    PagoViewSet,
    WebhookMercadoPagoView,
)

router = DefaultRouter()
router.register("payments", PagoViewSet, basename="payments")

urlpatterns = [
    path(
        "payments/mercadopago/iniciar/<uuid:cotizacion_id>",
        IniciarPagoMercadoPagoView.as_view(),
        name="payments-mercadopago-iniciar",
    ),
    path(
        "payments/mercadopago/confirmar",
        ConfirmarRetornoPagoView.as_view(),
        name="payments-mercadopago-confirmar",
    ),
    path(
        "payments/mercadopago/webhook",
        WebhookMercadoPagoView.as_view(),
        name="payments-mercadopago-webhook",
    ),
    path(
        "payments/simulado/confirmar/<uuid:cotizacion_id>",
        ConfirmarPagoSimuladoView.as_view(),
        name="payments-simulado-confirmar",
    ),
] + router.urls
