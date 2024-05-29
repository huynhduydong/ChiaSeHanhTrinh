from django.contrib import admin

from journeys.models import Journey, Report, Rating, PlaceVisit, User

admin.site.register(Journey)
admin.site.register(User)
admin.site.register(Report)
admin.site.register(Rating)
admin.site.register(PlaceVisit)

