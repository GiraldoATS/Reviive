from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AgentesResumenView,
    AuditoriaView,
    CasoPruebaViewSet,
    CorreccionRespuestaViewSet,
    EjecucionesPendientesRevisionView,
    EjemploDatasetViewSet,
    EvaluacionViewSet,
    FuenteConocimientoViewSet,
    ResumenSupervisionView,
)

router = DefaultRouter()
router.register("dataset-examples", EjemploDatasetViewSet, basename="dataset-examples")
router.register("evaluations", EvaluacionViewSet, basename="evaluations")
router.register("test-cases", CasoPruebaViewSet, basename="test-cases")
router.register("knowledge-sources", FuenteConocimientoViewSet, basename="knowledge-sources")
router.register("corrections", CorreccionRespuestaViewSet, basename="corrections")

urlpatterns = [
    path("supervision/resumen", ResumenSupervisionView.as_view(), name="supervision-resumen"),
    path("supervision/agentes", AgentesResumenView.as_view(), name="supervision-agentes"),
    path("supervision/auditoria", AuditoriaView.as_view(), name="supervision-auditoria"),
    path(
        "corrections/pendientes",
        EjecucionesPendientesRevisionView.as_view(),
        name="corrections-pendientes",
    ),
] + router.urls
