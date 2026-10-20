from rest_framework import serializers
from .models import ProfileSocialLink, UserProfile


class ProfileSocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileSocialLink
        fields = ["id", "title", "url"]


class UserProfileSerializer(serializers.ModelSerializer):
    social_links = ProfileSocialLinkSerializer(many=True, required=False)

    class Meta:
        model = UserProfile
        fields = ["address", "date_of_birth", "phone_number", "social_links"]

    def update(self, instance, validated_data):
        links = validated_data.pop("social_links", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        if links is not None:
            instance.social_links.all().delete()
            for link in links:
                ProfileSocialLink.objects.create(profile=instance, **link)
        return instance
