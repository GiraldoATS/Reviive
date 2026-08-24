from django.contrib import admin

from .models import Producto


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ["nombre", "categoria", "precio_base", "imagen_url", "activo"]
    list_filter = ["categoria", "activo"]
    fields = ["nombre", "categoria", "descripcion", "precio_base", "icono", "imagen_url", "activo"]
