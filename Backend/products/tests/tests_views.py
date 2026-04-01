from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from products.models import Product
from users.models import User

class ProductIntegrationTests(APITestCase):
    def setUp(self):
        # Creamos usuario de prueba
        self.user = User.objects.create_user(email="tester@gmail.com", password="123123123")
        
        # Creamos productos
        self.product = Product.objects.create(
            product_name = "cuaderno",
            product_description = "para tomar notas",
            quantity = 50,
            price = 2.10,
            user_creation = self.user
        )

        self.url = reverse("products-list")
    
    def test_get_list_products(self):

        # login
        self.client.force_authenticate(user=self.user)

        # Verifica que el endpoint devuelva la lista de productos.
        response = self.client.get(self.url)

        # Verificamos que la respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verifiamos que el dato en la respuesta coincida con lo que creamos
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['product_name'], self.product.product_name)
    
    def test_post_create_product(self):
        # Verifica que el endpoint permita crear un nuevo producto.
        new_product = {
            "product_name": "libreta",
            "product_description": "para escribir",
            "quantity": 100,
            "price": 2.80,
            "user_creation": self.user.id
        }
        
        # login
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, new_product, format='json')

        # Verificamos que la respuesta sea 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verificamos que el producto se haya creado correctamente
        self.assertEqual(Product.objects.count(), 2)
        self.assertEqual(Product.objects.last().product_name, new_product['product_name'])
    
    def test_post_create_product_invalid(self):
        # Verifica que el endpoint maneje datos inválidos correctamente.
        invalid_product = {
            "product_name": "",
            "product_description": "para escribir",
            "quantity": -10,
            "price": "abc",
            "user_creation": self.user.id
        }

        # login
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, invalid_product, format='json')

        # Verificamos que la respuesta sea 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Verificamos que no se haya creado ningún producto nuevo
        self.assertEqual(Product.objects.count(), 1)
    
    def test_delete_product(self):
        # Probamos en borrar un producto existente
        url_detail = reverse('products-detail', kwargs={'pk': self.product.id})

        # login
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(url_detail)

        # Verificamos el codigo 204 (No Content)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Confirmamos que ya no existe en la BD

        self.assertEqual(Product.objects.count(), 0)
    
    def test_put_product(self):
        url_detail = reverse('products-detail', kwargs={'pk': self.product.id})

        put_product = {
            "product_name": "cuaderno pro",
            "product_description": "para tomar notas edicion 2026",
            "quantity": 50,
            "price": 1.85,
            "user_creation": self.user.id
        }

        # login
        self.client.force_authenticate(user=self.user)

        response = self.client.put(url_detail, put_product, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.product.refresh_from_db() # Refrescamos el objeto que ya teníamos
        self.assertEqual(self.product.product_name, put_product["product_name"])
    


