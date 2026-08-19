from rest_framework.routers import DefaultRouter

from .views import ProductoViewSet

router = DefaultRouter()
router.register("products", ProductoViewSet, basename="products")

urlpatterns = router.urls
