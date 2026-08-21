from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    """Usuario de la plataforma. AUTH_USER_MODEL.

    Se autentica por correo (no por username): toda la UX del producto
    (login, registro, recuperación de clave) gira alrededor del correo.
    """

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    email = models.EmailField("email address", unique=True)

    class Rol(models.TextChoices):
        VISITANTE = "visitante", "Visitante"
        CLIENTE = "cliente", "Cliente"
        PROVEEDOR = "proveedor", "Proveedor"
        CURADOR = "curador", "Curador"
        OPERADOR_LOGISTICO = "operador_logistico", "Operador logístico"
        ADMINISTRADOR = "administrador", "Administrador"
        SUPERVISOR_IA = "supervisor_ia", "Supervisor de IA"
        SUPERADMINISTRADOR = "superadministrador", "Superadministrador"

    class Estado(models.TextChoices):
        ACTIVO = "activo", "Activo"
        INACTIVO = "inactivo", "Inactivo"
        SUSPENDIDO = "suspendido", "Suspendido"

    rol = models.CharField(max_length=32, choices=Rol.choices, default=Rol.CLIENTE)
    estado = models.CharField(max_length=16, choices=Estado.choices, default=Estado.ACTIVO)

    def __str__(self) -> str:
        return f"{self.email} ({self.rol})"


class Perfil(models.Model):
    """Datos complementarios de un Usuario (RN-01: requiere consentimiento)."""

    class CanalPreferido(models.TextChoices):
        WEB = "web", "Web"
        TELEGRAM = "telegram", "Telegram"
        CORREO = "correo", "Correo"

    usuario = models.OneToOneField(
        Usuario, on_delete=models.CASCADE, related_name="perfil"
    )
    nombre = models.CharField(max_length=150)
    ciudad = models.CharField(max_length=100, blank=True)
    canal_preferido = models.CharField(
        max_length=16, choices=CanalPreferido.choices, default=CanalPreferido.WEB
    )
    consentimiento_datos = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.nombre
