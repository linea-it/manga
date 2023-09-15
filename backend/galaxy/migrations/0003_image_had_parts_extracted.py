# Generated by Django 3.1.8 on 2023-03-10 17:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("galaxy", "0002_auto_20210315_1356"),
    ]

    operations = [
        migrations.AddField(
            model_name="image",
            name="had_parts_extracted",
            field=models.BooleanField(
                default=False,
                help_text="Indicates whether the process of extracting parts of the image was performed for this object.",
                verbose_name="Extracted",
            ),
        ),
    ]
