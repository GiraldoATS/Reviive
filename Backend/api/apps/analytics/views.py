from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Pedido


class DashboardView(APIView):
    """GET /api/v1/analytics/dashboard — resumen para el panel administrativo."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        Usuario = get_user_model()
        hace_7_dias = timezone.now() - timedelta(days=7)

        por_estado = list(
            Pedido.objects.values("estado").annotate(total=Count("id")).order_by("estado")
        )
        tendencia = list(
            Pedido.objects.filter(creado_en__gte=hace_7_dias)
            .extra(select={"dia": "date(creado_en)"})
            .values("dia")
            .annotate(total=Count("id"))
            .order_by("dia")
        )

        return Response(
            {
                "pedidos_totales": Pedido.objects.count(),
                "en_proceso": Pedido.objects.filter(estado="en_proceso").count(),
                "entregados": Pedido.objects.filter(estado="entregado").count(),
                "nuevos_clientes": Usuario.objects.filter(
                    rol="cliente", date_joined__gte=hace_7_dias
                ).count(),
                "pedidos_por_estado": por_estado,
                "tendencia_pedidos": tendencia,
            }
        )
