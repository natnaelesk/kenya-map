from rest_framework import serializers

from .models import CitizenReview, ImpactReport


class CitizenReviewSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)

    class Meta:
        model = CitizenReview
        fields = "__all__"
        read_only_fields = ["is_verified", "created_at", "updated_at"]


class ImpactReportSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)

    class Meta:
        model = ImpactReport
        fields = "__all__"
        read_only_fields = ["created_at"]
