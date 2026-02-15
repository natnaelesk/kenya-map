from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path("api/officials/", include("officials.urls")),
    path("api/funds/", include("funds.urls")),
    path("api/citizens/", include("citizens.urls")),
]
