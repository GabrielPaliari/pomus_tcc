from django.contrib.auth.models import AbstractUser
from django.db import models
from disciplinas.models import Disciplina

class Usuario(AbstractUser):
    name = models.CharField(blank=True, max_length=255)
    nusp = models.IntegerField(default=0)
    disciplinas = models.ManyToManyField(Disciplina, blank=True, related_name="disciplinas_usuario")

    def __str__(self):
        return self.email
