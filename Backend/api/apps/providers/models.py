from django.conf import settings
from django.db import models

from apps.catalog.models import Producto


class Proveedor(models.Model):
    """RN-05: proveedor externo no recibe objeto sin validación previa."""

    class EstadoValidacion(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        VALIDADO = "validado", "Validado"
        SUSPENDIDO = "suspendido", "Suspendido"

    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="proveedor"
    )
    nombre_taller = models.CharField(max_length=150)
    ciudad = models.CharField(max_length=100)
    estado_validacion = models.CharField(
        max_length=16,
        choices=EstadoValidacion.choices,
        default=EstadoValidacion.PENDIENTE,
    )
    calificacion = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    def __str__(self) -> str:
        return self.nombre_taller


class CapacidadProveedor(models.Model):
    """Qué puede restaurar un proveedor, en qué ciudad y en cuánto tiempo."""

    proveedor = models.ForeignKey(
        Proveedor, on_delete=models.CASCADE, related_name="capacidades"
    )
    producto = models.ForeignKey(
        Producto, on_delete=models.CASCADE, related_name="capacidades"
    )
    material = models.CharField(max_length=100, blank=True)
    ciudad = models.CharField(max_length=100)
    tiempo_estimado_dias = models.PositiveIntegerField(default=7)

    class Meta:
        unique_together = ["proveedor", "producto", "material"]

    def __str__(self) -> str:
        return f"{self.proveedor} → {self.producto}"
