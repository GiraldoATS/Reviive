from django.urls import path

from .views import ClientesView, DashboardView

urlpatterns = [
    path("analytics/dashboard", DashboardView.as_view(), name="analytics-dashboard"),
    path("analytics/clientes", ClientesView.as_view(), name="analytics-clientes"),
]
