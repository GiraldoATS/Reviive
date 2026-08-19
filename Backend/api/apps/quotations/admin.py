from django.contrib import admin

from .models import Cotizacion


@admin.register(Cotizacion)
class CotizacionAdmin(admin.ModelAdmin):
    list_display = ["id", "recuerdo", "proveedor", "total", "estado", "vigencia"]
    list_filter = ["estado"]
