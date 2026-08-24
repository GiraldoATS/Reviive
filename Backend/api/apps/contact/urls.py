from django.urls import path

from .views import MensajeContactoCreateView

urlpatterns = [
    path("contacto/mensajes", MensajeContactoCreateView.as_view(), name="contacto-mensajes"),
]
