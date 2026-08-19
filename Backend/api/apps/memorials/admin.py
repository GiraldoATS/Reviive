from django.contrib import admin

from .models import MemorialDigital


@admin.register(MemorialDigital)
class MemorialDigitalAdmin(admin.ModelAdmin):
    list_display = ["slug", "recuerdo", "visibilidad", "creado_en"]
