from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Proveedor
from .serializers import MatchRequestSerializer, ProveedorSerializer


class ProveedorViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/providers — sólo proveedores validados son visibles (RN-05)."""

    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated]
    queryset = Proveedor.objects.filter(estado_validacion="validado")


class ProviderMatchView(APIView):
    """POST /api/v1/providers/match — sugiere proveedores para un producto/ciudad."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        payload = MatchRequestSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        producto_id = payload.validated_data["producto_id"]
        ciudad = payload.validated_data.get("ciudad")

        candidatos = Proveedor.objects.filter(
            estado_validacion="validado", capacidades__producto_id=producto_id
        )
        if ciudad:
            candidatos = candidatos.filter(ciudad__iexact=ciudad)
        candidatos = candidatos.order_by("-calificacion").distinct()

        return Response(ProveedorSerializer(candidatos, many=True).data)
