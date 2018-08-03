from django.db import models
import datetime


class Disciplina(models.Model):
  codigo    = models.CharField(max_length=200, unique=True)
  nome      = models.CharField(max_length=200)
  descricao = models.CharField(max_length=400, blank=True)
  creditosA = models.IntegerField(default=1)
  creditosT = models.IntegerField(default=0)
  objetivos = models.CharField(max_length=500, blank=True)
  programa  = models.CharField(max_length=1000, blank=True)
  dataIni   = models.DateField(default=str(datetime.datetime.now())[:10], blank=True)
  dataFim   = models.DateField(default=str(datetime.datetime.now())[:10], blank=True)
  preRequisitos = models.ManyToManyField("self", blank=True, symmetrical=False)

  def __str__(self):
        return self.codigo
