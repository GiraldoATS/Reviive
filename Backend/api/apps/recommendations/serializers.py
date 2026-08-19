from rest_framework import serializers

from .models import Recomendacion


class RecomendacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recomendacion
        fields = [
            "id",
            "recuerdo",
            "producto",
            "titulo",
            "justificacion",
            "puntaje",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]
