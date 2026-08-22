from rest_framework import serializers

from .models import EjecucionAgente


class AgentRunRequestSerializer(serializers.Serializer):
    # Sólo los agentes conversacionales (orquestador, acompanamiento, ...)
    # se atan a una Conversacion; los demás (recomendacion, proveedores...)
    # se disparan desde otras acciones y no tienen una.
    conversacion_id = serializers.UUIDField(required=False, allow_null=True)
    agente = serializers.ChoiceField(choices=EjecucionAgente.Agente.choices)
    agent_version = serializers.CharField(default="v1")


class AgentRunMetricsSerializer(serializers.Serializer):
    latency_ms = serializers.IntegerField(required=False)
    input_tokens = serializers.IntegerField(required=False)
    output_tokens = serializers.IntegerField(required=False)


class AgentRunEvaluationSerializer(serializers.Serializer):
    score = serializers.DecimalField(max_digits=4, decimal_places=3, required=False)
    flags = serializers.ListField(child=serializers.CharField(), required=False, default=list)


class AgentRunCompleteSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["completado", "fallido"])
    reply = serializers.CharField(required=False, allow_blank=True, default="")
    structured_data = serializers.JSONField(required=False, default=dict)
    tools_used = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    metrics = AgentRunMetricsSerializer(required=False)
    evaluation = AgentRunEvaluationSerializer(required=False)
    # IDs de los Mensaje (rol=usuario) que este agente ya tuvo en cuenta al
    # generar `reply`. El orquestador los marca como respondido=True para
    # que el chequeo de ráfaga en n8n sepa cuáles siguen realmente pendientes.
    mensajes_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, default=list
    )


class EjecucionAgenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjecucionAgente
        fields = [
            "run_id",
            "agente",
            "agent_version",
            "estado",
            "reply",
            "structured_data",
            "tools_used",
            "latencia_ms",
            "input_tokens",
            "output_tokens",
            "evaluation_score",
            "evaluation_flags",
            "creado_en",
            "completado_en",
        ]
