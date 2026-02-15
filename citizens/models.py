from django.db import models

from core.models import Ward
from funds.models import Expenditure, Project


class CitizenReview(models.Model):
    """Citizen reviews on expenditures over 1M KES and projects."""

    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    expenditure = models.ForeignKey(
        Expenditure, on_delete=models.CASCADE, related_name="reviews",
        null=True, blank=True
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="reviews",
        null=True, blank=True
    )
    author_name = models.CharField(max_length=200)
    ward = models.ForeignKey(
        Ward, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviews"
    )
    rating = models.PositiveIntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        target = self.expenditure or self.project
        return f"Review by {self.author_name} on {target}"


class ImpactReport(models.Model):
    """Citizen-reported impact of projects on their lives."""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="impact_reports"
    )
    reporter_name = models.CharField(max_length=200)
    ward = models.ForeignKey(
        Ward, on_delete=models.SET_NULL, null=True, blank=True
    )
    impact_description = models.TextField()
    before_situation = models.TextField(blank=True)
    after_situation = models.TextField(blank=True)
    people_affected = models.PositiveIntegerField(default=0)
    is_positive = models.BooleanField(default=True)
    photo_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        sentiment = "Positive" if self.is_positive else "Negative"
        return f"{sentiment} impact on {self.project.name} by {self.reporter_name}"
