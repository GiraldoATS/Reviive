from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    ConfirmarRestablecimientoView,
    MeView,
    RegistroView,
    SolicitarRestablecimientoView,
)

urlpatterns = [
    path("auth/register", RegistroView.as_view(), name="auth-register"),
    path("auth/login", TokenObtainPairView.as_view(), name="auth-login"),
    path("auth/refresh", TokenRefreshView.as_view(), name="auth-refresh"),
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
]
