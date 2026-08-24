from rest_framework.routers import DefaultRouter

from .views import EjemploDatasetViewSet, EvaluacionViewSet

router = DefaultRouter()
router.register("dataset-examples", EjemploDatasetViewSet, basename="dataset-examples")
router.register("evaluations", EvaluacionViewSet, basename="evaluations")

urlpatterns = router.urls
