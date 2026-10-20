from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator, validate_email
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RoleAccess, UserProfile
from .permissions import PERMISSION_OPTIONS, access, role_features
from .serializers import UserProfileSerializer

User = get_user_model()


def _is_admin(user):
    return user.is_superuser or user.groups.filter(name__iexact="admin").exists()


def profile_data(profile):
    if not profile:
        return {"address": "", "date_of_birth": None, "phone_number": "", "social_links": []}
    return UserProfileSerializer(profile).data


def user_data(user):
    group = user.groups.first()
    return {
        "id": user.id, "username": user.username, "first_name": user.first_name,
        "last_name": user.last_name, "email": user.email,
        "role_id": group.id if group else "", "role": group.name if group else "No role",
        "active": user.is_active, "profile": profile_data(getattr(user, "profile", None)),
    }


def role_data(group):
    return {"id": group.id, "name": group.name, "features": role_features(group), "user_count": group.user_set.count()}


def save_role_features(group, features):
    allowed = {item["id"] for item in PERMISSION_OPTIONS}
    RoleAccess.objects.update_or_create(group=group, defaults={"features": list(dict.fromkeys(features))})
    return True


def valid_role_features(features):
    allowed = {item["id"] for item in PERMISSION_OPTIONS}
    return isinstance(features, list) and all(feature in allowed for feature in features)


def validate_links(links):
    if not isinstance(links, list):
        raise ValidationError("Social links must be a list.")
    check_url = URLValidator()
    for link in links:
        if not isinstance(link, dict) or not link.get("title", "").strip() or not link.get("url", "").strip():
            raise ValidationError("Each social link needs a title and URL.")
        if len(link["title"]) > 80:
            raise ValidationError("Social link titles must be 80 characters or fewer.")
        check_url(link["url"])


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        group = request.user.groups.first()
        features = [item["id"] for item in PERMISSION_OPTIONS] if request.user.is_superuser else role_features(group)
        return Response({
            "username": request.user.username, "first_name": request.user.first_name,
            "last_name": request.user.last_name, "email": request.user.email,
            "role": group.name if group else ("Admin" if request.user.is_superuser else None), "features": features,
            **profile_data(profile),
        })

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        incoming = request.data.copy()
        links = incoming.pop("social_links", None)
        if links is not None:
            try:
                validate_links(links)
            except (ValidationError, AttributeError, TypeError) as error:
                return Response({"detail": str(error)}, status=400)

        serializer = UserProfileSerializer(profile, data=incoming, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user_fields = {}
        for field in ("first_name", "last_name", "email"):
            if field in request.data:
                value = request.data[field].strip()
                if field == "email" and value:
                    try:
                        validate_email(value)
                    except ValidationError as error:
                        return Response({"detail": error.messages[0]}, status=400)
                    if User.objects.filter(email__iexact=value).exclude(pk=request.user.pk).exists():
                        return Response({"detail": "That email is already in use."}, status=400)
                user_fields[field] = value

        serializer.save()
        if user_fields:
            for field, value in user_fields.items():
                setattr(request.user, field, value)
            request.user.save(update_fields=list(user_fields))
        if links is not None:
            profile.social_links.all().delete()
            for link in links:
                profile.social_links.create(title=link["title"].strip(), url=link["url"].strip())
        return self.get(request)


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
        people = User.objects.prefetch_related("groups", "profile__social_links").order_by("username")
        groups = Group.objects.order_by("name")
        return Response({
            "users": [user_data(person) for person in people],
            "roles": [role_data(group) for group in groups],
            "permission_options": PERMISSION_OPTIONS,
            "can_create_users": _is_admin(_request.user),
        })

    def post(self, request):
        if not _is_admin(request.user):
            return Response({"detail": "Only an admin can create users."}, status=403)
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")
        if not username or not password or not request.data.get("role"):
            return Response({"detail": "Username, password, and role are required."}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({"detail": "That username is already in use."}, status=400)
        try:
            role = Group.objects.get(pk=request.data["role"])
            validate_password(password)
        except Group.DoesNotExist:
            return Response({"detail": "Choose a valid role."}, status=400)
        except ValidationError as error:
            return Response({"detail": error.messages[0]}, status=400)
        person = User.objects.create_user(
            username=username, password=password,
            first_name=request.data.get("first_name", "").strip(),
            last_name=request.data.get("last_name", "").strip(),
            email=request.data.get("email", "").strip(),
        )
        person.groups.add(role)
        return Response(user_data(person), status=201)


class UserDetail(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def patch(self, request, user_id):
        person = get_object_or_404(User, pk=user_id)
        username = request.data.get("username", person.username).strip()
        role_id = request.data.get("role", person.groups.first().id if person.groups.exists() else None)
        if not username or User.objects.filter(username=username).exclude(pk=person.pk).exists():
            return Response({"detail": "Enter a username that is not already in use."}, status=400)
        try:
            role = Group.objects.get(pk=role_id)
        except Group.DoesNotExist:
            return Response({"detail": "Choose a valid role."}, status=400)
        active = request.data.get("active", person.is_active)
        if person == request.user and (not active or "users" not in role_features(role)):
            return Response({"detail": "You cannot remove your own Users access."}, status=400)
        for field in ("username", "first_name", "last_name", "email"):
            if field in request.data:
                setattr(person, field, request.data[field].strip())
        person.is_active = active
        person.save()
        person.groups.set([role])
        return Response(user_data(person))

    def delete(self, request, user_id):
        person = get_object_or_404(User, pk=user_id)
        if person == request.user:
            return Response({"detail": "You cannot delete your own account."}, status=400)
        person.delete()
        return Response(status=204)


class Roles(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def get(self, _request):
        return Response([{"id": g.id, "name": g.name, "features": role_features(g), "user_count": g.user_set.count()} for g in Group.objects.order_by("name")])

    def post(self, request):
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"detail": "Enter a role name."}, status=400)
        if Group.objects.filter(name__iexact=name).exists():
            return Response({"detail": "That role already exists."}, status=400)
        features = request.data.get("features", [])
        if not valid_role_features(features):
            return Response({"detail": "Choose valid permissions."}, status=400)
        group = Group.objects.create(name=name)
        save_role_features(group, features)
        return Response(role_data(group), status=201)


class RoleDetail(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def patch(self, request, role_id):
        group = get_object_or_404(Group, pk=role_id)
        name = request.data.get("name", group.name).strip()
        if not name:
            return Response({"detail": "Enter a role name."}, status=400)
        if Group.objects.filter(name__iexact=name).exclude(pk=group.pk).exists():
            return Response({"detail": "That role already exists."}, status=400)
        features = request.data.get("features", role_features(group))
        if not valid_role_features(features):
            return Response({"detail": "Choose valid permissions."}, status=400)
        if request.user.groups.filter(pk=group.pk).exists() and "users" not in features:
            return Response({"detail": "You cannot remove your own user-management access."}, status=400)
        group.name = name
        group.save(update_fields=["name"])
        save_role_features(group, features)
        return Response(role_data(group))

    def delete(self, _request, role_id):
        group = get_object_or_404(Group, pk=role_id)
        if group.user_set.exists():
            return Response({"detail": "Move users to another role before deleting this role."}, status=400)
        group.delete()
        return Response(status=204)
