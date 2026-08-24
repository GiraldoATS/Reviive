from django.contrib import admin

from .models import MensajeContacto


@admin.register(MensajeContacto)
class MensajeContactoAdmin(admin.ModelAdmin):
    list_display = ["nombre", "correo", "motivo", "atendido", "creado_en"]
    list_filter = ["motivo", "atendido"]
    search_fields = ["nombre", "correo", "mensaje"]
    readonly_fields = ["nombre", "correo", "telefono", "motivo", "mensaje", "foto_base64", "creado_en"]
