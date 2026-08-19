import uuid

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pedido
from .serializers import EventoPedidoSerializer, PedidoSerializer


def _generar_codigo() -> str:
    return f"RV-{timezone.now().year}-{str(uuid.uuid4().int)[:4]}"


class PedidoViewSet(viewsets.ModelViewSet):
    """/api/v1/orders — RN-04: sin producción sin pedido confirmado."""

    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in {"administrador", "superadministrador"}:
            return Pedido.objects.all()
        if user.rol == "proveedor":
            return Pedido.objects.filter(cotizacion__proveedor__usuario=user)
        return Pedido.objects.filter(cliente=user)

    def perform_create(self, serializer):
        serializer.save(
            cliente=self.request.user,
            codigo=_generar_codigo(),
            total=serializer.validated_data["cotizacion"].total,
        )


class PedidoEventosView(APIView):
    """/api/v1/orders/{id}/events"""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pedido_id) -> Response:
        pedido = Pedido.objects.get(pk=pedido_id)
        return Response(EventoPedidoSerializer(pedido.eventos.all(), many=True).data)

    def post(self, request: Request, pedido_id) -> Response:
        pedido = Pedido.objects.get(pk=pedido_id)
        serializer = EventoPedidoSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(pedido=pedido)
        pedido.estado = serializer.validated_data["estado"]
        pedido.save(update_fields=["estado"])
        return Response(serializer.data, status=status.HTTP_201_CREATED)
