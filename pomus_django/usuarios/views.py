from rest_framework import generics

from . import models
from . import serializers

class UsuarioListView(generics.ListCreateAPIView):
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer