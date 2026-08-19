from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Producto
from .serializers import ProductoSerializer


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/products — catálogo público, sólo lectura."""

    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]
