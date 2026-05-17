import os
import shutil

from django.conf import settings
from django.db import connections
from django.http import FileResponse, HttpResponse
from django.utils.timezone import now

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class BackupDatabaseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        db_path = settings.DATABASES["default"]["NAME"]
        if not os.path.exists(db_path):
            return Response({"error": "Base de datos no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        timestamp = now().strftime("%Y%m%d_%H%M%S")
        filename = f"venta_control_backup_{timestamp}.db"
        return FileResponse(
            open(db_path, "rb"),
            as_attachment=True,
            filename=filename,
            content_type="application/octet-stream",
        )


class RestoreDatabaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "Debe enviar un archivo .db"}, status=status.HTTP_400_BAD_REQUEST)

        if not file.name.endswith(".db"):
            return Response({"error": "El archivo debe tener extensión .db"}, status=status.HTTP_400_BAD_REQUEST)

        db_path = settings.DATABASES["default"]["NAME"]

        try:
            connections.close_all()

            backup_path = db_path + ".bak"
            if os.path.exists(db_path):
                shutil.copy2(db_path, backup_path)

            with open(db_path, "wb+") as f:
                for chunk in file.chunks():
                    f.write(chunk)

            return Response({"message": "Base de datos restaurada correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            if os.path.exists(backup_path):
                shutil.copy2(backup_path, db_path)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
