from django.urls import path

from .views import RecomendarProductoView

urlpatterns = [
    path("ml/recomendar-producto", RecomendarProductoView.as_view()),
]
