import uuid

from django.conf import settings
from django.db import models


class Archivo(models.Model):
    """Referencia a un binario en S3/MinIO. RN-06: recepción exige fotos+condición+fecha+responsable."""

    class Tipo(models.TextChoices):
        FOTO = "foto", "Foto"
        DOCUMENTO = "documento", "Documento"
        AUDIO = "audio", "Audio"
        VIDEO = "video", "Video"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    propietario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="archivos"
    )
    tipo = models.CharField(max_length=16, choices=Tipo.choices)
    url = models.URLField()
    checksum = models.CharField(max_length=64)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.tipo}:{self.id}"


class Recuerdo(models.Model):
    """RN-02: datos de fallecido no públicos por defecto."""

    class Privacidad(models.TextChoices):
        PRIVADO = "privado", "Privado"
        COMPARTIDO = "compartido", "Compartido"
        PUBLICO = "publico", "Público"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recuerdos"
    )
    persona_recordada = models.CharField(max_length=150, blank=True)
    historia = models.TextField(blank=True)
    privacidad = models.CharField(
        max_length=16, choices=Privacidad.choices, default=Privacidad.PRIVADO
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Recuerdo {self.id}"


class ObjetoMemoria(models.Model):
    recuerdo = models.ForeignKey(
        Recuerdo, on_delete=models.CASCADE, related_name="objetos"
    )
    tipo = models.CharField(max_length=100)
    material = models.CharField(max_length=100, blank=True)
    estado = models.CharField(max_length=100, blank=True)
    nivel_transformacion = models.CharField(max_length=100, blank=True)
    archivos = models.ManyToManyField(Archivo, blank=True, related_name="objetos_memoria")

    def __str__(self) -> str:
        return f"{self.tipo} ({self.recuerdo_id})"
