from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"governors", views.GovernorViewSet)
router.register(r"governor-metrics", views.GovernorPerformanceMetricViewSet)
router.register(r"mps", views.MemberOfParliamentViewSet)
router.register(r"mp-activities", views.MPActivityViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("governor-comparison/", views.governor_comparison, name="governor-comparison"),
    path("mp-comparison/", views.mp_comparison, name="mp-comparison"),
    path("mp-deep-dive/<int:pk>/", views.mp_deep_dive, name="mp-deep-dive"),
]
