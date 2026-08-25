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


class CasoPrueba(models.Model):
    """RN-12: una nueva versión de agente debe pasar un set mínimo de
    pruebas antes de publicarse. Sin un runner automático real todavía,
    el supervisor registra el caso y su resultado tras revisarlo a mano."""

    class Resultado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        APROBADO = "aprobado", "Aprobado"
        REQUIERE_REVISION = "requiere_revision", "Requiere revisión"

    agente = models.CharField(max_length=32, choices=EjecucionAgente.Agente.choices)
    nombre = models.CharField(max_length=200)
    entrada = models.TextField(help_text="Mensaje/escenario de entrada a probar.")
    resultado_esperado = models.TextField(blank=True, default="")
    resultado = models.CharField(max_length=20, choices=Resultado.choices, default=Resultado.PENDIENTE)
    notas = models.TextField(blank=True, default="")
    revisado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="casos_prueba_revisados"
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.nombre} ({self.resultado})"


class FuenteConocimiento(models.Model):
    """Documentos/fuentes reales que alimentan el contexto de los agentes
    (catálogo, políticas, FAQ) — antes admin/conocimiento mostraba fuentes
    inventadas."""

    class Estado(models.TextChoices):
        ACTIVA = "activa", "Activa"
        DESACTUALIZADA = "desactualizada", "Desactualizada"
        ARCHIVADA = "archivada", "Archivada"

    nombre = models.CharField(max_length=200)
    tipo = models.CharField(max_length=100, blank=True, default="")
    version = models.CharField(max_length=30, default="v1")
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.ACTIVA)
    url_o_referencia = models.CharField(max_length=500, blank=True, default="")
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.nombre} ({self.version})"


class CorreccionRespuesta(models.Model):
    """RN-11: una corrección sólo entra al dataset con aprobación de
    supervisor. Aquí el supervisor documenta qué estuvo mal en una
    respuesta real de un agente y cuál era la respuesta esperada."""

    class CategoriaError(models.TextChoices):
        INFORMACION_INCORRECTA = "informacion_incorrecta", "Información incorrecta"
        TONO_INADECUADO = "tono_inadecuado", "Tono inadecuado"
        REGLA_DE_NEGOCIO = "regla_de_negocio", "Violación de regla de negocio"
        FUERA_DE_ALCANCE = "fuera_de_alcance", "Fuera de alcance"
        OTRO = "otro", "Otro"

    class Decision(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        APROBAR_PARA_DATASET = "aprobar_para_dataset", "Aprobar para dataset"
        DESCARTAR = "descartar", "Descartar"

    ejecucion = models.ForeignKey(
        EjecucionAgente, on_delete=models.CASCADE, related_name="correcciones"
    )
    categoria_error = models.CharField(max_length=30, choices=CategoriaError.choices)
    respuesta_esperada = models.TextField()
    comentario = models.TextField(blank=True, default="")
    decision = models.CharField(max_length=20, choices=Decision.choices, default=Decision.PENDIENTE)
    revisado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="correcciones_revisadas"
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Corrección {self.id} ({self.decision})"
