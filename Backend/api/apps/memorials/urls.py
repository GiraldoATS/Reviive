from rest_framework.routers import DefaultRouter

from .views import MemorialDigitalViewSet

router = DefaultRouter()
router.register("memorials", MemorialDigitalViewSet, basename="memorials")

urlpatterns = router.urls
