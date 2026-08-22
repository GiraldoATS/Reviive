import uuid

from django.conf import settings
from django.db import models


class Conversacion(models.Model):
    class Canal(models.TextChoices):
        WEB = "web", "Web"
        TELEGRAM = "telegram", "Telegram"
        CORREO = "correo", "Correo"

    class Estado(models.TextChoices):
        ACTIVA = "activa", "Activa"
        PENDIENTE = "pendiente", "Pendiente"
        CERRADA = "cerrada", "Cerrada"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversaciones"
    )
    canal = models.CharField(max_length=16, choices=Canal.choices, default=Canal.WEB)
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.ACTIVA)
    intencion = models.CharField(max_length=100, blank=True)
    creada_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Conversación {self.id} ({self.canal})"


class Mensaje(models.Model):
    class Rol(models.TextChoices):
        USUARIO = "usuario", "Usuario"
        ALMA = "alma", "Alma"
        AGENTE_HUMANO = "agente_humano", "Agente humano"

    conversacion = models.ForeignKey(
        Conversacion, on_delete=models.CASCADE, related_name="mensajes"
    )
    rol = models.CharField(max_length=16, choices=Rol.choices)
    contenido = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    # Marca explícita de si este mensaje de usuario ya quedó incorporado en
    # una respuesta completada. No se puede inferir por orden cronológico:
    # cuando llegan varios mensajes casi al mismo tiempo, cada uno dispara su
    # propia ejecución de agente en paralelo y pueden completarse en un orden
    # distinto al que llegaron, así que la fecha por sí sola no basta para
    # saber cuáles siguen pendientes de respuesta.
    respondido = models.BooleanField(default=False)

    class Meta:
        ordering = ["fecha"]

    def __str__(self) -> str:
        return f"{self.rol}: {self.contenido[:40]}"
