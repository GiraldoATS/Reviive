from rest_framework import serializers

from .models import MemorialDigital


class MemorialDigitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemorialDigital
        fields = ["id", "recuerdo", "slug", "visibilidad", "qr_url", "creado_en"]
        read_only_fields = ["id", "qr_url", "creado_en"]
