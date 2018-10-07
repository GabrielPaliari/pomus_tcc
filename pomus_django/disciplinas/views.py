from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import Disciplina, Topico, Arquivo, Comentario, Resposta
from .serializers import DisciplinaSerializer, TopicoSerializer, ArquivoSerializer, ComentarioSerializer, RespostaSerializer

class DisciplinaView(viewsets.ModelViewSet):
  queryset = Disciplina.objects.all()
  serializer_class = DisciplinaSerializer

class TopicoView(viewsets.ModelViewSet):
  queryset = Topico.objects.all()
  serializer_class = TopicoSerializer

class TopicoListView(generics.ListAPIView):
  serializer_class = TopicoSerializer

  def get_queryset(self):
      """
      Optionally restricts the returned 'topicos' to a given 'disciplina',
      by filtering against a `disc_id` query parameter in the URL.
      """
      queryset = Topico.objects.all()
      disciplina = self.request.query_params.get('disc_id', None)
      #print(disciplina)
      if disciplina is not None:
          queryset = queryset.filter(disc_pai=disciplina)
      return queryset

class ArquivoView(viewsets.ModelViewSet):
  queryset = Arquivo.objects.all()
  serializer_class = ArquivoSerializer

class ArquivoListView(generics.ListAPIView):
  serializer_class = ArquivoSerializer

  def get_queryset(self):
      """
      Optionally restricts the returned 'arquivos' to a given 'topico',
      by filtering against a `topic_id` query parameter in the URL.
      """
      queryset = Arquivo.objects.all()
      topico = self.request.query_params.get('topic_id', None)      
      if topico is not None:
          queryset = queryset.filter(topico_pai=topico)
      return queryset
  
class ComentarioView(viewsets.ModelViewSet):
  queryset = Comentario.objects.all()
  serializer_class = ComentarioSerializer

class ComentarioListView(generics.ListAPIView):
  serializer_class = ComentarioSerializer

  def get_queryset(self):
      """
      Optionally restricts the returned 'Comentarios' to a given 'topico',
      by filtering against a `topic_id` query parameter in the URL.
      """
      queryset = Comentario.objects.all()
      topico = self.request.query_params.get('topic_id', None)      
      if topico is not None:
          queryset = queryset.filter(topico_pai=topico)
      return queryset

class RespostaView(viewsets.ModelViewSet):
  queryset = Resposta.objects.all()
  serializer_class = RespostaSerializer

class RespostaListView(generics.ListAPIView):
  serializer_class = RespostaSerializer

  def get_queryset(self):
      """
      Optionally restricts the returned 'Respostas' to a given 'topico',
      by filtering against a `topic_id` query parameter in the URL.
      """
      queryset = Resposta.objects.all()
      comentario = self.request.query_params.get('comment_id', None)      
      if comentario is not None:
          queryset = queryset.filter(comentario_pai=comentario)
      return queryset