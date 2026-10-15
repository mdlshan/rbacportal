from django.db import migrations


def seed_role_access(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    RoleAccess = apps.get_model("portal", "RoleAccess")
    defaults = {
        "admin": ["ground", "maintenance", "users"],
        "ground staff": ["ground"],
        "ground manager": ["ground"],
        "mechanical manager": ["maintenance"],
    }
    for group in Group.objects.all():
        features = defaults.get(group.name.lower())
        if features is not None:
            RoleAccess.objects.get_or_create(group_id=group.pk, defaults={"features": features})


class Migration(migrations.Migration):
    dependencies = [("portal", "0006_roleaccess")]
    operations = [migrations.RunPython(seed_role_access, migrations.RunPython.noop)]
