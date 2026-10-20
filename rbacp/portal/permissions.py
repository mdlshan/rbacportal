from rest_framework.permissions import BasePermission
from .models import RoleAccess


ROLE_ACCESS = {
    "admin": ["ground", "maintenance", "users"],
    "ground staff": ["ground"],
    "ground manager": ["ground"],
    "mechanical manager": ["maintenance"],
}
PERMISSION_OPTIONS = [
    {"id": "ground", "label": "Ground operations"},
    {"id": "maintenance", "label": "Maintenance"},
    {"id": "users", "label": "Manage users and roles"},
]


def role_features(group):
    if not group:
        return []
    try:
        return group.app_access.features
    except RoleAccess.DoesNotExist:
        return ROLE_ACCESS.get(group.name.lower(), [])


class access(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or any(view.feature in role_features(group) for group in request.user.groups.all())
