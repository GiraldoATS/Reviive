from rest_framework import serializers

from .models import Cotizacion


class CotizacionSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source="proveedor.nombre_taller", read_only=True)
    cliente_nombre = serializers.SerializerMethodField()
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True, default="")
    generada_por_ia = serializers.SerializerMethodField()
    # El estado de la cotizacion (aceptada) no cambia una vez se paga -- el
    # pago vive en PagoCliente, una tabla aparte. Sin este campo el
    # frontend no tiene forma de saber si ya se pagó y seguía ofreciendo
    # "Pagar ahora" para siempre.
    pago_estado = serializers.SerializerMethodField()

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
            "pago_estado",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]

    def get_cliente_nombre(self, obj: Cotizacion) -> str:
        perfil = getattr(obj.recuerdo.cliente, "perfil", None)
        return perfil.nombre if perfil else obj.recuerdo.cliente.email

    def get_generada_por_ia(self, obj: Cotizacion) -> bool:
        return obj.ejecucion_agente_id is not None

    def get_pago_estado(self, obj: Cotizacion) -> str | None:
        pago = getattr(obj, "pago_cliente", None)
        return pago.estado if pago else None
