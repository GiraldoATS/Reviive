from rest_framework.routers import DefaultRouter

from .views import PagoViewSet

router = DefaultRouter()
router.register("payments", PagoViewSet, basename="payments")

urlpatterns = router.urls
