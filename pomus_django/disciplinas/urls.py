from django.urls import include, path
from . import views
from usuarios.views import UsuarioView 
from rest_framework import routers
from django.conf.urls import url, include

router = routers.DefaultRouter()
router.register('disciplinas', views.DisicplinaView) 
router.register('topicos', views.TopicoView) 
router.register('usuarios', UsuarioView) 
router.register('arquivo', views.ArquivoView) 

urlpatterns = [
  path('', include(router.urls)),
  path('topicos_disc/', views.TopicoListView.as_view()),
]