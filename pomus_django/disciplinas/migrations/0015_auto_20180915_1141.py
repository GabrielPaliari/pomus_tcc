# Generated by Django 2.1 on 2018-09-15 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disciplinas', '0014_auto_20180915_0959'),
    ]

    operations = [
        migrations.AlterField(
            model_name='disciplina',
            name='criado_em',
            field=models.DateTimeField(default='2018-08-01', editable=False),
        ),
        migrations.AlterField(
            model_name='disciplina',
            name='editado_em',
            field=models.DateTimeField(default='2018-08-01'),
        ),
    ]