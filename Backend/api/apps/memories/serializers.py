from rest_framework import serializers

from .models import Archivo, ObjetoMemoria, Recuerdo


class ArchivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archivo
        fields = ["id", "tipo", "url", "checksum", "creado_en"]
        read_only_fields = ["id", "url", "checksum", "creado_en"]


class ObjetoMemoriaSerializer(serializers.ModelSerializer):
    archivos = ArchivoSerializer(many=True, read_only=True)

    class Meta:
        model = ObjetoMemoria
        fields = [
            "id",
            "tipo",
            "categoria",
            "marca",
            "anio_aproximado",
            "material",
            "estado",
            "nivel_transformacion",
            "archivos",
            "fotos_base64",
        ]


class RecuerdoSerializer(serializers.ModelSerializer):
    # Writable: permite crear el primer objeto junto con el recuerdo en el
    # mismo POST (el wizard del frontend registra ambos en un solo paso).
    objetos = ObjetoMemoriaSerializer(many=True, required=False)
    cliente_nombre = serializers.SerializerMethodField()
    recomendaciones_resumen = serializers.SerializerMethodField()

    class Meta:
        model = Recuerdo
        fields = [
            "id",
            "cliente_nombre",
            "persona_recordada",
            "historia",
            "privacidad",
            "objetos",
            "recomendaciones_resumen",
            "creado_en",
            "actualizado_en",
        ]
        read_only_fields = ["id", "creado_en", "actualizado_en"]

    def get_cliente_nombre(self, obj: Recuerdo) -> str:
        perfil = getattr(obj.cliente, "perfil", None)
        return perfil.nombre if perfil else obj.cliente.email

    def get_recomendaciones_resumen(self, obj: Recuerdo) -> dict:
        recomendaciones = list(obj.recomendaciones.all())
        return {
            "total": len(recomendaciones),
            "requiere_revision_humana": any(r.requiere_revision_humana for r in recomendaciones),
        }

    def create(self, validated_data):
        objetos_data = validated_data.pop("objetos", [])
        validated_data["cliente"] = self.context["request"].user
        recuerdo = super().create(validated_data)
        for objeto_data in objetos_data:
            ObjetoMemoria.objects.create(recuerdo=recuerdo, **objeto_data)
        return recuerdo
