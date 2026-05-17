#!/usr/bin/env python
"""Entrypoint for the packaged Venta Control backend (PyInstaller)."""

import os
import sys
import signal


def main():
    sys.stdout.reconfigure(line_buffering=True)
    sys.stderr.reconfigure(line_buffering=True)

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "venta_control.settings")
    os.environ.setdefault("DB_ENGINE", "sqlite")
    os.environ.setdefault("BACKEND_PORT", "8000")

    port = int(os.environ["BACKEND_PORT"])

    import django
    from django.core.management import call_command

    media_root = os.environ.get("MEDIA_ROOT")
    if media_root:
        os.makedirs(media_root, exist_ok=True)

    django.setup()

    print("[VentaControl] Running database migrations...", flush=True)
    call_command("migrate", verbosity=0)

    from django.contrib.auth import get_user_model

    User = get_user_model()
    if not User.objects.filter(is_superuser=True).exists():
        print("[VentaControl] Creating default admin user (admin@admin.com / admin)...", flush=True)
        User.objects.create_superuser(
            email="admin@admin.com",
            password="admin",
            first_name="Admin",
            last_name="Admin",
            cedula_rif="V-00000000",
        )

    from sales.models import SalesType
    if not SalesType.objects.exists():
        print("[VentaControl] Creating default sales types...", flush=True)
        SalesType.objects.create(type="Efectivo")
        SalesType.objects.create(type="Tarjeta")

    print(f"[VentaControl] Starting server on http://127.0.0.1:{port}", flush=True)

    try:
        from waitress import serve
        from venta_control.wsgi import application

        serve(application, host="127.0.0.1", port=port)
    except ImportError:
        call_command("runserver", f"127.0.0.1:{port}", "--noreload")


if __name__ == "__main__":
    main()
