from django.urls import path

from .views import DashboardView

urlpatterns = [
    path("analytics/dashboard", DashboardView.as_view(), name="analytics-dashboard"),
]
