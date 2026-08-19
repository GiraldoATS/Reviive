from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Recomendacion
from .serializers import RecomendacionSerializer


class RecomendacionViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/recommendations?recuerdo=<uuid>"""

    serializer_class = RecomendacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Recomendacion.objects.filter(recuerdo__cliente=self.request.user)
        recuerdo_id = self.request.query_params.get("recuerdo")
        if recuerdo_id:
            queryset = queryset.filter(recuerdo_id=recuerdo_id)
        return queryset
