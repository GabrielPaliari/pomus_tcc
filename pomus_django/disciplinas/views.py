from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import Disciplina, Topico, Arquivo
from .serializers import DisciplinaSerializer, TopicoSerializer, ArquivoSerializer

class DisicplinaView(viewsets.ModelViewSet):
  queryset = Disciplina.objects.all()
  serializer_class = DisciplinaSerializer

class TopicoView(viewsets.ModelViewSet):
  queryset = Topico.objects.all()
  serializer_class = TopicoSerializer

class TopicoListView(generics.ListAPIView):
  serializer_class = TopicoSerializer

  def get_queryset(self):
      """
      Optionally restricts the returned purchases to a given user,
      by filtering against a `disciplina` query parameter in the URL.
      """
      queryset = Topico.objects.all()
      disciplina = self.request.query_params.get('disc_id', None)
      print(disciplina)
      if disciplina is not None:
          queryset = queryset.filter(disc_pai=disciplina)
      return queryset

class ArquivoView(viewsets.ModelViewSet):
  queryset = Arquivo.objects.all()
  serializer_class = ArquivoSerializer