from rest_framework.routers import DefaultRouter

from .views import EjemploDatasetViewSet

router = DefaultRouter()
router.register("dataset-examples", EjemploDatasetViewSet, basename="dataset-examples")

urlpatterns = router.urls
