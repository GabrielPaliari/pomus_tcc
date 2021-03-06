from django.urls import include, path
from . import views
from usuarios.views import UsuarioView 
from rest_framework import routers
from django.conf.urls import url, include

router = routers.DefaultRouter()
router.register('disciplinas', views.DisciplinaView) 
router.register('topicos', views.TopicoView) 
router.register('usuarios', UsuarioView) 
router.register('arquivos', views.ArquivoView) 
router.register('comentarios', views.ComentarioView) 
router.register('respostas', views.RespostaView) 

urlpatterns = [
  path('', include(router.urls)),
  path('topicos_disc/', views.TopicoListView.as_view()),
  path('arquivos_topic/', views.ArquivoListView.as_view()),
  path('comentarios_topic/', views.ComentarioListView.as_view()),
  path('respostas_comment/', views.RespostaListView.as_view()),
  path('disciplina_jupiter/', views.DisciplinaOneView.as_view()),
]