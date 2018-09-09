from rest_framework import serializers
from . import models

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Usuario
        fields = ('is_superuser', 'id', 'name', 'username', 'email', 'nusp', 'password', 'disciplinas')