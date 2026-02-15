from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import ElectionCycle, Sector, SubCounty, Ward
from .serializers import (
    ElectionCycleSerializer,
    SectorSerializer,
    SubCountySerializer,
    WardSerializer,
)


class ElectionCycleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ElectionCycle.objects.all()
    serializer_class = ElectionCycleSerializer


class SectorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer


class SubCountyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubCounty.objects.prefetch_related("wards").all()
    serializer_class = SubCountySerializer


class WardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ward.objects.select_related("sub_county").all()
    serializer_class = WardSerializer
    filterset_fields = ["sub_county"]


@api_view(["GET"])
def dashboard_summary(request):
    """High-level stats for the landing page."""
    from django.db.models import Sum

    from funds.models import Budget, Expenditure, Project

    total_budget = Budget.objects.aggregate(total=Sum("allocated_amount"))["total"] or 0
    total_spent = Budget.objects.aggregate(total=Sum("spent_amount"))["total"] or 0
    project_count = Project.objects.count()
    completed = Project.objects.filter(status="completed").count()
    flagged = Expenditure.objects.filter(requires_citizen_review=True).count()

    return Response({
        "total_budget": total_budget,
        "total_spent": total_spent,
        "project_count": project_count,
        "completed_projects": completed,
        "flagged_expenditures": flagged,
        "wards": Ward.objects.count(),
        "sub_counties": SubCounty.objects.count(),
    })
