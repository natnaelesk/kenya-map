from rest_framework import serializers

from .models import ElectionCycle, Sector, SubCounty, Ward


class ElectionCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionCycle
        fields = "__all__"


class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = "__all__"


class SubCountySerializer(serializers.ModelSerializer):
    ward_count = serializers.IntegerField(source="wards.count", read_only=True)

    class Meta:
        model = SubCounty
        fields = "__all__"


class WardSerializer(serializers.ModelSerializer):
    sub_county_name = serializers.CharField(source="sub_county.name", read_only=True)

    class Meta:
        model = Ward
        fields = "__all__"
