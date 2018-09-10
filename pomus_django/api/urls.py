from django.urls import include, path
from django.conf.urls import url, include
from .serializers import UserRegistrationView
from rest_auth.registration.views import VerifyEmailView, RegisterView

urlpatterns = [
    path('', include('usuarios.urls')),
    path('', include('disciplinas.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    url('accounts/', include('allauth.urls')),
    url(r'^rest-auth/registration/$', UserRegistrationView.as_view(), name="rest_user_register"),
]