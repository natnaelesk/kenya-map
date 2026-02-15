from django.db import models


class ElectionCycle(models.Model):
    """Election cycle periods for Kenyan government."""

    name = models.CharField(max_length=50, unique=True)  # e.g. "2013-2017"
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField()
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ["start_year"]

    def __str__(self):
        return self.name


class SubCounty(models.Model):
    """Sub-counties (constituencies) within Wajir County."""

    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, blank=True)

    class Meta:
        verbose_name_plural = "sub-counties"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Ward(models.Model):
    """Wards within each sub-county."""

    name = models.CharField(max_length=100)
    sub_county = models.ForeignKey(
        SubCounty, on_delete=models.CASCADE, related_name="wards"
    )
    population = models.PositiveIntegerField(default=0)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)

    class Meta:
        ordering = ["sub_county__name", "name"]
        unique_together = ["name", "sub_county"]

    def __str__(self):
        return f"{self.name} ({self.sub_county.name})"


class Sector(models.Model):
    """Government spending sectors (Health, Education, Roads, Water, etc.)."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
