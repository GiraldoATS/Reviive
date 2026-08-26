from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers

from .models import ConfiguracionGlobal, Perfil, PlantillaNotificacion, Usuario

ROLES_AUTOREGISTRABLES = [Usuario.Rol.CLIENTE, Usuario.Rol.PROVEEDOR]


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = [
            "id",
            "nombre",
            "ciudad",
            "telefono",
            "canal_preferido",
            "consentimiento_datos",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]


class UsuarioSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "email", "rol", "estado", "perfil"]
        read_only_fields = ["id", "rol", "estado"]


class ConfiguracionGlobalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionGlobal
        fields = [
            "nombre_empresa",
            "correo_contacto",
            "telefono_contacto",
            "zona_horaria",
            "moneda",
            "idioma",
            "actualizado_en",
        ]
        read_only_fields = ["actualizado_en"]


class PlantillaNotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantillaNotificacion
        fields = ["id", "nombre", "canal", "asunto", "cuerpo", "activa", "creado_en", "actualizado_en"]
        read_only_fields = ["id", "creado_en", "actualizado_en"]


class UsuarioAdminSerializer(serializers.ModelSerializer):
    """Para /api/v1/users (gestión de usuarios y roles) — sólo staff. A
    diferencia de UsuarioSerializer (self-service), aquí rol y estado sí
    son editables: es exactamente el propósito de esta vista."""

    perfil = PerfilSerializer(read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "email", "rol", "estado", "perfil", "date_joined"]
        read_only_fields = ["id", "email", "date_joined"]


class RegistroSerializer(serializers.Serializer):
    """POST /api/v1/auth/register — RN-01: exige consentimiento de datos."""

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    nombre = serializers.CharField(max_length=150)
    ciudad = serializers.CharField(max_length=100, required=False, allow_blank=True)
    telefono = serializers.CharField(max_length=30, required=False, allow_blank=True, default="")
    canal_preferido = serializers.ChoiceField(
        choices=Perfil.CanalPreferido.choices, default=Perfil.CanalPreferido.WEB
    )
    consentimiento_datos = serializers.BooleanField()
    rol = serializers.ChoiceField(choices=ROLES_AUTOREGISTRABLES, default=Usuario.Rol.CLIENTE)
    nombre_taller = serializers.CharField(max_length=150, required=False, allow_blank=True)
    # Portafolio/documentos legales del proveedor (RN-05); ver
    # apps.providers.models.DocumentoProveedor.Tipo para los valores válidos.
    documentos = serializers.ListField(
        child=serializers.DictField(), required=False, default=list
    )

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ese nombre de usuario ya está en uso.")
        return value

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ese correo ya está registrado.")
        return value

    def validate_consentimiento_datos(self, value):
        if not value:
            raise serializers.ValidationError(
                "Se requiere tu consentimiento para tratar los datos del recuerdo (RN-01)."
            )
        return value

    def validate(self, attrs):
        if attrs.get("rol") == Usuario.Rol.PROVEEDOR and not attrs.get("nombre_taller"):
            raise serializers.ValidationError(
                {"nombre_taller": "Requerido para registrarte como proveedor/taller."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        # Import diferido: evita un ciclo identity <-> providers a nivel de módulo.
        from apps.providers.models import Proveedor

        password = validated_data.pop("password")
        nombre = validated_data.pop("nombre")
        ciudad = validated_data.pop("ciudad", "")
        telefono = validated_data.pop("telefono", "")
        canal_preferido = validated_data.pop("canal_preferido")
        consentimiento = validated_data.pop("consentimiento_datos")
        rol = validated_data.pop("rol")
        nombre_taller = validated_data.pop("nombre_taller", "")
        documentos = validated_data.pop("documentos", [])

        usuario = Usuario(rol=rol, **validated_data)
        usuario.set_password(password)
        usuario.save()

        Perfil.objects.create(
            usuario=usuario,
            nombre=nombre,
            ciudad=ciudad,
            telefono=telefono,
            canal_preferido=canal_preferido,
            consentimiento_datos=consentimiento,
        )

        if rol == Usuario.Rol.PROVEEDOR:
            from apps.providers.models import DocumentoProveedor

            proveedor = Proveedor.objects.create(
                usuario=usuario,
                nombre_taller=nombre_taller,
                ciudad=ciudad,
                estado_validacion=Proveedor.EstadoValidacion.PENDIENTE,
            )
            tipos_validos = {c[0] for c in DocumentoProveedor.Tipo.choices}
            for doc in documentos:
                tipo = doc.get("tipo")
                base64_data = doc.get("base64")
                if tipo not in tipos_validos or not base64_data:
                    continue
                DocumentoProveedor.objects.create(
                    proveedor=proveedor,
                    tipo=tipo,
                    nombre_archivo=doc.get("nombre", ""),
                    archivo_base64=base64_data,
                )

        return usuario


class IdentificarTelegramSerializer(serializers.Serializer):
    """POST /api/v1/auth/identificar-telegram (n8n, canal de Telegram)."""

    telegram_chat_id = serializers.IntegerField()
    telegram_username = serializers.CharField(required=False, allow_blank=True, default="")
    nombre = serializers.CharField(required=False, allow_blank=True, default="")


class LiberarBloqueoTelegramSerializer(serializers.Serializer):
    """POST /api/v1/telegram/bloqueo/liberar"""

    ultimo_update_id = serializers.IntegerField(required=False, allow_null=True, default=None)


class SolicitarRestablecimientoSerializer(serializers.Serializer):
    """POST /api/v1/auth/password-reset/solicitar"""

    email = serializers.EmailField()


class ConfirmarRestablecimientoSerializer(serializers.Serializer):
    """POST /api/v1/auth/password-reset/confirmar

    uid/token vienen del enlace que se envió por correo (ver
    `_enviar_correo_restablecimiento` en views.py). Todas las validaciones
    (enlace válido, no expirado, contraseñas coinciden, contraseña cumple
    las reglas de AUTH_PASSWORD_VALIDATORS) se hacen aquí para que
    is_valid(raise_exception=True) las reporte de forma uniforme.
    """

    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password_confirmar = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            pk = force_str(urlsafe_base64_decode(attrs["uid"]))
            usuario = Usuario.objects.get(pk=pk)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            raise serializers.ValidationError(
                {"uid": "El enlace de restablecimiento no es válido."}
            )

        # default_token_generator.check_token ya valida expiración
        # (PASSWORD_RESET_TIMEOUT, 24h) y que la contraseña no haya sido
        # cambiada desde que se generó el enlace (el token deja de ser
        # válido apenas se usa una vez, por diseño).
        if not default_token_generator.check_token(usuario, attrs["token"]):
            raise serializers.ValidationError(
                {"token": "El enlace de restablecimiento no es válido o ya expiró. Solicita uno nuevo."}
            )

        if attrs["password"] != attrs["password_confirmar"]:
            raise serializers.ValidationError(
                {"password_confirmar": "Las contraseñas no coinciden."}
            )

        try:
            validate_password(attrs["password"], user=usuario)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})

        attrs["usuario"] = usuario
        return attrs
