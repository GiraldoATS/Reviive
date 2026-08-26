from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    AdquirirBloqueoTelegramView,
    ConfiguracionGlobalView,
    ConfirmarRestablecimientoView,
    ConfirmarVinculacionTelegramView,
    EstadoVinculacionTelegramView,
    GenerarCodigoTelegramView,
    IdentificarCanalTelegramView,
    LiberarBloqueoTelegramView,
    MeView,
    PlantillaNotificacionViewSet,
    RegistroView,
    SolicitarRestablecimientoView,
    UsuarioAdminViewSet,
)

router = DefaultRouter()
router.register("users", UsuarioAdminViewSet, basename="users-admin")
router.register("notification-templates", PlantillaNotificacionViewSet, basename="notification-templates")

urlpatterns = [
    path("auth/register", RegistroView.as_view(), name="auth-register"),
    path("auth/login", TokenObtainPairView.as_view(), name="auth-login"),
    path("auth/refresh", TokenRefreshView.as_view(), name="auth-refresh"),
    path(
        "auth/identificar-telegram",
        IdentificarCanalTelegramView.as_view(),
        name="auth-identificar-telegram",
    ),
    path(
        "telegram/bloqueo/adquirir",
        AdquirirBloqueoTelegramView.as_view(),
        name="telegram-bloqueo-adquirir",
    ),
    path(
        "telegram/bloqueo/liberar",
        LiberarBloqueoTelegramView.as_view(),
        name="telegram-bloqueo-liberar",
    ),
    path(
        "auth/password-reset/solicitar",
        SolicitarRestablecimientoView.as_view(),
        name="auth-password-reset-solicitar",
    ),
    path(
        "auth/password-reset/confirmar",
        ConfirmarRestablecimientoView.as_view(),
        name="auth-password-reset-confirmar",
    ),
    path("users/me", MeView.as_view(), name="users-me"),
    path("settings", ConfiguracionGlobalView.as_view(), name="settings"),
    path(
        "auth/telegram/link/generate",
        GenerarCodigoTelegramView.as_view(),
        name="auth-telegram-link-generate",
    ),
    path(
        "auth/telegram/link/status",
        EstadoVinculacionTelegramView.as_view(),
        name="auth-telegram-link-status",
    ),
    path(
        "auth/telegram/link/confirm",
        ConfirmarVinculacionTelegramView.as_view(),
        name="auth-telegram-link-confirm",
    ),
] + router.urls
