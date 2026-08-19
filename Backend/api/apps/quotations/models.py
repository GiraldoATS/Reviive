import uuid

from django.db import models

from apps.memories.models import Recuerdo
from apps.providers.models import Proveedor


class Cotizacion(models.Model):
    """RN-04: sin producción sin pedido confirmado (la cotización no implica producción)."""

    class Estado(models.TextChoices):
        BORRADOR = "borrador", "Borrador"
        ENVIADA = "enviada", "Enviada"
        ACEPTADA = "aceptada", "Aceptada"
        VENCIDA = "vencida", "Vencida"
        RECHAZADA = "rechazada", "Rechazada"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recuerdo = models.ForeignKey(
        Recuerdo, on_delete=models.CASCADE, related_name="cotizaciones"
    )
    proveedor = models.ForeignKey(
        Proveedor, on_delete=models.CASCADE, related_name="cotizaciones"
    )
    total = models.DecimalField(max_digits=12, decimal_places=2)
    vigencia = models.DateField()
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.BORRADOR)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Cotización {self.id} ({self.estado})"
