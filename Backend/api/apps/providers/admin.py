from django.contrib import admin

from .models import CapacidadProveedor, Proveedor


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ["nombre_taller", "ciudad", "estado_validacion", "calificacion"]
    list_filter = ["estado_validacion", "ciudad"]


@admin.register(CapacidadProveedor)
class CapacidadProveedorAdmin(admin.ModelAdmin):
    list_display = ["proveedor", "producto", "ciudad", "tiempo_estimado_dias"]
