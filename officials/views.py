from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import SubCounty
from .models import Governor, GovernorPerformanceMetric, MemberOfParliament, MPActivity
from .serializers import (
    GovernorPerformanceMetricSerializer,
    GovernorSerializer,
    MemberOfParliamentSerializer,
    MPActivitySerializer,
)


class GovernorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Governor.objects.select_related("election_cycle").all()
    serializer_class = GovernorSerializer
    filterset_fields = ["election_cycle"]


class GovernorPerformanceMetricViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GovernorPerformanceMetric.objects.select_related("governor").all()
    serializer_class = GovernorPerformanceMetricSerializer
    filterset_fields = ["governor", "year"]


class MemberOfParliamentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MemberOfParliament.objects.select_related(
        "sub_county", "election_cycle"
    ).prefetch_related("activities").all()
    serializer_class = MemberOfParliamentSerializer
    filterset_fields = ["sub_county", "election_cycle", "is_current"]


class MPActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MPActivity.objects.select_related("mp").all()
    serializer_class = MPActivitySerializer
    filterset_fields = ["mp", "activity_type"]


@api_view(["GET"])
def governor_comparison(request):
    """Compare governors across all election cycles."""
    governors = Governor.objects.select_related("election_cycle").prefetch_related(
        "metrics"
    ).all()
    data = []
    for gov in governors:
        metrics = GovernorPerformanceMetricSerializer(
            gov.metrics.all(), many=True
        ).data
        data.append({
            **GovernorSerializer(gov).data,
            "metrics": metrics,
        })
    return Response(data)


@api_view(["GET"])
def mp_comparison(request):
    """Compare MPs across election cycles, grouped by constituency."""
    sub_counties = SubCounty.objects.all()
    data = []
    for sc in sub_counties:
        mps = MemberOfParliament.objects.filter(sub_county=sc).select_related(
            "election_cycle"
        ).annotate(
            total_activities=Count("activities"),
            weddings=Count("activities", filter=Q(activities__activity_type="wedding_attended")),
            visits=Count("activities", filter=Q(activities__activity_type="constituency_visit")),
        )
        mp_data = []
        for mp in mps:
            mp_serialized = MemberOfParliamentSerializer(mp).data
            mp_serialized["weddings_attended"] = mp.weddings
            mp_serialized["constituency_visits"] = mp.visits
            mp_data.append(mp_serialized)
        data.append({
            "sub_county": sc.name,
            "mps": mp_data,
        })
    return Response(data)


@api_view(["GET"])
def mp_deep_dive(request, pk):
    """Detailed MP profile with all activity breakdowns."""
    try:
        mp = MemberOfParliament.objects.select_related(
            "sub_county", "election_cycle"
        ).get(pk=pk)
    except MemberOfParliament.DoesNotExist:
        return Response({"error": "MP not found"}, status=404)

    activities = mp.activities.all()
    activity_summary = {}
    for atype, label in MPActivity.ACTIVITY_TYPES:
        activity_summary[atype] = {
            "label": label,
            "count": activities.filter(activity_type=atype).count(),
        }

    return Response({
        "mp": MemberOfParliamentSerializer(mp).data,
        "activity_summary": activity_summary,
        "recent_activities": MPActivitySerializer(activities[:20], many=True).data,
    })
