from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Budget, Expenditure, FundSource, MegaDamProject, Project
from .serializers import (
    BudgetSerializer,
    ExpenditureSerializer,
    FundSourceSerializer,
    MegaDamProjectSerializer,
    ProjectSerializer,
)


class FundSourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FundSource.objects.all()
    serializer_class = FundSourceSerializer


class BudgetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Budget.objects.select_related(
        "ward", "sub_county", "sector", "fund_source", "election_cycle"
    ).all()
    serializer_class = BudgetSerializer
    filterset_fields = [
        "financial_year", "ward", "sub_county", "sector",
        "fund_source", "election_cycle",
    ]
    search_fields = ["financial_year"]


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.select_related(
        "ward", "sub_county", "sector", "fund_source", "election_cycle"
    ).prefetch_related("reviews").all()
    serializer_class = ProjectSerializer
    filterset_fields = [
        "ward", "sub_county", "sector", "fund_source",
        "election_cycle", "status",
    ]
    search_fields = ["name", "description", "contractor"]


class ExpenditureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Expenditure.objects.select_related(
        "project", "ward", "sector"
    ).prefetch_related("reviews").all()
    serializer_class = ExpenditureSerializer
    filterset_fields = [
        "ward", "sector", "requires_citizen_review", "project",
    ]
    search_fields = ["description", "payee"]


class MegaDamProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MegaDamProject.objects.select_related(
        "project", "project__ward"
    ).all()
    serializer_class = MegaDamProjectSerializer


@api_view(["GET"])
def fund_source_summary(request):
    """Breakdown of spending by fund source (NGCDF, KURA, KeRRA, etc.)."""
    sources = FundSource.objects.annotate(
        total_allocated=Sum("budgets__allocated_amount"),
        total_spent=Sum("budgets__spent_amount"),
    )
    data = []
    for src in sources:
        data.append({
            "id": src.id,
            "name": src.name,
            "fund_type": src.fund_type,
            "total_allocated": src.total_allocated or 0,
            "total_spent": src.total_spent or 0,
            "project_count": Project.objects.filter(fund_source=src).count(),
        })
    return Response(data)


@api_view(["GET"])
def ward_spending(request):
    """Spending summary grouped by ward."""
    from core.models import Ward

    wards = Ward.objects.select_related("sub_county").all()
    data = []
    for ward in wards:
        budgets = Budget.objects.filter(ward=ward)
        total_allocated = budgets.aggregate(t=Sum("allocated_amount"))["t"] or 0
        total_spent = budgets.aggregate(t=Sum("spent_amount"))["t"] or 0
        data.append({
            "ward_id": ward.id,
            "ward_name": ward.name,
            "sub_county": ward.sub_county.name,
            "latitude": ward.latitude,
            "longitude": ward.longitude,
            "total_allocated": total_allocated,
            "total_spent": total_spent,
            "project_count": Project.objects.filter(ward=ward).count(),
        })
    return Response(data)


@api_view(["GET"])
def yearly_spending(request):
    """Year-by-year spending trends."""
    budgets = Budget.objects.values("financial_year").annotate(
        total_allocated=Sum("allocated_amount"),
        total_disbursed=Sum("disbursed_amount"),
        total_spent=Sum("spent_amount"),
    ).order_by("financial_year")
    return Response(list(budgets))
