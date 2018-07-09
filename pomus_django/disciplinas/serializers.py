from rest_framework import serializers
from .models import Disciplina

class DisciplinaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Disciplina
        fields = ('url', 'id', 'nome', 'descricao', )