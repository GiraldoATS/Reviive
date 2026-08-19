from rest_framework import serializers

from .models import EventoPedido, Pedido


class EventoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoPedido
        fields = ["id", "estado", "fecha", "descripcion", "evidencia", "responsable"]
        read_only_fields = ["id", "fecha", "responsable"]

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
        read_only_fields = ["id", "codigo", "estado", "creado_en"]
