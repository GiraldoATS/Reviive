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
            "material",
            "estado",
            "nivel_transformacion",
            "archivos",
        ]


class RecuerdoSerializer(serializers.ModelSerializer):
    objetos = ObjetoMemoriaSerializer(many=True, read_only=True)

    class Meta:
        model = Recuerdo
        fields = [
            "id",
            "persona_recordada",
            "historia",
            "privacidad",
            "objetos",
            "creado_en",
            "actualizado_en",
        ]
        read_only_fields = ["id", "creado_en", "actualizado_en"]

    def create(self, validated_data):
        validated_data["cliente"] = self.context["request"].user
        return super().create(validated_data)
