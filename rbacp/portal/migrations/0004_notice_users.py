from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("portal", "0003_notice"),
    ]

    operations = [
        migrations.AddField(
            model_name="notice",
            name="users",
            field=models.ManyToManyField(blank=True, related_name="targeted_notices", to=settings.AUTH_USER_MODEL),
        ),
    ]
