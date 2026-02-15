from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"reviews", views.CitizenReviewViewSet)
router.register(r"impact-reports", views.ImpactReportViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
