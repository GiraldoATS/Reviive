from rest_framework import serializers

from .models import Conversacion, Mensaje


class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = ["id", "rol", "contenido", "fecha", "respondido", "imagen_base64"]
        read_only_fields = ["id", "fecha", "respondido"]


class ConversacionSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Conversacion
        fields = ["id", "usuario_nombre", "canal", "estado", "intencion", "creada_en"]
        read_only_fields = ["id", "creada_en"]

    def get_usuario_nombre(self, obj: Conversacion) -> str:
        perfil = getattr(obj.usuario, "perfil", None)
        return perfil.nombre if perfil else obj.usuario.email

    def create(self, validated_data):
        validated_data["usuario"] = self.context["request"].user
        return super().create(validated_data)
