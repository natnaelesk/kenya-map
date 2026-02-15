from django.contrib import admin

from .models import ElectionCycle, Sector, SubCounty, Ward

admin.site.register(ElectionCycle)
admin.site.register(Sector)
admin.site.register(SubCounty)
admin.site.register(Ward)
