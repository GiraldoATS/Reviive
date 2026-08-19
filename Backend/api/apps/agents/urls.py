from django.urls import path

from .views import AgentRunCompleteView, AgentRunRequestView

urlpatterns = [
    path("agent-runs/request", AgentRunRequestView.as_view(), name="agent-runs-request"),
    path(
        "agent-runs/<uuid:run_id>/complete",
        AgentRunCompleteView.as_view(),
        name="agent-runs-complete",
    ),
]
