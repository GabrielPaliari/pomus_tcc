from rest_framework import serializers
from .models import Disciplina
from .models import Topico
from .models import Arquivo
from .models import Comentario
from .models import Resposta

class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields =   ('id', 
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

class TopicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topico
        fields =   ('id', 
                    'titulo', 
                    'explicacao', 
                    'disc_pai', 
                    'criado_por', 
                    'criado_em',
                    'editado_por',
                    'editado_em')

class ArquivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arquivo
        fields =   ('id',
                    'nome',
                    'upload',
                    'topico_pai',
                    'formato',
                    'tamanho')

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields =   ('id',
                    'texto',
                    'topico_pai',
                    'criado_por',
                    'curtidas',
                    'criado_em',
                    'editado_em')

class RespostaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resposta
        fields =   ('id',
                    'texto',
                    'comentario_pai',
                    'criado_por',
                    'criado_em',
                    'editado_em')