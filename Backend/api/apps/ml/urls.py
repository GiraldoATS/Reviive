from django.urls import path

from .views import MasExploradosView, MetricasModeloView, RecomendarProductoView

urlpatterns = [
    path("ml/recomendar-producto", RecomendarProductoView.as_view()),
    path("ml/mas-explorados", MasExploradosView.as_view()),
    path("ml/metricas", MetricasModeloView.as_view()),
]
