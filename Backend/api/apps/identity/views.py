import logging

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario
from .serializers import (
    ConfirmarRestablecimientoSerializer,
    RegistroSerializer,
    SolicitarRestablecimientoSerializer,
    UsuarioSerializer,
)

logger = logging.getLogger(__name__)


class MeView(APIView):
    """GET /api/v1/users/me — perfil del usuario autenticado."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)


class RegistroView(APIView):
    """POST /api/v1/auth/register — crea una cuenta de cliente o proveedor.

    Los roles internos (administrador, supervisor_ia, etc.) no son
    autoregistrables: sólo se crean desde el admin o `createsuperuser`.
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegistroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()

        refresh = RefreshToken.for_user(usuario)
        return Response(
            {
                "usuario": UsuarioSerializer(usuario).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


def _enviar_correo_restablecimiento(usuario: Usuario) -> None:
    uid = urlsafe_base64_encode(force_bytes(usuario.pk))
    token = default_token_generator.make_token(usuario)
    enlace = f"{settings.FRONTEND_URL}/auth/restablecer?uid={uid}&token={token}"
    nombre = getattr(getattr(usuario, "perfil", None), "nombre", "") or usuario.email

    cuerpo_html = render_to_string(
        "identity/emails/restablecer_contrasena.html",
        {"nombre": nombre, "enlace_restablecer": enlace},
    )
    correo = EmailMultiAlternatives(
        subject="Restablece tu contraseña en Reviive",
        body=f"Hola {nombre}, restablece tu contraseña en Reviive aquí: {enlace} (válido por 24 horas).",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[usuario.email],
    )
    correo.attach_alternative(cuerpo_html, "text/html")
    correo.send(fail_silently=False)


class SolicitarRestablecimientoView(APIView):
    """POST /api/v1/auth/password-reset/solicitar

    Siempre responde con el mismo mensaje genérico exista o no una cuenta
    con ese correo (evita que alguien use este endpoint para averiguar qué
    correos están registrados). Las cuentas suspendidas no reciben el
    enlace: restablecer la clave no debe ser una forma de saltarse una
    suspensión.
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = SolicitarRestablecimientoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        usuario = (
            Usuario.objects.exclude(estado=Usuario.Estado.SUSPENDIDO)
            .filter(email__iexact=email)
            .first()
        )
        if usuario:
            try:
                _enviar_correo_restablecimiento(usuario)
            except Exception:
                # No se filtra el detalle al cliente (seguiría sin revelar
                # si el correo existe), pero queda en el log del servidor
                # para poder diagnosticar un SMTP mal configurado.
                logger.exception("No se pudo enviar el correo de restablecimiento a %s", usuario.email)

        return Response(
            {"mensaje": "Si existe una cuenta con ese correo, enviamos instrucciones para restablecer la contraseña."}
        )


class ConfirmarRestablecimientoView(APIView):
    """POST /api/v1/auth/password-reset/confirmar"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = ConfirmarRestablecimientoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = serializer.validated_data["usuario"]
        usuario.set_password(serializer.validated_data["password"])
        usuario.save(update_fields=["password"])

        return Response({"mensaje": "Tu contraseña se actualizó correctamente."})
