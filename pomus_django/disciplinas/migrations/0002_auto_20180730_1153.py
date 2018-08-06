# Generated by Django 2.0.7 on 2018-07-30 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('disciplinas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='disciplina',
            name='codigo',
            field=models.CharField(default='000', max_length=200),
        ),
        migrations.AddField(
            model_name='disciplina',
            name='objetivos',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='disciplina',
            name='preRequisitos',
            field=models.ManyToManyField(blank=True, to='disciplinas.Disciplina'),
        ),
        migrations.AddField(
            model_name='disciplina',
            name='programa',
            field=models.CharField(blank=True, max_length=1000),
        ),
        migrations.AlterField(
            model_name='disciplina',
            name='descricao',
            field=models.CharField(blank=True, max_length=400),
        ),
    ]