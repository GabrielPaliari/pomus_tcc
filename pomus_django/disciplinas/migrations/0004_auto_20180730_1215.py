# Generated by Django 2.0.7 on 2018-07-30 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disciplinas', '0003_auto_20180730_1214'),
    ]

    operations = [
        migrations.AlterField(
            model_name='disciplina',
            name='codigo',
            field=models.CharField(max_length=200),
        ),
    ]
