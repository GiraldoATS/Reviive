from rest_framework.routers import DefaultRouter

from .views import RecomendacionViewSet

router = DefaultRouter()
router.register("recommendations", RecomendacionViewSet, basename="recommendations")

urlpatterns = router.urls
