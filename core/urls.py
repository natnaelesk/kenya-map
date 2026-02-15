from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"election-cycles", views.ElectionCycleViewSet)
router.register(r"sectors", views.SectorViewSet)
router.register(r"sub-counties", views.SubCountyViewSet)
router.register(r"wards", views.WardViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/", views.dashboard_summary, name="dashboard-summary"),
]
