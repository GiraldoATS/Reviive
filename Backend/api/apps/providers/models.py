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
    # Configuración real del taller (antes sólo visual en el portal proveedor).
    direccion = models.CharField(max_length=200, blank=True, default="")
    descripcion = models.TextField(blank=True, default="")
    anios_experiencia = models.CharField(max_length=50, blank=True, default="")
    horario_atencion = models.TextField(blank=True, default="")
    capacidad_maxima = models.PositiveIntegerField(
        default=5, help_text="Pedidos simultáneos que el taller puede atender."
    )
    disponible = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.nombre_taller


class DocumentoProveedor(models.Model):
    """Documentos de validación del taller (RN-05: sin validación no recibe
    objetos). Sin bucket S3/MinIO real en este entorno, se guarda como
    data URL base64 -- mismo camino ya usado en ObjetoMemoria.fotos_base64
    y EventoPedido.evidencias_base64."""

    class Tipo(models.TextChoices):
        PORTAFOLIO = "portafolio", "Portafolio"
        DOCUMENTO_LEGAL = "documento_legal", "Documento legal"

    class EstadoRevision(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        APROBADO = "aprobado", "Aprobado"
        RECHAZADO = "rechazado", "Rechazado"

    proveedor = models.ForeignKey(
        Proveedor, on_delete=models.CASCADE, related_name="documentos"
    )
    tipo = models.CharField(max_length=20, choices=Tipo.choices)
    nombre_archivo = models.CharField(max_length=255, blank=True, default="")
    archivo_base64 = models.TextField()
    estado_revision = models.CharField(
        max_length=16, choices=EstadoRevision.choices, default=EstadoRevision.PENDIENTE
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.get_tipo_display()} de {self.proveedor} ({self.estado_revision})"


class DiaBloqueadoProveedor(models.Model):
    """Fechas en las que un proveedor no puede recibir nuevos pedidos."""

    proveedor = models.ForeignKey(
        Proveedor, on_delete=models.CASCADE, related_name="dias_bloqueados"
    )
    fecha = models.DateField()

    class Meta:
        unique_together = ["proveedor", "fecha"]
        ordering = ["fecha"]

    def __str__(self) -> str:
        return f"{self.proveedor} bloqueado el {self.fecha}"


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
