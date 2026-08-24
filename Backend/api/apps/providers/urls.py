from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ProveedorMeView, ProveedorViewSet, ProviderMatchView

router = DefaultRouter()
router.register("providers", ProveedorViewSet, basename="providers")

urlpatterns = [
    path("providers/match", ProviderMatchView.as_view(), name="providers-match"),
    path("providers/me/", ProveedorMeView.as_view(), name="providers-me"),
] + router.urls
