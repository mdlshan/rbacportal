from rest_framework.permissions import BasePermission
from .models import RoleAccess

FEATURES = ["ground", "maintenance", "users"]


def role_features(group):
    try:
        return group.role_access.features
    except (RoleAccess.DoesNotExist, AttributeError):
        return []


class access(BasePermission):

    def has_permission(self, request, view):
        return any(view.feature in role_features(group) for group in request.user.groups.all())
