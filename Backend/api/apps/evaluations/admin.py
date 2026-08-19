from django.contrib import admin

from .models import EjemploDataset, Evaluacion


@admin.register(Evaluacion)
class EvaluacionAdmin(admin.ModelAdmin):
    list_display = ["id", "ejecucion", "tipo", "puntaje", "requiere_revision"]


@admin.register(EjemploDataset)
class EjemploDatasetAdmin(admin.ModelAdmin):
    list_display = ["id", "conversacion", "estado_revision", "anonimizado"]
    list_filter = ["estado_revision", "anonimizado"]
