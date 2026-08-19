from rest_framework import serializers

from .models import EjemploDataset, Evaluacion


class EvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluacion
        fields = ["id", "ejecucion", "tipo", "puntaje", "requiere_revision", "creado_en"]
        read_only_fields = ["id", "creado_en"]


class EjemploDatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjemploDataset
        fields = [
            "id",
            "conversacion",
            "etiqueta",
            "anonimizado",
            "estado_revision",
            "aprobado_por",
            "creado_en",
        ]
        read_only_fields = ["id", "estado_revision", "aprobado_por", "creado_en"]
