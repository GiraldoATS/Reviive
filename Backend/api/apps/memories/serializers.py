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
            "marca",
            "anio_aproximado",
            "material",
            "estado",
            "nivel_transformacion",
            "archivos",
        ]


class RecuerdoSerializer(serializers.ModelSerializer):
    # Writable: permite crear el primer objeto junto con el recuerdo en el
    # mismo POST (el wizard del frontend registra ambos en un solo paso).
    objetos = ObjetoMemoriaSerializer(many=True, required=False)

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
        objetos_data = validated_data.pop("objetos", [])
        validated_data["cliente"] = self.context["request"].user
        recuerdo = super().create(validated_data)
        for objeto_data in objetos_data:
            ObjetoMemoria.objects.create(recuerdo=recuerdo, **objeto_data)
        return recuerdo
