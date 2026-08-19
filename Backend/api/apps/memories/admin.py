from django.contrib import admin

from .models import Archivo, ObjetoMemoria, Recuerdo


@admin.register(Recuerdo)
class RecuerdoAdmin(admin.ModelAdmin):
    list_display = ["id", "cliente", "persona_recordada", "privacidad", "creado_en"]


@admin.register(ObjetoMemoria)
class ObjetoMemoriaAdmin(admin.ModelAdmin):
    list_display = ["id", "recuerdo", "tipo", "estado"]


@admin.register(Archivo)
class ArchivoAdmin(admin.ModelAdmin):
    list_display = ["id", "propietario", "tipo", "creado_en"]
