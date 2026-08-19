from django.db import models
from pgvector.django import HnswIndex, VectorField


class Producto(models.Model):
    """Línea de servicio del portafolio (mín. 5 exigidas por el enunciado académico)."""

    nombre = models.CharField(max_length=150)
    categoria = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio_base = models.DecimalField(max_digits=12, decimal_places=2)
    activo = models.BooleanField(default=True)
    # Embedding de nombre+descripción para búsqueda semántica del catálogo
    # (usado por el agente de recomendación). Se genera de forma asíncrona.
    embedding = VectorField(dimensions=1536, null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["nombre"]
        indexes = [
            HnswIndex(
                name="producto_embedding_hnsw",
                fields=["embedding"],
                m=16,
                ef_construction=64,
                opclasses=["vector_cosine_ops"],
            )
        ]

    def __str__(self) -> str:
        return self.nombre
