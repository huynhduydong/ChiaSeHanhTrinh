from django.contrib import admin
from django.contrib.auth.models import User

from journeys.models import Journey, Report, Rating, PlaceVisit

admin.site.register(Journey)
admin.site.register(User)
admin.site.register(Report)
admin.site.register(Rating)
admin.site.register(PlaceVisit)

