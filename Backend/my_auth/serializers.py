from django.utils.timezone import localtime
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from crum import get_current_request
from .models import LoginHistory

class MyTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        try:
            request = get_current_request()
            print(request.META['REMOTE_ADDR'])

            data = super().validate(attrs)
            model = LoginHistory()

            data['user_id'] = self.user.id
            data['ok'] = True
            data['email'] = f"{self.user.email}"
            
            if self.user.first_name and self.user.middle_name and self.user.last_name and self.user.second_last_name:
                data['full_name'] = f"{self.user.first_name} {self.user.middle_name[0].upper()}. {self.user.last_name} {self.user.second_last_name[0].upper()}."
            
            if self.user.first_name and self.user.middle_name == '' and self.user.last_name and self.user.second_last_name:
                data['full_name'] = f"{self.user.first_name} {self.user.last_name} {self.user.second_last_name[0].upper()}."
            
            if self.user.first_name and self.user.middle_name and self.user.last_name and self.user.second_last_name == '':
                data['full_name'] = f"{self.user.first_name} {self.user.middle_name[0].upper()}. {self.user.last_name}"
            
            if self.user.first_name and self.user.middle_name == '' and self.user.last_name and self.user.second_last_name == '':
                data['full_name'] = f"{self.user.first_name} {self.user.last_name}"

            data['password_update'] = self.user.password_update

            if self.user.is_superuser:
                data['group_name'] = 'Super Administrador'
                data['group_id'] = 0
                data['permissions'] = ['superuser']
            else:
                groups = self.user.groups.all()
                if groups.exists():
                    data['group_name'] = groups.first().name
                    data['group_id'] = groups.first().id
                    permissions = self.user.user_permissions.all().values_list('codename', flat=True)
                    if not permissions:
                        permissions = groups.first().permissions.all().values_list('codename', flat=True)
                    data['permissions'] = list(permissions) if permissions else ['superuser']
                else:
                    data['group_name'] = ''
                    data['group_id'] = 0
                    data['permissions'] = []

            model.usuario = self.user.email
            model.status = "exitoso"
            model.ip = request.META['REMOTE_ADDR']
            model.save()
            return data
        except AuthenticationFailed:
            model = LoginHistory()
            username = attrs.get(self.username_field)
            model.usuario = username
            model.status = 'fallida'
            model.ip = request.META['REMOTE_ADDR']
            model.save()
            print(f"Login fallido para el usuario: {username} - Razón: {AuthenticationFailed}")
            raise AuthenticationFailed({
                "ok": False,
                "message": "Credenciales inválidas. Por favor, verifica tu correo o contraseña."
            })

class LoginHistorySerializer(serializers.ModelSerializer):

    created_at_formatted = serializers.SerializerMethodField()
    created_at_formatted_horus = serializers.SerializerMethodField()
    
    class Meta:
        model = LoginHistory
        fields = [
            'id',
            'usuario',
            'status',
            'ip',
            'created_at_formatted',
            'created_at_formatted_horus',
            'created_at',
            'updated_at',
        ]
    
    def get_created_at_formatted(self, obj):
        return localtime(obj.created_at).strftime("%d/%m/%Y")

    def get_created_at_formatted_horus(self, obj):
        return localtime( obj.created_at).strftime("%I:%M %p")