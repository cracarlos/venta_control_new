from django.test import TestCase
from sales.serializers import SalesSerializer, SaleProductsSerializer
from sales.models import Sales
from products.models import Product
from users.models import User
from sales.serializers import SalesSerializer, SaleProductsSerializer

class SalesSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="tester@gmail.com", password="123123123")

        self.sales = Sales.objects.create(payment=100.00)

        self.product = Product.objects.create(
            product_name = "libreta",
            product_description = "para tomar notas",
            quantity = 50,
            price = 2.10,
            user_creation = self.user
        )

    def test_payment_is_cero(self):
        data = {
            "payment": 0
        }

        serializer = SalesSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("payment", serializer.errors)
    
    def test_payment_is_negative(self):
        
        data = {
            "payment": -10
        }

        serializer = SalesSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("payment", serializer.errors)
    
    def test_sales_product_is_ok(self):
        
        data = {
            "payment": 23.56
        }

        serializer = SalesSerializer(data=data)

        self.assertTrue(serializer.is_valid())

    def test_quantity_is_cero(self):
        
        data = {
            "quantity": 0,
            "product": 1,
            "price": 10.00
        }

        serializer = SaleProductsSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("quantity", serializer.errors)
    
    def test_quantity_is_negative(self):
        
        data = {
            "quantity": -5.2,
            "product": 1,
            "price": 10.00
        }

        serializer = SaleProductsSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("quantity", serializer.errors)
    
    def test_price_is_cero(self):
        
        data = {
            "quantity": 10,
            "product": 1,
            "price": 0
        }

        serializer = SaleProductsSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("price", serializer.errors)
    
    def test_price_is_negative(self):
        
        data = {
            "quantity": 10,
            "product": 1,
            "price": -4.20
        }

        serializer = SaleProductsSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertIn("price", serializer.errors)
    
    
    def test_sales_product_is_ok(self):
        
        data = {
            "sale": self.sales.id,
            "product": self.product.id,
            "quantity": 10,
            "price": 4.20
        }
        

        serializer = SaleProductsSerializer(data=data)
            
        self.assertTrue(serializer.is_valid(), serializer.errors)

