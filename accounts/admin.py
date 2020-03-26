from django.contrib import admin

from accounts.models import User, Profile, Area, BusinessInfo

admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Area)
admin.site.register(BusinessInfo)
