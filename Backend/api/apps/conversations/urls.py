from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ConversacionMensajesView, ConversacionViewSet

router = DefaultRouter()
router.register("conversations", ConversacionViewSet, basename="conversations")

urlpatterns = [
    path(
        "conversations/<uuid:conversacion_id>/messages",
        ConversacionMensajesView.as_view(),
        name="conversations-messages",
    ),
] + router.urls
