from django.contrib import admin

from .models import Governor, GovernorPerformanceMetric, MemberOfParliament, MPActivity

admin.site.register(Governor)
admin.site.register(GovernorPerformanceMetric)
admin.site.register(MemberOfParliament)
admin.site.register(MPActivity)
