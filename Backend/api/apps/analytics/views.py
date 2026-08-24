from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Sum
from django.utils import timezone
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Pedido

ROLES_PANEL_ADMIN = {"administrador", "superadministrador", "supervisor_ia"}


class EsStaffAdministrativo(BasePermission):
    """Sólo staff/roles administrativos ven métricas agregadas del negocio."""

    def has_permission(self, request, view) -> bool:
        user = request.user
        return user.is_authenticated and (user.is_staff or user.rol in ROLES_PANEL_ADMIN)


class DashboardView(APIView):
    """GET /api/v1/analytics/dashboard — resumen para el panel administrativo."""

    permission_classes = [EsStaffAdministrativo]

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

        agregados = Pedido.objects.aggregate(ingresos=Sum("total"), ticket_promedio=Avg("total"))

        return Response(
            {
                "pedidos_totales": Pedido.objects.count(),
                "en_proceso": Pedido.objects.filter(estado="en_proceso").count(),
                "entregados": Pedido.objects.filter(estado="entregado").count(),
                "nuevos_clientes": Usuario.objects.filter(
                    rol="cliente", date_joined__gte=hace_7_dias
                ).count(),
                "ingresos_totales": agregados["ingresos"] or 0,
                "ticket_promedio": agregados["ticket_promedio"] or 0,
                "pedidos_por_estado": por_estado,
                "tendencia_pedidos": tendencia,
            }
        )
