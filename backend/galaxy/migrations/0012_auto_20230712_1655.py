# Generated by Django 3.1.8 on 2023-07-12 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('galaxy', '0011_image_had_bcomp'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='bcomp_path',
            field=models.CharField(blank=True, default=None, help_text='Complete Path to extra bz2 file contain comp_larga ex: manga-xxx-MEGACUBE-BComp.fits.tar.bz2.', max_length=1024, null=True, verbose_name='Bcomp Path'),
        ),
        migrations.AlterField(
            model_name='image',
            name='had_bcomp',
            field=models.BooleanField(default=False, help_text='Indicates whether the object has an extra bz2 file containing the comp_larga attribute. when true, it affects the download function, which makes 2 files available.', verbose_name='bcomp'),
        ),
    ]
