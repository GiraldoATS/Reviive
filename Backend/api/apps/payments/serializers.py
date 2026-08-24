from rest_framework import serializers

from .models import Pago


class PagoSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source="pedido.cotizacion.proveedor.nombre_taller", read_only=True)
    pedido_codigo = serializers.CharField(source="pedido.codigo", read_only=True)

    class Meta:
        model = Pago
        fields = [
            "id",
            "pedido",
            "pedido_codigo",
            "proveedor_nombre",
            "monto_bruto",
            "comision_pct",
            "monto_neto",
            "estado",
            "fecha_estimada",
            "fecha_pago",
            "creado_en",
        ]
        read_only_fields = [
            "id",
            "pedido",
            "monto_bruto",
            "comision_pct",
            "monto_neto",
            "fecha_estimada",
            "fecha_pago",
            "creado_en",
        ]
