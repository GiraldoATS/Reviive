from rest_framework import serializers

from .models import EjemploDataset, Evaluacion


class EvaluacionSerializer(serializers.ModelSerializer):
    agente = serializers.CharField(source="ejecucion.agente", read_only=True)
    agente_display = serializers.CharField(source="ejecucion.get_agente_display", read_only=True)
    reply = serializers.CharField(source="ejecucion.reply", read_only=True)

    class Meta:
        model = Evaluacion
        fields = [
            "id",
            "ejecucion",
            "agente",
            "agente_display",
            "reply",
            "tipo",
            "puntaje",
            "requiere_revision",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]


class EjemploDatasetSerializer(serializers.ModelSerializer):
    conversacion_resumen = serializers.SerializerMethodField()

    class Meta:
        model = EjemploDataset
        fields = [
            "id",
            "conversacion",
            "conversacion_resumen",
            "etiqueta",
            "anonimizado",
            "estado_revision",
            "aprobado_por",
            "creado_en",
        ]
        read_only_fields = ["id", "estado_revision", "aprobado_por", "creado_en"]

    def get_conversacion_resumen(self, obj: EjemploDataset) -> str:
        conv = obj.conversacion
        return conv.intencion or f"Conversación {conv.canal} sin intención registrada"
