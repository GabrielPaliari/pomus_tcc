# Generated by Django 2.1 on 2018-09-12 00:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('disciplinas', '0011_auto_20180902_1740'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comentario',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=100)),
                ('texto', models.CharField(max_length=1000)),
                ('criado_em', models.DateTimeField(editable=False)),
                ('editado_em', models.DateTimeField(editable=False)),
                ('criado_por', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('curtidas', models.ManyToManyField(blank=True, related_name='curtidas', to=settings.AUTH_USER_MODEL)),
                ('topico_pai', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='disciplinas.Topico')),
            ],
        ),
        migrations.AddField(
            model_name='disciplina',
            name='criado_em',
            field=models.DateTimeField(default='2018-08-01', editable=False),
        ),
        migrations.AddField(
            model_name='disciplina',
            name='criado_por',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='disciplina',
            name='editado_em',
            field=models.DateTimeField(default='2018-08-01', editable=False),
        ),
        migrations.AlterField(
            model_name='disciplina',
            name='dataFim',
            field=models.DateField(blank=True, default='2018-08-01'),
        ),
        migrations.AlterField(
            model_name='disciplina',
            name='dataIni',
            field=models.DateField(blank=True, default='2018-08-01'),
        ),
    ]
