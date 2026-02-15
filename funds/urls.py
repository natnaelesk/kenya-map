from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"fund-sources", views.FundSourceViewSet)
router.register(r"budgets", views.BudgetViewSet)
router.register(r"projects", views.ProjectViewSet)
router.register(r"expenditures", views.ExpenditureViewSet)
router.register(r"mega-dams", views.MegaDamProjectViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("fund-source-summary/", views.fund_source_summary, name="fund-source-summary"),
    path("ward-spending/", views.ward_spending, name="ward-spending"),
    path("yearly-spending/", views.yearly_spending, name="yearly-spending"),
]
