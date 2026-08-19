from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.identity.urls")),
    path("api/v1/", include("apps.memories.urls")),
    path("api/v1/", include("apps.catalog.urls")),
    path("api/v1/", include("apps.providers.urls")),
    path("api/v1/", include("apps.conversations.urls")),
    path("api/v1/", include("apps.agents.urls")),
    path("api/v1/", include("apps.recommendations.urls")),
    path("api/v1/", include("apps.quotations.urls")),
    path("api/v1/", include("apps.orders.urls")),
    path("api/v1/", include("apps.memorials.urls")),
    path("api/v1/", include("apps.evaluations.urls")),
    path("api/v1/", include("apps.analytics.urls")),
]
