from rest_framework.permissions import BasePermission

roleaccess = {
    "admin": ["ground", "maintenance", "users"],
    "ground staff": ["ground"],
    "mechanical manager": ["maintenance"],
    "ground manager": ["ground"],
    
}


class access(BasePermission):

    def has_permission(self, request, view):
        group = request.user.groups.first()

        if not group:
            return False

        return view.feature in roleaccess.get(group.name.lower(), [])