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
    # Servicio del catalogo al que aplica (nulo en cotizaciones antiguas
    # creadas antes de este campo).
    producto = models.ForeignKey(
        "catalog.Producto",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cotizaciones",
    )
    # Si viene de un borrador generado por el agente Cotizacion (n8n), para
    # poder auditar el origen. Nula en las que crea directamente un proveedor/admin.
    ejecucion_agente = models.ForeignKey(
        "agents.EjecucionAgente",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cotizaciones",
    )
    total = models.DecimalField(max_digits=12, decimal_places=2)
    vigencia = models.DateField()
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.BORRADOR)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Cotización {self.id} ({self.estado})"
