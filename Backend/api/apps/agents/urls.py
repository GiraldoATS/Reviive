from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AgentRunCompleteView, AgentRunRequestView, EjecucionAgenteViewSet

router = DefaultRouter()
router.register("agent-runs", EjecucionAgenteViewSet, basename="agent-runs")

urlpatterns = [
    path("agent-runs/request", AgentRunRequestView.as_view(), name="agent-runs-request"),
    path(
        "agent-runs/<uuid:run_id>/complete",
        AgentRunCompleteView.as_view(),
        name="agent-runs-complete",
    ),
] + router.urls
