from django.conf import settings
from django.db import models

from apps.agents.models import EjecucionAgente
from apps.conversations.models import Conversacion


class Evaluacion(models.Model):
    class Tipo(models.TextChoices):
        AUTOMATICA = "automatica", "Automática"
        SUPERVISOR = "supervisor", "Revisión de supervisor"

    ejecucion = models.ForeignKey(
        EjecucionAgente, on_delete=models.CASCADE, related_name="evaluaciones"
    )
    tipo = models.CharField(max_length=16, choices=Tipo.choices, default=Tipo.AUTOMATICA)
    puntaje = models.DecimalField(max_digits=4, decimal_places=3)
    requiere_revision = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Evaluación {self.id} ({self.tipo})"


class EjemploDataset(models.Model):
    """RN-09: conversación sensible no entrena sin anonimizar.
    RN-11: corrección sólo entra al dataset con aprobación de supervisor.
    """

    class EstadoRevision(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        APROBADO = "aprobado", "Aprobado"
        RECHAZADO = "rechazado", "Rechazado"

    conversacion = models.ForeignKey(
        Conversacion, on_delete=models.CASCADE, related_name="ejemplos_dataset"
    )
    etiqueta = models.CharField(max_length=100, blank=True)
    anonimizado = models.BooleanField(default=False)
    estado_revision = models.CharField(
        max_length=16, choices=EstadoRevision.choices, default=EstadoRevision.PENDIENTE
    )
    aprobado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ejemplos_aprobados",
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"EjemploDataset {self.id} ({self.estado_revision})"
