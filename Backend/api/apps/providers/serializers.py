from rest_framework import serializers

from .models import CapacidadProveedor, DiaBloqueadoProveedor, DocumentoProveedor, Proveedor


class CapacidadProveedorSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source="producto.nombre", read_only=True)

    class Meta:
        model = CapacidadProveedor
        fields = ["id", "producto", "producto_nombre", "material", "ciudad", "tiempo_estimado_dias"]


class DiaBloqueadoProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaBloqueadoProveedor
        fields = ["id", "fecha"]
        read_only_fields = ["id"]


class ProveedorSerializer(serializers.ModelSerializer):
    capacidades = CapacidadProveedorSerializer(many=True, read_only=True)
    dias_bloqueados = DiaBloqueadoProveedorSerializer(many=True, read_only=True)

    class Meta:
        model = Proveedor
        fields = [
            "id",
            "nombre_taller",
            "ciudad",
            "estado_validacion",
            "calificacion",
            "capacidades",
            "direccion",
            "descripcion",
            "anios_experiencia",
            "horario_atencion",
            "capacidad_maxima",
            "disponible",
            "dias_bloqueados",
        ]
        read_only_fields = ["id", "nombre_taller", "ciudad", "estado_validacion", "calificacion"]


class DocumentoProveedorSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source="get_tipo_display", read_only=True)

    class Meta:
        model = DocumentoProveedor
        fields = [
            "id",
            "tipo",
            "tipo_display",
            "nombre_archivo",
            "archivo_base64",
            "estado_revision",
            "creado_en",
        ]
        read_only_fields = ["id", "tipo", "nombre_archivo", "archivo_base64", "creado_en"]


class MatchRequestSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField()
    ciudad = serializers.CharField(required=False, allow_blank=True)
