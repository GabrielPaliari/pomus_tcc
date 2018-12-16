from django.shortcuts import render
from rest_framework import viewsets, generics,  filters
from .models import Disciplina, Topico, Arquivo, Comentario, Resposta
from .serializers import DisciplinaSerializer, TopicoSerializer, ArquivoSerializer, ComentarioSerializer, RespostaSerializer

import urllib3
from lxml import html

class DisciplinaView(viewsets.ModelViewSet):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['codigo', 'nome', 'descricao']

class DisciplinaOneView(generics.RetrieveAPIView):
    serializer_class = DisciplinaSerializer

    def get_object(self):
        queryset = Disciplina.objects.all()
        """
        Optionally restricts the returned 'disciplina',
        by filtering against a `codigo` query parameter in the URL.
        """
        sigla = self.request.query_params.get('sigla', None)
        disciplina = Disciplina()
        if sigla is not None:
            disciplina = getDisciplinaDoJupiter(sigla)
        return disciplina

class TopicoView(viewsets.ModelViewSet):
    queryset = Topico.objects.all()
    serializer_class = TopicoSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['titulo', 'explicacao', 'criado_por__username']

class TopicoListView(generics.ListAPIView):
    serializer_class = TopicoSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned 'topicos' to a given 'disciplina',
        by filtering against a `disc_id` query parameter in the URL.
        """
        queryset = Topico.objects.all()
        disciplina = self.request.query_params.get('disc_id', None)
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
    filter_backends = (filters.SearchFilter,)
    search_fields = ['texto']

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
    filter_backends = (filters.SearchFilter,)
    search_fields = ['texto']

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

def getDisciplinaDoJupiter(sigla):
    disciplina = Disciplina(codigo=sigla)

    # url
    quote_page = 'https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis='+sigla
    # print(quote_page)

    http = urllib3.PoolManager()

    # pega o html da pagina
    page = http.request('GET', quote_page)
    # print("\nHTML:\n",page)

    # parse the html
    lmx = html.fromstring(page.data)
    # print("\nHTML parsed:\n",lmx)
    
    #Pega o cabeçalho
    headerElement = lmx.xpath("//div[@id='my_web_cabecalho']")
    headerText = headerElement[0].text.strip()

    if(headerText == "Informações da Disciplina"):

        # Pega o objetivo
        elementoObjetivo = lmx.xpath('//td//table[5]//tr[2]//span')
        objetivoDisciplina = elementoObjetivo[0].text.strip() # strip() is used to remove starting and trailing

        # print("\nObjetivo:\n",objetivoDisciplina)

        # Pega o programa resumido
        n = 7
        elementoProgramaTitulo = lmx.xpath('//td//table['+str(n)+']//tr[1]//span//b')

        titulo = elementoProgramaTitulo[0].text.strip() # strip() is used to remove starting and trailing

        if titulo != "Programa Resumido":   # Não tem professores
            n = 6

        elementoPrograma = lmx.xpath('//td//table['+str(n)+']//tr[2]//span')
        programaDisciplina = elementoPrograma[0].text.strip() # strip() is used to remove starting and trailing
        # print("\nPrograma Resumido:\n",programaDisciplina)

        # Pega o credito aula
        elementoCreditoAula = lmx.xpath('//td//table[4]//tr[1]//td[2]//span')
        creditoAula = elementoCreditoAula[0].text.strip() # strip() is used to remove starting and trailing
        # print("\nCréditos Aula:",creditoAula)

        # Pega o credito trabalho
        elementoCreditoTrabalho = lmx.xpath('//td//table[4]//tr[2]//td[2]//span')
        creditoTrabalho = elementoCreditoTrabalho[0].text.strip() # strip() is used to remove starting and trailing
        # print("\nCréditos Trabalho:",creditoTrabalho)

        # Pega o nome da disciplina
        elementoNome = lmx.xpath('//td//table[3]//tr[5]//b')
        nomeDisciplina = elementoNome[0].text.strip() # strip() is used to remove starting and trailing
        nomeDisciplina = nomeDisciplina[12:] # Codigo - nome
        nomeDisciplina = nomeDisciplina[10:] # nome (supondo q toda disciplina - até as puramente numericas - tem codigo c 7 digitos)
        # print("\nDisciplina:",nomeDisciplina)

        disciplina = Disciplina(codigo=sigla, nome=nomeDisciplina, creditosA=creditoAula, creditosT=creditoTrabalho, objetivos=objetivoDisciplina, programa=programaDisciplina)
    
    # print(disciplina)
    return disciplina