from django.contrib import admin

from .models import EventoPedido, Pedido


class EventoPedidoInline(admin.TabularInline):
    model = EventoPedido
    extra = 0


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ["codigo", "cliente", "estado", "total", "creado_en"]
    list_filter = ["estado"]
    inlines = [EventoPedidoInline]
