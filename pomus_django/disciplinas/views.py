from django.shortcuts import render
from rest_framework import viewsets
from .models import Disciplina
from .serializers import DisciplinaSerializer

class DisicplinaView(viewsets.ModelViewSet):
  queryset = Disciplina.objects.all()
  serializer_class = DisciplinaSerializer

