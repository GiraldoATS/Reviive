from rest_framework import serializers

from .models import CapacidadProveedor, Proveedor


class CapacidadProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapacidadProveedor
        fields = ["id", "producto", "material", "ciudad", "tiempo_estimado_dias"]


class ProveedorSerializer(serializers.ModelSerializer):
    capacidades = CapacidadProveedorSerializer(many=True, read_only=True)

    class Meta:
        model = Proveedor
        fields = [
            "id",
            "nombre_taller",
            "ciudad",
            "estado_validacion",
            "calificacion",
            "capacidades",
        ]
        read_only_fields = ["id", "estado_validacion", "calificacion"]


class MatchRequestSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    ciudad = serializers.CharField(required=False, allow_blank=True)
