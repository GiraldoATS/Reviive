from rest_framework.routers import DefaultRouter

from .views import AssetPresignView
from .views import RecuerdoViewSet
from django.urls import path

router = DefaultRouter()
router.register("memories", RecuerdoViewSet, basename="memories")

urlpatterns = [
    path("assets/presign", AssetPresignView.as_view(), name="assets-presign"),
] + router.urls
