from django.db import models


class Producto(models.Model):
    """Línea de servicio del portafolio (mín. 5 exigidas por el enunciado académico).

    NOTA: el campo de embedding (pgvector) para búsqueda semántica del catálogo
    se documenta en la arquitectura pero se difiere de este entorno de desarrollo
    local porque la extensión `vector` no tiene binario oficial para PostgreSQL
    en Windows. Se reactiva en el despliegue con Docker (imagen pgvector/pgvector).
    """

    nombre = models.CharField(max_length=150)
    categoria = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio_base = models.DecimalField(max_digits=12, decimal_places=2)
    # Clave del set de íconos de línea fina del frontend (ver Frontend/src/components/icons.tsx)
    icono = models.CharField(max_length=32, default="tiempo")
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["nombre"]

    def __str__(self) -> str:
        return self.nombre
