from django.contrib import admin

from .models import Budget, Expenditure, FundSource, MegaDamProject, Project

admin.site.register(FundSource)
admin.site.register(Budget)
admin.site.register(Project)
admin.site.register(Expenditure)
admin.site.register(MegaDamProject)
