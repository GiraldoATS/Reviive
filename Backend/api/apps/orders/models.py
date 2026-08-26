import uuid

from django.conf import settings
from django.db import models

from apps.memories.models import Archivo
from apps.quotations.models import Cotizacion


class Pedido(models.Model):
    class Estado(models.TextChoices):
        RECIBIDO = "recibido", "Recibido"
        EN_EVALUACION = "en_evaluacion", "En evaluación"
        EN_PROCESO = "en_proceso", "En proceso"
        CONTROL_DE_CALIDAD = "control_de_calidad", "Control de calidad"
        EN_CAMINO = "en_camino", "En camino"
        ENTREGADO = "entregado", "Entregado"
        CANCELADO = "cancelado", "Cancelado"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pedidos"
    )
    cotizacion = models.OneToOneField(
        Cotizacion, on_delete=models.PROTECT, related_name="pedido"
    )
    codigo = models.CharField(max_length=32, unique=True)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.RECIBIDO)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.codigo


class EventoPedido(models.Model):
    """RN-06: recepción exige fotos+condición+fecha+responsable (evidencia)."""

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="eventos")
    estado = models.CharField(max_length=20, choices=Pedido.Estado.choices)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True)
    evidencia = models.ForeignKey(
        Archivo, on_delete=models.SET_NULL, null=True, blank=True, related_name="eventos_pedido"
    )
    # Camino real que sí funciona sin bucket S3/MinIO (ver Archivo y el
    # mismo workaround en ObjetoMemoria.fotos_base64): fotos de evidencia
    # como data URLs, en vez de forzar el flujo roto de AssetPresignView.
    evidencias_base64 = models.JSONField(default=list, blank=True)
    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="eventos_registrados",
    )

    class Meta:
        ordering = ["fecha"]

    def __str__(self) -> str:
        return f"{self.pedido.codigo} → {self.estado}"


class Resena(models.Model):
    """RN-15: sólo se califica un pedido entregado/cerrado."""

    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE, related_name="resena")
    puntaje = models.PositiveSmallIntegerField()
    comentario = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Reseña {self.pedido.codigo} ({self.puntaje}/5)"


class MensajePedido(models.Model):
    """Mensajería real cliente↔proveedor por pedido (distinta del chat con
    Alma, que es exclusivo del asistente de IA)."""

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="mensajes")
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mensajes_pedido"
    )
    contenido = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["creado_en"]

    def __str__(self) -> str:
        return f"Mensaje {self.pedido.codigo} de {self.autor_id}"


class Envio(models.Model):
    """Datos reales de transporte de un pedido en camino/entregado (antes
    admin/logistica mostraba envíos 100% inventados)."""

    class Estado(models.TextChoices):
        PREPARANDO = "preparando", "Preparando"
        EN_TRANSITO = "en_transito", "En tránsito"
        ENTREGADO = "entregado", "Entregado"
        INCIDENCIA = "incidencia", "Con incidencia"

    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE, related_name="envio")
    transportadora = models.CharField(max_length=100, blank=True, default="")
    numero_guia = models.CharField(max_length=100, blank=True, default="")
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.PREPARANDO)
    fecha_estimada = models.DateField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Envío {self.pedido.codigo} ({self.estado})"


class Reclamacion(models.Model):
    """Queja/reclamo real de un cliente sobre un pedido (antes
    admin/reclamaciones mostraba datos 100% inventados)."""

    class Tipo(models.TextChoices):
        PRODUCTO = "producto", "Producto"
        SERVICIO = "servicio", "Servicio"
        ENVIO = "envio", "Envío"
        OTRO = "otro", "Otro"

    class Estado(models.TextChoices):
        ABIERTA = "abierta", "Abierta"
        EN_PROCESO = "en_proceso", "En proceso"
        RESUELTA = "resuelta", "Resuelta"

    class Prioridad(models.TextChoices):
        BAJA = "baja", "Baja"
        MEDIA = "media", "Media"
        ALTA = "alta", "Alta"

    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reclamaciones"
    )
    pedido = models.ForeignKey(
        Pedido, on_delete=models.SET_NULL, null=True, blank=True, related_name="reclamaciones"
    )
    tipo = models.CharField(max_length=16, choices=Tipo.choices, default=Tipo.OTRO)
    descripcion = models.TextField()
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.ABIERTA)
    prioridad = models.CharField(max_length=10, choices=Prioridad.choices, default=Prioridad.MEDIA)
    respuesta_staff = models.TextField(blank=True, default="")
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Reclamación {self.id} ({self.estado})"
