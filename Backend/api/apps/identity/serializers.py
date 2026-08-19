from rest_framework import serializers

from .models import Perfil, Usuario


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
