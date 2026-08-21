from rest_framework import serializers

from apps.catalog.serializers import ProductoSerializer

from .models import Recomendacion


class RecomendacionSerializer(serializers.ModelSerializer):
    """Sólo lectura (ver ReadOnlyModelViewSet): el agente de recomendación
    escribe estas filas como efecto de agent-runs/complete, no via API."""

    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = Recomendacion
        fields = [
            "id",
            "recuerdo",
            "producto",
            "titulo",
            "justificacion",
            "puntaje",
            "advertencias",
            "requiere_revision_humana",
            "creado_en",
        ]
        read_only_fields = ["id", "creado_en"]
