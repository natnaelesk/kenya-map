from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import CitizenReview, ImpactReport
from .serializers import CitizenReviewSerializer, ImpactReportSerializer


class CitizenReviewViewSet(viewsets.ModelViewSet):
    queryset = CitizenReview.objects.select_related(
        "expenditure", "project", "ward"
    ).all()
    serializer_class = CitizenReviewSerializer
    permission_classes = [AllowAny]
    filterset_fields = ["expenditure", "project", "ward", "rating", "is_verified"]


class ImpactReportViewSet(viewsets.ModelViewSet):
    queryset = ImpactReport.objects.select_related("project", "ward").all()
    serializer_class = ImpactReportSerializer
    permission_classes = [AllowAny]
    filterset_fields = ["project", "ward", "is_positive"]
