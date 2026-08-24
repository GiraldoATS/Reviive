from rest_framework import serializers

from .models import Cotizacion


class CotizacionSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source="proveedor.nombre_taller", read_only=True)
    cliente_nombre = serializers.SerializerMethodField()
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True, default="")
    generada_por_ia = serializers.SerializerMethodField()

    class Meta:
        model = Cotizacion
        fields = [
            "id",
            "recuerdo",
            "proveedor",
            "proveedor_nombre",
            "cliente_nombre",
            "producto",
            "producto_nombre",
            "generada_por_ia",
            "total",
            "vigencia",
            "estado",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]

    def get_cliente_nombre(self, obj: Cotizacion) -> str:
        perfil = getattr(obj.recuerdo.cliente, "perfil", None)
        return perfil.nombre if perfil else obj.recuerdo.cliente.email

    def get_generada_por_ia(self, obj: Cotizacion) -> bool:
        return obj.ejecucion_agente_id is not None
