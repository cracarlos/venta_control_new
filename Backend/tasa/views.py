from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .firebase import get_tasa_dolar, get_tasa_euro

class TasaDolarView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        tasa = get_tasa_dolar()
        return Response(tasa)

class TasaEuroView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        tasa = get_tasa_euro()
        return Response(tasa)
