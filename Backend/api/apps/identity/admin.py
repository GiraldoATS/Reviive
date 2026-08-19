from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Perfil, Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ["email", "username", "rol", "estado", "is_staff"]
    fieldsets = UserAdmin.fieldsets + (("Reviive", {"fields": ("rol", "estado")}),)


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ["nombre", "usuario", "ciudad", "canal_preferido"]
