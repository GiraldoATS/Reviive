from decimal import Decimal

from django.db import models

from apps.orders.models import Pedido
from apps.quotations.models import Cotizacion

COMISION_REVIIVE_PCT = Decimal("15.00")


class PagoCliente(models.Model):
    """Cobro real al CLIENTE por una cotización aceptada (Mercado Pago) —
    distinto de Pago, que es la liquidación interna Reviive → proveedor.
    RN-04: el pedido sólo nace cuando este pago queda 'aprobado' de
    verdad (confirmado contra la API de Mercado Pago, nunca sólo por lo
    que diga la URL de retorno del navegador)."""

    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        APROBADO = "aprobado", "Aprobado"
        RECHAZADO = "rechazado", "Rechazado"

    cotizacion = models.OneToOneField(
        Cotizacion, on_delete=models.CASCADE, related_name="pago_cliente"
    )
    preference_id = models.CharField(max_length=120, unique=True)
    payment_id = models.CharField(max_length=120, blank=True, default="")
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.PENDIENTE)
    creado_en = models.DateTimeField(auto_now_add=True)
    pagado_en = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"Pago cliente {self.cotizacion_id} ({self.estado})"


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
