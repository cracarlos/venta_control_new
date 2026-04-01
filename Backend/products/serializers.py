from rest_framework import serializers
from .models import Product

def validate_product_description(value):
    if len(value) < 5:
        raise serializers.ValidationError("Tiene que contener al menos 5 caracteres")
    return value

def validate_product_name(value):
    if len(value) < 2:
        raise serializers.ValidationError("Tiene que contener al menos 2 caracteres")
    return value

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'product_name': {'validators': [validate_product_name] },
            'product_description': {'validators': [validate_product_description] }
        }
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("price no puede ser negativo ni igual a cero.")
        return value
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("quantity no puede ser negativo ni igual a cero.")
        return value
    
class ProductSaleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'product_name', 'product_description']
        extra_kwargs = {
            'product_name': {'validators': [validate_product_name] },
            'product_description': {'validators': [validate_product_name] }
        }