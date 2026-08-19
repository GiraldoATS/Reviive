from django.contrib import admin

from .models import Conversacion, Mensaje


class MensajeInline(admin.TabularInline):
    model = Mensaje
    extra = 0


@admin.register(Conversacion)
class ConversacionAdmin(admin.ModelAdmin):
    list_display = ["id", "usuario", "canal", "estado", "creada_en"]
    list_filter = ["canal", "estado"]
    inlines = [MensajeInline]
