from rest_auth.registration.serializers import RegisterSerializer
from rest_auth.registration.views import RegisterView
from rest_framework import serializers

class UserRegistrationSerializer(RegisterSerializer):

  name = serializers.CharField(required=True)
  nusp = serializers.CharField(required=True)

  def custom_signup(self, request, user):
    user.name = self.validated_data.get('name', '')
    user.nusp = self.validated_data.get('nusp', '')
    user.save(update_fields=['name', 'nusp'])


class UserRegistrationView(RegisterView):
  serializer_class = UserRegistrationSerializer