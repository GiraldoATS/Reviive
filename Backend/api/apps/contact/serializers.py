from rest_framework import serializers

from .models import MensajeContacto


class MensajeContactoSerializer(serializers.ModelSerializer):
    """POST /api/v1/contacto/mensajes — formulario público de contacto."""

    class Meta:
        model = MensajeContacto
        fields = [
            "id",
            "nombre",
            "correo",
            "telefono",
            "motivo",
            "mensaje",
            "foto_base64",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]

    def validate_mensaje(self, value):
        if not value.strip():
            raise serializers.ValidationError("Cuéntanos brevemente qué necesitas.")
        return value
