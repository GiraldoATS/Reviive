from django.db import models

from apps.memories.models import Recuerdo


class MemorialDigital(models.Model):
    """RN-13: memorial privado por defecto."""

    class Visibilidad(models.TextChoices):
        PRIVADO = "privado", "Privado"
        CON_ENLACE = "con_enlace", "Con enlace"
        PUBLICO = "publico", "Público"

    recuerdo = models.OneToOneField(
        Recuerdo, on_delete=models.CASCADE, related_name="memorial"
    )
    slug = models.SlugField(max_length=160, unique=True)
    visibilidad = models.CharField(
        max_length=16, choices=Visibilidad.choices, default=Visibilidad.PRIVADO
    )
    qr_url = models.URLField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.slug
