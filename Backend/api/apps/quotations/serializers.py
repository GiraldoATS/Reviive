from rest_framework import serializers

from .models import Cotizacion


class CotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cotizacion
        fields = [
            "id",
            "recuerdo",
            "proveedor",
            "total",
            "vigencia",
            "estado",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]
