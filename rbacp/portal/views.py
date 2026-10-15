from django.contrib.auth.models import Group, User
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import FEATURES, access, role_features
from .models import RoleAccess, UserProfile
from .serializers import UserProfileSerializer

# Create your views here.


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        groups = request.user.groups.first()
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "role": groups.name if groups else None,
            "features": role_features(groups) if groups else [],
            **UserProfileSerializer(profile).data,
        })

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile_data = {
            field: request.data[field]
            for field in UserProfileSerializer.Meta.fields
            if field in request.data
        }
        if profile_data.get("date_of_birth") == "":
            profile_data["date_of_birth"] = None
        serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user_fields = {}
        for field in ("email",):
            if field in request.data:
                value = request.data[field].strip()
                if field == "email" and value:
                    try:
                        validate_email(value)
                    except ValidationError as error:
                        return Response({"email": error.messages}, status=400)
                user_fields[field] = value

        if user_fields:
            for field, value in user_fields.items():
                setattr(request.user, field, value)
            request.user.save(update_fields=list(user_fields))
        serializer.save()
        groups = request.user.groups.first()
        return Response({
            "username": request.user.username,
            "role": groups.name if groups else None,
            "features": role_features(groups) if groups else [],
            **user_fields,
            **serializer.data,
        })


class dashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, _request):
        return Response({"message": "access granted"})

class groundops(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "ground"

    def get(self, _request):
        return Response({"message": "access granted"})


class maintenance(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "maintenance"

    def get(self, _request):
        return Response({"message": "access granted"})


class users(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def get(self, _request):
        user_list = User.objects.select_related("profile").prefetch_related("groups").order_by("username")
        social_fields = [
            ("Social link 1", "instagram_url"),
            ("Social link 2", "facebook_url"),
            ("Social link 3", "linkedin_url"),
            ("Social link 4", "x_url"),
            ("Social link 5", "website_url"),
        ]
        user_rows = []
        for user in user_list:
            group = user.groups.first()
            profile = getattr(user, "profile", None)
            user_rows.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role_id": group.id if group else "",
                "role": group.name if group else "No role",
                "active": user.is_active,
                "profile": {
                    "name": profile.name if profile else "",
                    "address": profile.address if profile else "",
                    "date_of_birth": profile.date_of_birth if profile else None,
                    "phone_number": profile.phone_number if profile else "",
                    "social_links": [
                        {"title": title, "url": getattr(profile, field)}
                        for title, field in social_fields
                        if profile and getattr(profile, field)
                    ],
                },
            })
        return Response({
            "users": user_rows,
            "roles": [{"id": group.id, "name": group.name, "features": role_features(group), "user_count": group.user_set.count()} for group in Group.objects.order_by("name")],
        })

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")
        role_id = request.data.get("role")
        if not username or not password or not role_id:
            return Response({"detail": "Username, password, and role are required."}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({"detail": "That username is already in use."}, status=400)
        try:
            role = Group.objects.get(pk=role_id)
            validate_password(password)
        except Group.DoesNotExist:
            return Response({"detail": "Choose a valid role."}, status=400)
        except ValidationError as error:
            return Response({"detail": error.messages[0]}, status=400)
        user = User.objects.create_user(username=username, password=password)
        user.groups.add(role)
        return Response({"id": user.id, "username": username, "role": role.name}, status=201)


class UserDetail(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        username = request.data.get("username", user.username).strip()
        role_id = request.data.get("role", user.groups.first().id if user.groups.exists() else None)
        if not username or User.objects.filter(username=username).exclude(pk=user.pk).exists():
            return Response({"detail": "Enter a username that is not already in use."}, status=400)
        try:
            role = Group.objects.get(pk=role_id)
        except Group.DoesNotExist:
            return Response({"detail": "Choose a valid role."}, status=400)
        active = request.data.get("active", user.is_active)
        if user == request.user and (not active or "users" not in role_features(role)):
            return Response({"detail": "You cannot remove your own Users access."}, status=400)
        user.username = username
        user.is_active = active
        user.save()
        user.groups.set([role])
        return Response({"id": user.id, "username": user.username, "role": role.name, "active": user.is_active})

    def delete(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        if user == request.user:
            return Response({"detail": "You cannot delete your own account."}, status=400)
        user.delete()
        return Response(status=204)


class Roles(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def get(self, _request):
        return Response([{"id": group.id, "name": group.name, "features": role_features(group), "user_count": group.user_set.count()} for group in Group.objects.order_by("name")])

    def post(self, request):
        name = request.data.get("name", "").strip()
        features = request.data.get("features", [])
        if not name or not isinstance(features, list) or any(item not in FEATURES for item in features):
            return Response({"detail": "Enter a role name and valid access sections."}, status=400)
        if Group.objects.filter(name__iexact=name).exists():
            return Response({"detail": "That role already exists."}, status=400)
        group = Group.objects.create(name=name)
        RoleAccess.objects.create(group=group, features=features)
        return Response({"id": group.id, "name": group.name, "features": features, "user_count": 0}, status=201)

    def patch(self, request, role_id):
        group = get_object_or_404(Group, pk=role_id)
        name = request.data.get("name", group.name).strip()
        features = request.data.get("features", role_features(group))
        if not name or not isinstance(features, list) or any(item not in FEATURES for item in features):
            return Response({"detail": "Enter a role name and valid access sections."}, status=400)
        if Group.objects.filter(name__iexact=name).exclude(pk=group.pk).exists():
            return Response({"detail": "That role already exists."}, status=400)
        if group in request.user.groups.all() and "users" not in features:
            return Response({"detail": "Your own role must keep Users access."}, status=400)
        group.name = name
        group.save(update_fields=["name"])
        RoleAccess.objects.update_or_create(group=group, defaults={"features": features})
        return Response({"id": group.id, "name": name, "features": features, "user_count": group.user_set.count()})

    def delete(self, request, role_id):
        group = get_object_or_404(Group, pk=role_id)
        if group.user_set.exists():
            return Response({"detail": "Move users to another role before deleting this role."}, status=400)
        group.delete()
        return Response(status=204)


class RoleDetail(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def patch(self, request, role_id):
        return Roles().patch(request, role_id)

    def delete(self, request, role_id):
        return Roles().delete(request, role_id)
