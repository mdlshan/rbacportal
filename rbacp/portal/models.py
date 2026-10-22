from django.conf import settings
from django.contrib.auth.models import Group
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    address = models.CharField(max_length=255, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)


class ProfileSocialLink(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="social_links")
    title = models.CharField(max_length=80)
    url = models.URLField()

    def __str__(self):
        return self.title


class RoleAccess(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name="app_access")
    features = models.JSONField(default=list, blank=True)


class Notice(models.Model):
    title = models.CharField(max_length=120)
    message = models.TextField()
    everyone = models.BooleanField(default=True)
    roles = models.ManyToManyField(Group, blank=True, related_name="notices")
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="targeted_notices")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="published_notices")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
