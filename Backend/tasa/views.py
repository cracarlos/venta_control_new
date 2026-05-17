from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .firebase import get_tasa_dolar, get_tasa_euro

class TasaDolarView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            tasa = get_tasa_dolar()
        except Exception:
            tasa = {"valor": 0, "estatus": False}
        return Response(tasa)

class TasaEuroView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            tasa = get_tasa_euro()
        except Exception:
            tasa = {"valor": 0, "estatus": False}
        return Response(tasa)
