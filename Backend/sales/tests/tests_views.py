from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from users.models import User
from sales.models import Sales, Sale_products
from products.models import Product
from sales.serializers import SalesSerializer, SaleProductsSerializer

class SalesIntegrationsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="tester@gmail.com", password="123123123")
        self.client.force_authenticate(user=self.user)

        self.sales = Sales.objects.create(
            payment = 12.23
        )

        self.product = Product.objects.create(
            product_name = "libreta",
            product_description = "para tomar notas",
            quantity = 50,
            price = 2.10,
            user_creation = self.user
        )

        self.sales_product = Sale_products.objects.create(
            sale = self.sales,
            product = self.product,
            quantity = 100,
            price = 10
        )

        self.url = reverse("sales-manager")
    
    def test_get_list_sales(self):

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)

        self.assertEqual(float(response.data[0]["payment"]), self.sales.payment)
    
    def test_post_create_sales(self):

        new_sale = {
            "payment": 20.00,
            "sale": self.sales.id,
            "products": [
                {
                    "product": self.product.id,
                    "quantity": 100,
                    "price": 10,
                }
            ]
        }

        response = self.client.post(self.url, new_sale, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.assertEqual(Sales.objects.count(), 2)
        
        self.assertEqual(Sales.objects.last().payment, new_sale["payment"])
        
        self.assertEqual(Sale_products.objects.count(), 2)
       
        self.assertEqual(Sale_products.objects.last().product.id, new_sale["products"][0]["product"])