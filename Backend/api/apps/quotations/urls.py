from rest_framework.routers import DefaultRouter

from .views import CotizacionViewSet

router = DefaultRouter()
router.register("quotations", CotizacionViewSet, basename="quotations")

urlpatterns = router.urls
