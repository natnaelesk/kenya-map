from django.db import models

from core.models import ElectionCycle, SubCounty


class Governor(models.Model):
    """County Governor for each election cycle."""

    POSITION = "governor"

    name = models.CharField(max_length=200)
    photo_url = models.URLField(blank=True)
    party = models.CharField(max_length=100, blank=True)
    election_cycle = models.ForeignKey(
        ElectionCycle, on_delete=models.CASCADE, related_name="governors"
    )
    votes_received = models.PositiveIntegerField(default=0)
    manifesto_summary = models.TextField(blank=True)

    class Meta:
        ordering = ["election_cycle__start_year"]
        unique_together = ["name", "election_cycle"]

    def __str__(self):
        return f"{self.name} ({self.election_cycle})"


class MemberOfParliament(models.Model):
    """MPs for each constituency and election cycle."""

    name = models.CharField(max_length=200)
    photo_url = models.URLField(blank=True)
    party = models.CharField(max_length=100, blank=True)
    sub_county = models.ForeignKey(
        SubCounty, on_delete=models.CASCADE, related_name="mps"
    )
    election_cycle = models.ForeignKey(
        ElectionCycle, on_delete=models.CASCADE, related_name="mps"
    )
    votes_received = models.PositiveIntegerField(default=0)
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ["sub_county__name", "election_cycle__start_year"]
        unique_together = ["sub_county", "election_cycle"]
        verbose_name = "Member of Parliament"
        verbose_name_plural = "Members of Parliament"

    def __str__(self):
        return f"{self.name} - {self.sub_county} ({self.election_cycle})"


class MPActivity(models.Model):
    """Tracks MP activities — constituency visits, weddings attended, etc."""

    ACTIVITY_TYPES = [
        ("constituency_visit", "Constituency Visit"),
        ("wedding_attended", "Wedding Attended"),
        ("parliament_session", "Parliament Session"),
        ("fundraiser", "Fundraiser / Harambee"),
        ("public_event", "Public Event"),
        ("other", "Other"),
    ]

    mp = models.ForeignKey(
        MemberOfParliament, on_delete=models.CASCADE, related_name="activities"
    )
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    date = models.DateField()
    location = models.CharField(max_length=200, blank=True)
    source_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-date"]
        verbose_name_plural = "MP activities"

    def __str__(self):
        return f"{self.mp.name}: {self.title} ({self.date})"


class GovernorPerformanceMetric(models.Model):
    """Quantitative metrics for comparing governors."""

    governor = models.ForeignKey(
        Governor, on_delete=models.CASCADE, related_name="metrics"
    )
    metric_name = models.CharField(max_length=200)
    value = models.DecimalField(max_digits=15, decimal_places=2)
    unit = models.CharField(max_length=50, blank=True)  # e.g. "KES", "%", "km"
    year = models.PositiveIntegerField()

    class Meta:
        ordering = ["governor", "year", "metric_name"]

    def __str__(self):
        return f"{self.governor.name} - {self.metric_name}: {self.value} ({self.year})"
