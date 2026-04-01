from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User

class UsersIntegrataionsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            email= "testing@gmail.com",
            password="123123123",
            first_name = "Jesús",
            last_name = "Ramírez",
            cedula_rif = "v1715369",
            is_active = True,
            is_staff = False,
            is_superuser = False,
            password_update = False
        )

        self.url = reverse("users-list")
        self.client.force_authenticate(user=self.user)
    
    def test_get_list_users(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["email"], self.user.email)
    
    def test_post_create_user(self):
        new_user = {
            "email": "newuser@example.com",
            "password": "newpassword123",
            "first_name": "New",
            "last_name": "User",
            "cedula_rif": "v12345678",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False,
            "password_update": False
        }

        response = self.client.post(self.url, new_user, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(User.objects.count(), 2)

        self.assertEqual(User.objects.last().email, new_user["email"])
    
    def test_put_edit_user(self):
        url_detail = reverse("users-detail", kwargs={"pk": self.user.id})

        user_edit = {
            "email": "edit@example.com",
            "password": "newpassword123",
            "first_name": "New",
            "last_name": "User edit",
            "cedula_rif": "v12345678",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False,
            "password_update": True
        }

        response = self.client.put(url_detail, user_edit, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()

        self.assertEqual(self.user.email, user_edit["email"])
    
    def test_delete_user(self):
        url_detail = reverse("users-detail", kwargs={"pk": self.user.id})

        response = self.client.delete(url_detail)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertEqual(User.objects.count(), 0)

