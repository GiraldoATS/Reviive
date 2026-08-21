from django.db import models


class Producto(models.Model):
    """Línea de servicio del portafolio (mín. 5 exigidas por el enunciado académico).

    NOTA: la búsqueda semántica del catálogo (embeddings) queda documentada en la
    arquitectura pero diferida de este entorno: la base de datos de negocio es
    MySQL y no ofrece un tipo vectorial nativo. Si se retoma, se resolverá con un
    servicio de búsqueda externo (p. ej. un índice vectorial dedicado) en lugar
    de un campo en este modelo.
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
