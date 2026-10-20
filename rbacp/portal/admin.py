from django.contrib import admin
from .models import ProfileSocialLink, RoleAccess, UserProfile

admin.site.register(UserProfile)
admin.site.register(ProfileSocialLink)
admin.site.register(RoleAccess)
