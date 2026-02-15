from rest_framework import serializers

from .models import Budget, Expenditure, FundSource, MegaDamProject, Project


class FundSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundSource
        fields = "__all__"


class BudgetSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)
    sub_county_name = serializers.CharField(
        source="sub_county.name", read_only=True, default=None
    )
    sector_name = serializers.CharField(source="sector.name", read_only=True)
    fund_source_name = serializers.CharField(source="fund_source.name", read_only=True)
    absorption_rate = serializers.ReadOnlyField()

    class Meta:
        model = Budget
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)
    sub_county_name = serializers.CharField(
        source="sub_county.name", read_only=True, default=None
    )
    sector_name = serializers.CharField(source="sector.name", read_only=True)
    fund_source_name = serializers.CharField(source="fund_source.name", read_only=True)
    is_over_budget = serializers.ReadOnlyField()
    citizen_impact_score = serializers.ReadOnlyField()
    review_count = serializers.IntegerField(source="reviews.count", read_only=True)

    class Meta:
        model = Project
        fields = "__all__"


class ExpenditureSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(
        source="project.name", read_only=True, default=None
    )
    ward_name = serializers.CharField(source="ward.name", read_only=True, default=None)
    sector_name = serializers.CharField(
        source="sector.name", read_only=True, default=None
    )
    review_count = serializers.IntegerField(source="reviews.count", read_only=True)

    class Meta:
        model = Expenditure
        fields = "__all__"


class MegaDamProjectSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    contract_amount = serializers.DecimalField(
        source="project.contract_amount", max_digits=15, decimal_places=2, read_only=True
    )
    amount_paid = serializers.DecimalField(
        source="project.amount_paid", max_digits=15, decimal_places=2, read_only=True
    )
    status = serializers.CharField(source="project.status", read_only=True)
    ward_name = serializers.CharField(
        source="project.ward.name", read_only=True, default=None
    )

    class Meta:
        model = MegaDamProject
        fields = "__all__"
