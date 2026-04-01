from django.test import TestCase
from products.serializers import ProductSerializer
from users.models import User

class ProductSerializerTests(TestCase):
    def test_price_isnegative_invalid(self):

        data = {
            "product_name": "mesa",
            "product_description": "mesa bonita y hermosa",
            "quantity": 25,
            "price": -10.00,
            "user_creation": 1
        }

        serializer = ProductSerializer(data=data)

        # Validamos, tiene que arrojar falso
        self.assertFalse(serializer.is_valid())

        self.assertIn('price', serializer.errors)
    
    def test_quantity_iscero_invalid(self):

        data = {
            "product_name": "mesa",
            "product_description": "mesa bonita y hermosa",
            "quantity": 0,
            "price": 10.00,
            "user_creation": 1
        }

        serializer = ProductSerializer(data=data)

        # Validamos, tiene que arrojar falso
        self.assertFalse(serializer.is_valid())

        self.assertIn('quantity', serializer.errors)
    
    def test_product_name_invalid(self):

        data = {
            "product_name": "m",
            "product_description": "mesa bonita y hermosa",
            "quantity": 10,
            "price": 10.00,
            "user_creation": 1
        }

        serializer = ProductSerializer(data=data)

        # Validamos, tiene que arrojar falso
        self.assertFalse(serializer.is_valid())

        self.assertIn('product_name', serializer.errors)
    
    def test_product_description_invalid(self):

        data = {
            "product_name": "mesa",
            "product_description": "ola",
            "quantity": 10,
            "price": 10.00,
            "user_creation": 1
        }

        serializer = ProductSerializer(data=data)

        # Validamos, tiene que arrojar falso
        self.assertFalse(serializer.is_valid())

        self.assertIn('product_description', serializer.errors)
