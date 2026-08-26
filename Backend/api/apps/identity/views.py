import logging
import random
import string
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils import timezone

from apps.agents.permissions import IsN8nOrchestrator

from .models import (
    CodigoVinculacionTelegram,
    ConfiguracionGlobal,
    EstadoCanalTelegram,
    Perfil,
    PlantillaNotificacion,
    Usuario,
)
from .serializers import (
    ConfiguracionGlobalSerializer,
    ConfirmarRestablecimientoSerializer,
    IdentificarTelegramSerializer,
    LiberarBloqueoTelegramSerializer,
    PerfilSerializer,
    PlantillaNotificacionSerializer,
    RegistroSerializer,
    SolicitarRestablecimientoSerializer,
    UsuarioAdminSerializer,
    UsuarioSerializer,
)

STAFF_ROLES = {"administrador", "superadministrador"}


class EsStaffAdministrativo(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return user.is_authenticated and (user.is_staff or user.rol in STAFF_ROLES)


class UsuarioAdminViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """/api/v1/users — gestión de usuarios y roles, sólo staff. Lista,
    detalle y edición de rol/estado — nunca creación/borrado desde aquí
    (eso pasa por /auth/register), ni self-service (eso es /users/me)."""

    serializer_class = UsuarioAdminSerializer
    permission_classes = [EsStaffAdministrativo]
    queryset = Usuario.objects.select_related("perfil").order_by("-date_joined")


class PlantillaNotificacionViewSet(viewsets.ModelViewSet):
    """/api/v1/notification-templates — sólo staff."""

    serializer_class = PlantillaNotificacionSerializer
    permission_classes = [EsStaffAdministrativo]
    queryset = PlantillaNotificacion.objects.order_by("-actualizado_en")


class ConfiguracionGlobalView(APIView):
    """GET/PUT /api/v1/settings — configuración general de la plataforma."""

    permission_classes = [EsStaffAdministrativo]

    def get(self, request: Request) -> Response:
        return Response(ConfiguracionGlobalSerializer(ConfiguracionGlobal.obtener()).data)

    def put(self, request: Request) -> Response:
        config = ConfiguracionGlobal.obtener()
        serializer = ConfiguracionGlobalSerializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

logger = logging.getLogger(__name__)


class MeView(APIView):
    """GET/PATCH /api/v1/users/me — perfil del usuario autenticado.

    PATCH sólo permite editar los campos propios del `Perfil` (nombre,
    ciudad, teléfono): el correo es el identificador de acceso (email) y
    no se cambia desde aquí (ver validate en el frontend/mi-cuenta/datos).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request: Request) -> Response:
        perfil, _ = Perfil.objects.get_or_create(usuario=request.user, defaults={"nombre": ""})
        serializer = PerfilSerializer(perfil, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UsuarioSerializer(request.user).data)


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


class IdentificarCanalTelegramView(APIView):
    """POST /api/v1/auth/identificar-telegram — n8n resuelve (o crea) la
    cuenta Reviive asociada a un chat de Telegram, y devuelve un token de
    acceso + una conversación abierta para que el orquestador de Alma
    pueda atenderlo igual que a un usuario web.

    RN-01: una cuenta creada así arranca SIN consentimiento_datos (nadie
    lo pidió explícitamente todavía) -- las funciones que ya exigen ese
    consentimiento (p. ej. crear un Recuerdo desde el agente de
    extracción) simplemente no actuarán hasta que se otorgue por otro
    medio; no se inventa un flujo de consentimiento nuevo aquí.
    """

    permission_classes = [IsN8nOrchestrator]

    def post(self, request: Request) -> Response:
        from apps.conversations.models import Conversacion

        serializer = IdentificarTelegramSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        chat_id = serializer.validated_data["telegram_chat_id"]
        telegram_username = serializer.validated_data["telegram_username"]
        nombre = serializer.validated_data["nombre"] or telegram_username or "Usuario de Telegram"

        perfil = Perfil.objects.filter(telegram_chat_id=chat_id).select_related("usuario").first()
        es_nuevo = perfil is None

        if perfil is None:
            with transaction.atomic():
                usuario = Usuario(
                    username=f"tg-{chat_id}",
                    email=f"telegram-{chat_id}@t.reviive.local",
                    rol=Usuario.Rol.CLIENTE,
                )
                usuario.set_unusable_password()
                usuario.save()
                Perfil.objects.create(
                    usuario=usuario,
                    nombre=nombre[:150],
                    canal_preferido=Perfil.CanalPreferido.TELEGRAM,
                    telegram_chat_id=chat_id,
                )
        else:
            usuario = perfil.usuario

        conversacion = (
            Conversacion.objects.filter(
                usuario=usuario,
                canal=Conversacion.Canal.TELEGRAM,
                estado=Conversacion.Estado.ACTIVA,
            )
            .order_by("-creada_en")
            .first()
        )
        if conversacion is None:
            conversacion = Conversacion.objects.create(usuario=usuario, canal=Conversacion.Canal.TELEGRAM)

        refresh = RefreshToken.for_user(usuario)
        return Response(
            {
                "access_token": str(refresh.access_token),
                "conversacion_id": str(conversacion.id),
                "es_nuevo": es_nuevo,
            }
        )


_BLOQUEO_TELEGRAM_TIMEOUT_SEGUNDOS = 60


class AdquirirBloqueoTelegramView(APIView):
    """POST /api/v1/telegram/bloqueo/adquirir

    El Schedule Trigger del workflow de Telegram en n8n dispara cada 5s
    sin esperar a que la ejecucion anterior termine, y procesar un
    mensaje de audio (transcripcion + respuesta en voz) puede tardar mas
    que eso -- se verifico empiricamente que dos ejecuciones que se
    solapan pueden terminar procesando el mismo mensaje de Telegram dos o
    tres veces. select_for_update() aqui SI da exclusion mutua real
    (MySQL bloquea la fila mientras dura esta transaccion), a diferencia
    de los datos estaticos internos de n8n.
    """

    permission_classes = [IsN8nOrchestrator]

    def post(self, request: Request) -> Response:
        with transaction.atomic():
            fila, _ = EstadoCanalTelegram.objects.select_for_update().get_or_create(pk=1)
            ahora = timezone.now()
            vencido = (
                fila.bloqueado_desde is not None
                and (ahora - fila.bloqueado_desde).total_seconds() > _BLOQUEO_TELEGRAM_TIMEOUT_SEGUNDOS
            )
            if fila.bloqueado_desde is not None and not vencido:
                return Response({"adquirido": False})

            fila.bloqueado_desde = ahora
            fila.save(update_fields=["bloqueado_desde"])
            return Response({"adquirido": True, "offset": fila.ultimo_update_id})


class LiberarBloqueoTelegramView(APIView):
    """POST /api/v1/telegram/bloqueo/liberar"""

    permission_classes = [IsN8nOrchestrator]

    def post(self, request: Request) -> Response:
        serializer = LiberarBloqueoTelegramSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        nuevo_offset = serializer.validated_data["ultimo_update_id"]

        with transaction.atomic():
            fila, _ = EstadoCanalTelegram.objects.select_for_update().get_or_create(pk=1)
            if nuevo_offset is not None and nuevo_offset > fila.ultimo_update_id:
                fila.ultimo_update_id = nuevo_offset
            fila.bloqueado_desde = None
            fila.save(update_fields=["ultimo_update_id", "bloqueado_desde"])

        return Response({"ok": True})


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


def _generar_codigo_telegram() -> str:
    alfabeto = "".join(c for c in string.ascii_uppercase + string.digits if c not in "0O1I")
    for _ in range(10):
        codigo = "".join(random.choices(alfabeto, k=6))
        if not CodigoVinculacionTelegram.objects.filter(codigo=codigo).exists():
            return codigo
    raise RuntimeError("No se pudo generar un código de vinculación único.")


class GenerarCodigoTelegramView(APIView):
    """POST /api/v1/auth/telegram/link/generate — el usuario web pide un
    código para vincular su cuenta a su chat de Telegram."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        # Invalida códigos anteriores sin usar: sólo el más reciente es válido.
        CodigoVinculacionTelegram.objects.filter(usuario=request.user, usado=False).delete()
        codigo = CodigoVinculacionTelegram.objects.create(
            usuario=request.user,
            codigo=_generar_codigo_telegram(),
            expira_en=timezone.now() + timedelta(minutes=10),
        )
        return Response(
            {
                "codigo": codigo.codigo,
                "expira_en": codigo.expira_en,
                "bot_username": "AlmaReviiveBot",
            }
        )


class EstadoVinculacionTelegramView(APIView):
    """GET /api/v1/auth/telegram/link/status — para que el frontend haga
    polling y sepa cuándo se completó la vinculación."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        perfil = getattr(request.user, "perfil", None)
        return Response({"vinculado": bool(perfil and perfil.telegram_chat_id)})


class ConfirmarVinculacionTelegramView(APIView):
    """POST /api/v1/auth/telegram/link/confirm — la llama n8n (canal de
    Telegram) cuando el usuario envía un código al bot."""

    permission_classes = [IsN8nOrchestrator]

    def post(self, request: Request) -> Response:
        codigo_texto = (request.data.get("codigo") or "").strip().upper()
        chat_id = request.data.get("chat_id")
        if not codigo_texto or chat_id is None:
            return Response({"ok": False, "mensaje": "Faltan datos."}, status=400)

        codigo = CodigoVinculacionTelegram.objects.filter(
            codigo=codigo_texto, usado=False, expira_en__gt=timezone.now()
        ).first()
        if codigo is None:
            return Response(
                {"ok": False, "mensaje": "Ese código no es válido o ya venció. Genera uno nuevo desde la web."},
                status=404,
            )

        # Si ese chat ya estaba vinculado a otra cuenta (p. ej. una creada
        # automáticamente por hablar con Alma sin haberse registrado antes),
        # se libera de ahí para poder asignarlo a la cuenta que sí está
        # vinculando activamente (unique=True en telegram_chat_id).
        Perfil.objects.filter(telegram_chat_id=chat_id).exclude(usuario=codigo.usuario).update(
            telegram_chat_id=None
        )

        perfil, _ = Perfil.objects.get_or_create(
            usuario=codigo.usuario, defaults={"nombre": codigo.usuario.email}
        )
        perfil.telegram_chat_id = chat_id
        perfil.save(update_fields=["telegram_chat_id"])

        codigo.usado = True
        codigo.save(update_fields=["usado"])

        return Response({"ok": True, "nombre": perfil.nombre})
