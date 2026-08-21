from django.db import transaction
from rest_framework import serializers

from .models import Perfil, Usuario

ROLES_AUTOREGISTRABLES = [Usuario.Rol.CLIENTE, Usuario.Rol.PROVEEDOR]


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = [
            "id",
            "nombre",
            "ciudad",
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


class RegistroSerializer(serializers.Serializer):
    """POST /api/v1/auth/register — RN-01: exige consentimiento de datos."""

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    nombre = serializers.CharField(max_length=150)
    ciudad = serializers.CharField(max_length=100, required=False, allow_blank=True)
    canal_preferido = serializers.ChoiceField(
        choices=Perfil.CanalPreferido.choices, default=Perfil.CanalPreferido.WEB
    )
    consentimiento_datos = serializers.BooleanField()
    rol = serializers.ChoiceField(choices=ROLES_AUTOREGISTRABLES, default=Usuario.Rol.CLIENTE)
    nombre_taller = serializers.CharField(max_length=150, required=False, allow_blank=True)

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
        canal_preferido = validated_data.pop("canal_preferido")
        consentimiento = validated_data.pop("consentimiento_datos")
        rol = validated_data.pop("rol")
        nombre_taller = validated_data.pop("nombre_taller", "")

        usuario = Usuario(rol=rol, **validated_data)
        usuario.set_password(password)
        usuario.save()

        Perfil.objects.create(
            usuario=usuario,
            nombre=nombre,
            ciudad=ciudad,
            canal_preferido=canal_preferido,
            consentimiento_datos=consentimiento,
        )

        if rol == Usuario.Rol.PROVEEDOR:
            Proveedor.objects.create(
                usuario=usuario,
                nombre_taller=nombre_taller,
                ciudad=ciudad,
                estado_validacion=Proveedor.EstadoValidacion.PENDIENTE,
            )

        return usuario
