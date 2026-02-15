from django.db import models

from core.models import ElectionCycle, Sector, SubCounty, Ward


class FundSource(models.Model):
    """Funding source — County, NGCDF, KURA, KERA, etc."""

    FUND_TYPES = [
        ("county", "County Government"),
        ("ngcdf", "NG-CDF"),
        ("kura", "KURA"),
        ("kerra", "KeRRA"),
        ("national", "National Government"),
        ("donor", "Donor Funded"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=100, unique=True)
    fund_type = models.CharField(max_length=20, choices=FUND_TYPES)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Budget(models.Model):
    """Annual budget allocation per ward/sector."""

    financial_year = models.CharField(max_length=20)  # e.g. "2023/2024"
    election_cycle = models.ForeignKey(
        ElectionCycle, on_delete=models.CASCADE, related_name="budgets"
    )
    ward = models.ForeignKey(
        Ward, on_delete=models.CASCADE, related_name="budgets", null=True, blank=True
    )
    sub_county = models.ForeignKey(
        SubCounty, on_delete=models.CASCADE, related_name="budgets", null=True, blank=True
    )
    sector = models.ForeignKey(
        Sector, on_delete=models.CASCADE, related_name="budgets"
    )
    fund_source = models.ForeignKey(
        FundSource, on_delete=models.CASCADE, related_name="budgets"
    )
    allocated_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    disbursed_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    spent_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    class Meta:
        ordering = ["-financial_year"]

    def __str__(self):
        target = self.ward or self.sub_county or "County-wide"
        return f"{self.financial_year} - {self.sector} - {target}"

    @property
    def absorption_rate(self):
        if self.disbursed_amount:
            return round(float(self.spent_amount / self.disbursed_amount) * 100, 1)
        return 0


class Project(models.Model):
    """Individual development project."""

    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("stalled", "Stalled"),
        ("abandoned", "Abandoned"),
    ]

    name = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    sector = models.ForeignKey(
        Sector, on_delete=models.CASCADE, related_name="projects"
    )
    ward = models.ForeignKey(
        Ward, on_delete=models.CASCADE, related_name="projects", null=True, blank=True
    )
    sub_county = models.ForeignKey(
        SubCounty, on_delete=models.CASCADE, related_name="projects", null=True, blank=True
    )
    fund_source = models.ForeignKey(
        FundSource, on_delete=models.CASCADE, related_name="projects"
    )
    election_cycle = models.ForeignKey(
        ElectionCycle, on_delete=models.CASCADE, related_name="projects"
    )
    contractor = models.CharField(max_length=300, blank=True)
    contract_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    start_date = models.DateField(null=True, blank=True)
    expected_completion = models.DateField(null=True, blank=True)
    actual_completion = models.DateField(null=True, blank=True)
    completion_percentage = models.PositiveIntegerField(default=0)
    beneficiaries_count = models.PositiveIntegerField(default=0)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def is_over_budget(self):
        return self.amount_paid > self.contract_amount

    @property
    def citizen_impact_score(self):
        """Simple impact score based on completion and beneficiaries."""
        if self.beneficiaries_count == 0:
            return 0
        return round(self.completion_percentage * 0.01 * self.beneficiaries_count)


class Expenditure(models.Model):
    """Individual expenditure record for granular tracking."""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="expenditures",
        null=True, blank=True
    )
    budget = models.ForeignKey(
        Budget, on_delete=models.CASCADE, related_name="expenditures",
        null=True, blank=True
    )
    description = models.TextField()
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField()
    payee = models.CharField(max_length=300, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)
    ward = models.ForeignKey(
        Ward, on_delete=models.SET_NULL, null=True, blank=True, related_name="expenditures"
    )
    sector = models.ForeignKey(
        Sector, on_delete=models.SET_NULL, null=True, blank=True, related_name="expenditures"
    )
    requires_citizen_review = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.description[:80]} - KES {self.amount:,.2f}"

    def save(self, *args, **kwargs):
        # Auto-flag expenditures over 1M KES for citizen review
        if self.amount >= 1_000_000:
            self.requires_citizen_review = True
        super().save(*args, **kwargs)


class MegaDamProject(models.Model):
    """Specific tracking for mega dam projects in Wajir."""

    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name="dam_details"
    )
    dam_name = models.CharField(max_length=200)
    capacity_litres = models.BigIntegerField(default=0)
    water_catchment_area = models.CharField(max_length=200, blank=True)
    communities_served = models.TextField(blank=True)
    current_water_level_pct = models.PositiveIntegerField(default=0)
    is_functional = models.BooleanField(default=False)
    last_inspection_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Mega Dam Project"

    def __str__(self):
        return self.dam_name
