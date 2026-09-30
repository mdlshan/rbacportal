from django.contrib.auth.models import Group, User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create four local demo accounts (password: demo1234)."

    def handle(self, *args, **options):
        roles = {
            "admin": "admin",
            "ground_staff": "Ground Staff",
            "mechanical_manager": "Mechanical Manager",
            "ground_manager": "Ground Manager",
        }

        for username, role in roles.items():
            group, _ = Group.objects.get_or_create(name=role)
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password("demo1234")
                user.save()
            user.groups.set([group])

        self.stdout.write(self.style.SUCCESS("Demo users ready (password: demo1234)."))
