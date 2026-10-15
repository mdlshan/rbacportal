from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "name", "address", "date_of_birth", "phone_number", "instagram_url",
            "facebook_url", "linkedin_url", "x_url", "website_url",
        ]
