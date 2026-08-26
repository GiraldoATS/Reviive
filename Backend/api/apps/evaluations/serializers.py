from rest_framework import serializers

from .models import CasoPrueba, CorreccionRespuesta, EjemploDataset, Evaluacion, FuenteConocimiento


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


class CasoPruebaSerializer(serializers.ModelSerializer):
    agente_display = serializers.CharField(source="get_agente_display", read_only=True)

    class Meta:
        model = CasoPrueba
        fields = [
            "id",
            "agente",
            "agente_display",
            "nombre",
            "entrada",
            "resultado_esperado",
            "resultado",
            "notas",
            "creado_en",
            "actualizado_en",
        ]
        read_only_fields = ["id", "creado_en", "actualizado_en"]


class FuenteConocimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuenteConocimiento
        fields = [
            "id",
            "nombre",
            "tipo",
            "version",
            "estado",
            "url_o_referencia",
            "creado_en",
            "actualizado_en",
        ]
        read_only_fields = ["id", "creado_en", "actualizado_en"]


class CorreccionRespuestaSerializer(serializers.ModelSerializer):
    agente_display = serializers.CharField(source="ejecucion.get_agente_display", read_only=True)
    reply_original = serializers.CharField(source="ejecucion.reply", read_only=True)

    class Meta:
        model = CorreccionRespuesta
        fields = [
            "id",
            "ejecucion",
            "agente_display",
            "reply_original",
            "categoria_error",
            "respuesta_esperada",
            "comentario",
            "decision",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]
