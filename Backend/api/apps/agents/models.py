import uuid

from django.db import models

from apps.conversations.models import Conversacion


class EjecucionAgente(models.Model):
    """Traza de una ejecución de agente orquestada por n8n.

    n8n hace todo el trabajo de IA; este modelo es sólo el registro/auditoría
    que Django expone vía API (agent-runs/request y agent-runs/{id}/complete).
    """

    class Agente(models.TextChoices):
        ORQUESTADOR = "orquestador", "Orquestador"
        ACOMPANAMIENTO = "acompanamiento", "Acompañamiento"
        EXTRACCION = "extraccion", "Extracción"
        CREATIVO = "creativo", "Creativo"
        VIABILIDAD = "viabilidad", "Viabilidad"
        RECOMENDACION = "recomendacion", "Recomendación"
        PROVEEDORES = "proveedores", "Proveedores"
        COTIZACION = "cotizacion", "Cotización"
        PEDIDOS = "pedidos", "Pedidos"
        MEMORIAL = "memorial", "Memorial"
        SEGURIDAD = "seguridad", "Seguridad"
        EVALUADOR = "evaluador", "Evaluador"

    class Estado(models.TextChoices):
        EN_PROGRESO = "en_progreso", "En progreso"
        COMPLETADO = "completado", "Completado"
        FALLIDO = "fallido", "Fallido"

    run_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Nulo para agentes que no ocurren dentro de un chat (recomendacion,
    # proveedores, cotizacion, pedidos, memorial se disparan desde otras
    # acciones del usuario, no desde una Conversacion).
    conversacion = models.ForeignKey(
        Conversacion,
        on_delete=models.CASCADE,
        related_name="ejecuciones_agente",
        null=True,
        blank=True,
    )
    agente = models.CharField(max_length=32, choices=Agente.choices)
    agent_version = models.CharField(max_length=32, default="v1")
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.EN_PROGRESO)

    reply = models.TextField(blank=True)
    structured_data = models.JSONField(default=dict, blank=True)
    tools_used = models.JSONField(default=list, blank=True)

    latencia_ms = models.PositiveIntegerField(null=True, blank=True)
    input_tokens = models.PositiveIntegerField(null=True, blank=True)
    output_tokens = models.PositiveIntegerField(null=True, blank=True)
    costo = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)

    evaluation_score = models.DecimalField(max_digits=4, decimal_places=3, null=True, blank=True)
    evaluation_flags = models.JSONField(default=list, blank=True)

    creado_en = models.DateTimeField(auto_now_add=True)
    completado_en = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.agente} · {self.run_id} · {self.estado}"
