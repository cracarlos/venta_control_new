from django.db import models

class LoginHistory(models.Model):
    usuario = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    ip = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
