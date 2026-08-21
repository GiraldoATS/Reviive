from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MemorialDigitalViewSet, MemorialPublicoPorSlugView

router = DefaultRouter()
router.register("memorials", MemorialDigitalViewSet, basename="memorials")

urlpatterns = [
    path("memorials/by-slug/<slug:slug>/", MemorialPublicoPorSlugView.as_view(), name="memorials-by-slug"),
] + router.urls
