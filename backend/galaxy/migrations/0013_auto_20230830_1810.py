# Generated by Django 3.1.8 on 2023-08-30 18:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("galaxy", "0012_auto_20230712_1655"),
    ]

    operations = [
        migrations.AddField(
            model_name="image",
            name="ned_name",
            field=models.CharField(
                default=None,
                help_text="Galaxy Name",
                max_length=100,
                verbose_name="Ned Name",
            ),
        ),
        migrations.AlterField(
            model_name="image",
            name="had_bcomp",
            field=models.BooleanField(
                default=False,
                help_text="Indicates whether the object has an extra bz2 file containing the Broad component attribute. when true, it affects the download function, which makes 2 files available.",
                verbose_name="Broad component",
            ),
        ),
    ]
