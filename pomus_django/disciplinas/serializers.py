from rest_framework import serializers
from .models import Disciplina

class DisciplinaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Disciplina
        fields =   ('url', 
                    'id', 
                    'codigo', 
                    'nome', 
                    'descricao', 
                    'creditosA', 
                    'creditosT', 
                    'dataIni', 
                    'dataFim', 
                    'objetivos', 
                    'programa', 
                    'preRequisitos')