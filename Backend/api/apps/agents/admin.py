from django.contrib import admin

from .models import EjecucionAgente


@admin.register(EjecucionAgente)
class EjecucionAgenteAdmin(admin.ModelAdmin):
    list_display = ["run_id", "agente", "estado", "evaluation_score", "creado_en"]
    list_filter = ["agente", "estado"]
