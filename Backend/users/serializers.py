from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from .models import User

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']

class GroupSerializer(serializers.ModelSerializer):
    # Usamos PrimaryKeyRelatedField para poder enviar solo los IDs al crear/editar
    permissions = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Permission.objects.all(),
        required=False
    )

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']

class UserSerializer(serializers.ModelSerializer):
    # groups = GroupSerializer(many=True, read_only=False)
    groups = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Group.objects.all()
    )
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'password',
            'first_name',
            'middle_name',
            'last_name',
            'second_last_name',
            'cedula_rif',
            'is_active',
            'is_superuser',
            'password_update',
            'groups',
        ]

        extra_kwargs = {
            'password': {
                'write_only': True, 
                'required': False, 
            }
        }
    def create(self, validated_data):
        # 1. Extraemos los campos Many-to-Many para que no estorben en la creación inicial
        groups = validated_data.pop('groups', None)
        permissions = validated_data.pop('user_permissions', None)
        
        # 2. Usamos create_user (Manejador oficial de Django)
        # Este método ya cifra la contraseña automáticamente y guarda el usuario
        user = User.objects.create_user(**validated_data)
        
        # 3. Ahora que el usuario existe, asignamos los grupos y permisos si vienen en los datos
        if groups:
            user.groups.set(groups)
        if permissions:
            user.user_permissions.set(permissions)

        return user
    
    def to_representation(self, instance):
        """
        Este método cambia cómo se ven los datos al salir (GET).
        Convertimos los IDs de los grupos en objetos completos.
        """
        response = super().to_representation(instance)
        # Sobrescribimos el campo groups en la respuesta con el serializador detallado
        response['groups'] = GroupSerializer(instance.groups.all(), many=True).data
        return response
    
    def update(self, instance, validated_data):
        # 1. Extraemos los grupos (y permisos si los usas)
        groups = validated_data.pop('groups', None)
        
        # 2. Actualizamos el resto de los campos del usuario
        # password se maneja aparte si decides cambiarla aquí
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()

        # 3. Sincronizamos los grupos (El método .set() reemplaza los anteriores)
        if groups is not None:
            # Forzamos la limpieza de los grupos actuales
            instance.groups.clear()

            instance.groups.set(groups)

        return instance


class UserPasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'password',
        ]

class UserPasswordDefaultSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id'
        ]