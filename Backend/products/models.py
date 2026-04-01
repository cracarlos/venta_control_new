from django.db import models
from crum import get_current_user
from core.models import BaseModel


class Product( BaseModel ):
    product_name = models.CharField(max_length=40)
    product_description = models.CharField(max_length=200)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    def save(self, *args, **kwargs):
        user = get_current_user()
        if user is not None:
            if not self.pk:
                self.user_creation = user
            else:
                self.user_update = user
        super(Product, self).save()
