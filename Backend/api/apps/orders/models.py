import uuid

from django.conf import settings
from django.db import models

from apps.memories.models import Archivo
from apps.quotations.models import Cotizacion


class Pedido(models.Model):
    class Estado(models.TextChoices):
        RECIBIDO = "recibido", "Recibido"
        EN_EVALUACION = "en_evaluacion", "En evaluación"
        EN_PROCESO = "en_proceso", "En proceso"
        CONTROL_DE_CALIDAD = "control_de_calidad", "Control de calidad"
        EN_CAMINO = "en_camino", "En camino"
        ENTREGADO = "entregado", "Entregado"
        CANCELADO = "cancelado", "Cancelado"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pedidos"
    )
    cotizacion = models.OneToOneField(
        Cotizacion, on_delete=models.PROTECT, related_name="pedido"
    )
    codigo = models.CharField(max_length=32, unique=True)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.RECIBIDO)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.codigo


class EventoPedido(models.Model):
    """RN-06: recepción exige fotos+condición+fecha+responsable (evidencia)."""

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="eventos")
    estado = models.CharField(max_length=20, choices=Pedido.Estado.choices)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True)
    evidencia = models.ForeignKey(
        Archivo, on_delete=models.SET_NULL, null=True, blank=True, related_name="eventos_pedido"
    )
    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="eventos_registrados",
    )

    class Meta:
        ordering = ["fecha"]

    def __str__(self) -> str:
        return f"{self.pedido.codigo} → {self.estado}"
