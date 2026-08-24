from decimal import Decimal

from django.db import models

from apps.orders.models import Pedido

COMISION_REVIIVE_PCT = Decimal("15.00")


class Pago(models.Model):
    """Liquidación real al proveedor por un pedido — cubre tanto el panel
    admin (pagos y comisiones) como el portal proveedor (ingresos)."""

    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        PAGADO = "pagado", "Pagado"

    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE, related_name="pago")
    monto_bruto = models.DecimalField(max_digits=12, decimal_places=2)
    comision_pct = models.DecimalField(max_digits=5, decimal_places=2, default=COMISION_REVIIVE_PCT)
    monto_neto = models.DecimalField(max_digits=12, decimal_places=2)
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.PENDIENTE)
    fecha_estimada = models.DateField(null=True, blank=True)
    fecha_pago = models.DateTimeField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Pago {self.pedido.codigo} ({self.estado})"
