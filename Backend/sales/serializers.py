from rest_framework import serializers
from .models import Sales, Sale_products, SalesType
from products.serializers import ProductSaleDetailSerializer, ProductSerializer

class SalesTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesType
        fields = ['id', 'type']

def validate_payment_or_price(value):
    if value <= 0:
        raise serializers.ValidationError("payment no puede ser negativo ni igual a cero.")
    return value

class SaleProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale_products
        fields = [
            'id',
            'sale',
            'product',
            'quantity',
            'price'
        ]
        extra_kwargs = {
            'quantity': {'validators': [validate_payment_or_price] },
            'price': {'validators': [validate_payment_or_price] }
        }

class SaleProductsGetSerializer(serializers.ModelSerializer):
    product = ProductSaleDetailSerializer(read_only=True)
    class Meta:
        model = Sale_products
        fields = [
            'id',
            'sale',
            'product',
            'quantity',
            'price',
            'bs_price'
        ]
        extra_kwargs = {
            'quantity': {'validators': [validate_payment_or_price] },
            'price': {'validators': [validate_payment_or_price] }
        }
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['bs_price'] = instance.bs_price
        return data

class SalesSerializer(serializers.ModelSerializer):
    sale_type_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    sale_type = SalesTypeSerializer(read_only=True)
    sale_products = SaleProductsGetSerializer(many=True, read_only=True, required=False)
    class Meta:
        model = Sales
        fields = [
            'id',
            'payment',
            'sale_type_id',
            'sale_type',
            'sale_products',
            'created_at',
            'updated_at'
        ]
        extra_kwargs = {
            'payment': {'validators': [validate_payment_or_price] }
        }
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['bs_payment'] = instance.bs_payment
        return data
    
    def create(self, validated_data):
        sale_type_id = validated_data.pop('sale_type_id', None)
        if sale_type_id:
            validated_data['sale_type'] = SalesType.objects.get(id=sale_type_id)
        return super().create(validated_data)
