# Rest Framework
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
# App
from .models import User
from .serializers import UserSerializer, GroupSerializer, PermissionSerializer, UserPasswordSerializer, UserPasswordDefaultSerializer
from django.contrib.auth.models import Group, Permission

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] 
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('id')


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # Es vital proteger esto, solo administradores deberían tocar permisos
    permission_classes = [IsAuthenticated]

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Normalmente los permisos no se "crean" vía API, sino que nacen con los modelos.
    Por eso usamos ReadOnlyModelViewSet para solo listarlos.
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]


# class UserPasswordUpdateAPIView(viewsets.GenericViewSet):
#     # permission_classes = [IsAuthenticated]
#     serializer_class = UserPasswordSerializer
    
#     @action(detail=False, methods=['post'], url_path='password_update')
#     def password_update(self, request, *args, **kwargs):
#         print(request.data)
#         user = request.user
#         serializer = UserPasswordSerializer(data=request.data)
#         if serializer.is_valid():
#             user = request.user
#             user.set_password(serializer.data.get("password"))
#             # user.save()
#             return Response({"message": "Contraseña actualizada exitosamente."}, status=200)
#         return Response(serializer.errors, status=400)

class UserPasswordUpdateAPIView(APIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = UserPasswordSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        if request.data['password'] != request.data['passwordConfirm']:
            return Response({"message": "Contraseñas no coinciden"}, status=400)

        if serializer.is_valid():
            try:
                user = User.objects.get(id=request.user.id)
                new_password = serializer.validated_data['password']
                user.set_password(new_password)
                user.password_update = True
                user.save()
            except Exception as e:
                print(f"Error: {e}")
                return Response({"message": f"Error en servidor: {e}"}, status=500)
            return Response({"userPasswordChanged": user.password_update, "message": "Contraseña actualizada exitosamente."}, status=200)
        return Response(serializer.errors, status=400)

class UserPasswordDefaultAPIView(APIView):
    serializer_class = UserPasswordDefaultSerializer

    def patch(self, request, pk):
        # print(request.data)
        # serializer = self.serializer_class(data=request.data)
        # if serializer.is_valid():
        try:
            user = User.objects.get(pk=pk)
            user.set_password(user.cedula_rif)
            user.password_update = False
            user.save()
        except Exception as e:
            print(f"Error: {e}")
            return Response({"message": f"Error en servidor: {e}"}, status=500)
        
        return Response({"message": "Contraseña actualizada por defecto."}, status=200)
        
        # return Response(serializer.errors, status=400)


