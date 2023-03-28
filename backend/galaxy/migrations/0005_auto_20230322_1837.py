# Generated by Django 3.1.8 on 2023-03-22 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('galaxy', '0004_auto_20230322_1815'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='compressed_size',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Compressed Size'),
        ),
        migrations.AddField(
            model_name='image',
            name='size',
            field=models.IntegerField(blank=True, default=0, help_text='Size of fits file uncompressed', null=True, verbose_name='Size'),
        ),
        migrations.AlterField(
            model_name='image',
            name='compression',
            field=models.CharField(blank=True, default='.tar.bz2', max_length=10, null=True, verbose_name='Compression'),
        ),
    ]
