from django.db import models

from apps.catalog.models import Producto
from apps.memories.models import Recuerdo


class Recomendacion(models.Model):
    """RN-10: la IA no confirma precios/tiempos no oficiales, sólo sugiere."""

    recuerdo = models.ForeignKey(
        Recuerdo, on_delete=models.CASCADE, related_name="recomendaciones"
    )
    producto = models.ForeignKey(
        Producto, on_delete=models.CASCADE, related_name="recomendaciones"
    )
    titulo = models.CharField(max_length=200)
    justificacion = models.TextField(blank=True)
    puntaje = models.DecimalField(max_digits=4, decimal_places=3)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-puntaje"]

    def __str__(self) -> str:
        return f"{self.titulo} ({self.puntaje})"
