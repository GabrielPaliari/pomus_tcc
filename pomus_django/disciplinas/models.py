from django.db import models
from django.conf import settings
import datetime
from django.utils import timezone

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

class Topico(models.Model):
  titulo     = models.CharField(max_length=200)
  explicacao = models.CharField(max_length=3000, blank=True)
  disc_pai   = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
  criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='criador')
  criado_em  = models.DateTimeField(editable = False)
  editado_em = models.DateTimeField(editable = False)
  editado_por = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, symmetrical=False, related_name='editor') 

  
  def save(self, *args, **kwargs):
      ''' On save, update timestamps '''
      if not self.id:
          self.criado_em = timezone.now()
      self.editado_em = timezone.now()
      return super(Topico, self).save(*args, **kwargs)

  def __str__(self):
        return "%s - disciplina: %s" % (self.titulo, self.disc_pai.codigo)

class Arquivo(models.Model):
  nome        = models.CharField(max_length=200)
  upload      = models.FileField(upload_to='uploads/')
  topico_pai  = models.ForeignKey(Topico, on_delete=models.CASCADE, blank=True)
  formato = models.CharField(max_length=10, blank=True)
  tamanho = models.DecimalField(max_digits=12, decimal_places=1, blank=True)
