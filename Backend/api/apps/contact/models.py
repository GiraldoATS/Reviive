from django.db import models


class MensajeContacto(models.Model):
    """Mensaje enviado desde el formulario público de /contacto."""

    class Motivo(models.TextChoices):
        RESTAURACION = "restauracion", "Restauración"
        PRESERVACION = "preservacion", "Preservación"
        TRANSFORMACION = "transformacion", "Transformación"
        OTRA = "otra", "Otra consulta"

    nombre = models.CharField(max_length=150)
    correo = models.EmailField()
    telefono = models.CharField(max_length=30, blank=True, default="")
    motivo = models.CharField(max_length=20, choices=Motivo.choices, blank=True, default="")
    mensaje = models.TextField()
    foto_base64 = models.TextField(blank=True, default="")
    atendido = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-creado_en"]

    def __str__(self) -> str:
        return f"{self.nombre} ({self.correo})"
