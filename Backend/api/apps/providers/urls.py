from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import DiasBloqueadosView, ProveedorMeView, ProveedorViewSet, ProviderMatchView

router = DefaultRouter()
router.register("providers", ProveedorViewSet, basename="providers")

urlpatterns = [
    path("providers/match", ProviderMatchView.as_view(), name="providers-match"),
    path("providers/me/", ProveedorMeView.as_view(), name="providers-me"),
    path("providers/me/dias-bloqueados", DiasBloqueadosView.as_view(), name="providers-dias-bloqueados"),
] + router.urls
