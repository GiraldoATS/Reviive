from rest_framework import serializers

from .models import EventoPedido, Pedido


class EventoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoPedido
        fields = ["id", "estado", "fecha", "descripcion", "evidencia", "responsable"]
        read_only_fields = ["id", "fecha", "responsable"]

    def validate(self, attrs):
        if attrs.get("estado") == Pedido.Estado.RECIBIDO:
            if not attrs.get("evidencia"):
                raise serializers.ValidationError(
                    {"evidencia": "La recepción del objeto exige evidencia fotográfica (RN-06)."}
                )
            if not attrs.get("descripcion"):
                raise serializers.ValidationError(
                    {"descripcion": "La recepción del objeto exige describir su condición (RN-06)."}
                )
        return attrs

    def create(self, validated_data):
        validated_data["responsable"] = self.context["request"].user
        return super().create(validated_data)


class PedidoSerializer(serializers.ModelSerializer):
    eventos = EventoPedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = [
            "id",
            "codigo",
            "cotizacion",
            "estado",
            "total",
            "eventos",
            "creado_en",
        ]
        read_only_fields = ["id", "codigo", "estado", "total", "creado_en"]
