from rest_framework import serializers
from . import models

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Usuario
        fields = ('is_superuser', 'id', 'name', 'username', 'email', 'nusp', 'password', 'disciplinas')

    def create(self, validated_data):
        user = models.Usuario(email=validated_data['email'], username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user