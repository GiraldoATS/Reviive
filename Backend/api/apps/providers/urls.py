from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ProveedorViewSet, ProviderMatchView

router = DefaultRouter()
router.register("providers", ProveedorViewSet, basename="providers")

urlpatterns = [
    path("providers/match", ProviderMatchView.as_view(), name="providers-match"),
] + router.urls
