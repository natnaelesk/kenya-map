from rest_framework import serializers

from .models import Governor, GovernorPerformanceMetric, MemberOfParliament, MPActivity


class GovernorSerializer(serializers.ModelSerializer):
    election_cycle_name = serializers.CharField(
        source="election_cycle.name", read_only=True
    )

    class Meta:
        model = Governor
        fields = "__all__"


class GovernorPerformanceMetricSerializer(serializers.ModelSerializer):
    governor_name = serializers.CharField(source="governor.name", read_only=True)

    class Meta:
        model = GovernorPerformanceMetric
        fields = "__all__"


class MPActivitySerializer(serializers.ModelSerializer):
    mp_name = serializers.CharField(source="mp.name", read_only=True)

    class Meta:
        model = MPActivity
        fields = "__all__"


class MemberOfParliamentSerializer(serializers.ModelSerializer):
    sub_county_name = serializers.CharField(source="sub_county.name", read_only=True)
    election_cycle_name = serializers.CharField(
        source="election_cycle.name", read_only=True
    )
    total_activities = serializers.IntegerField(
        source="activities.count", read_only=True
    )
    weddings_attended = serializers.SerializerMethodField()
    constituency_visits = serializers.SerializerMethodField()

    class Meta:
        model = MemberOfParliament
        fields = "__all__"

    def get_weddings_attended(self, obj):
        return obj.activities.filter(activity_type="wedding_attended").count()

    def get_constituency_visits(self, obj):
        return obj.activities.filter(activity_type="constituency_visit").count()


class MPComparisonSerializer(serializers.Serializer):
    """Serializer for comparing MPs across election cycles."""

    sub_county = serializers.CharField()
    mps = MemberOfParliamentSerializer(many=True)
