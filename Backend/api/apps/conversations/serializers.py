from rest_framework import serializers

from .models import Conversacion, Mensaje


class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = ["id", "rol", "contenido", "fecha", "respondido"]
        read_only_fields = ["id", "fecha", "respondido"]


class ConversacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversacion
        fields = ["id", "canal", "estado", "intencion", "creada_en"]
        read_only_fields = ["id", "creada_en"]

    def create(self, validated_data):
        validated_data["usuario"] = self.context["request"].user
        return super().create(validated_data)
