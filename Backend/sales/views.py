from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from django.db.models import Sum, Count, F
from .models import Sales, Sale_products, SalesType
from products.models import Product
from .serializers import SalesSerializer, SaleProductsSerializer, SalesTypeSerializer
from tasa.firebase import get_tasa_dolar

class SalesManagerApiVIew(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        sales = self.get_sales_queryset(request)
        serializer = SalesSerializer(sales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        try:
            try:
                data = request.data
            except Exception:
                import json
                data = json.loads(request.body)
            
            tasa = 0
            try:
                tasa_data = get_tasa_dolar()
                if tasa_data:
                    tasa = float(tasa_data.get('valor', 0))
            except Exception:
                pass
            
            payment_usd = float(data.get('payment', 0))
            bs_payment = payment_usd * tasa
            
            sale_type = None
            sale_type_id = data.get('sale_type_id')
            if sale_type_id:
                try:
                    sale_type = SalesType.objects.get(id=sale_type_id)
                except SalesType.DoesNotExist:
                    pass
            
            resp = Sales.objects.create(
                payment=payment_usd,
                bs_payment=bs_payment,
                sale_type=sale_type
            )
            
            for product in data.get("products", []):
                product_obj = Product.objects.get(id=product["product"])
                
                if product_obj.quantity < product["quantity"]:
                    resp.delete()
                    return Response(
                        {"error": f"Stock insuficiente para {product_obj.product_name}. Disponible: {product_obj.quantity}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                product_obj.quantity -= product["quantity"]
                product_obj.save()
                
                price_usd = float(product["price"])
                bs_price = price_usd * tasa
                
                Sale_products.objects.create(
                    sale=resp,
                    product_id=product["product"],
                    quantity=product["quantity"],
                    price=product["price"],
                    bs_price=bs_price
                )
            
            return Response(SalesSerializer(resp, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            import traceback
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        for product in request.data["products"]:
            product_obj = Product.objects.get(id=product["product"])
            
            if product_obj.quantity < product["quantity"]:
                resp.delete()
                return Response(
                    {"error": f"Stock insuficiente para {product_obj.product_name}. Disponible: {product_obj.quantity}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            product_obj.quantity -= product["quantity"]
            product_obj.save()
            
            price_usd = float(product["price"])
            bs_price = price_usd * tasa
            
            sale_products_data = {
                "sale": resp.id,
                "product": product["product"],
                "quantity": product["quantity"],
                "price": product["price"],
            }
            try:
                sp = Sale_products.objects.create(
                    **sale_products_data,
                    bs_price=bs_price
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(SalesSerializer(resp, context={'request': request}).data, status=status.HTTP_201_CREATED)

    def get_sales_queryset(self, request):
        from django.utils import timezone
        
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        period = request.query_params.get('period')
        
        sales = Sales.objects.select_related('sale_type').all().order_by('-created_at')
        
        if period:
            now = timezone.now()
            local_now = now.astimezone(timezone.get_current_timezone())
            today_local = local_now.date()
            
            if period == 'day':
                sales = sales.filter(created_at__date=today_local)
            elif period == 'week':
                week_start = local_now - timedelta(days=local_now.weekday())
                sales = sales.filter(created_at__date__gte=week_start.date())
            elif period == 'month':
                month_start = local_now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                sales = sales.filter(created_at__date__gte=month_start.date())
            elif start_date and end_date:
                sales = sales.filter(created_at__date__range=[start_date, end_date])
        
        return sales

class SalesReportPdfView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        sales = SalesManagerApiVIew().get_sales_queryset(request)
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="reporte_ventas.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=landscape(letter), rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=1
        )
        elements.append(Paragraph("Reporte de Ventas", title_style))
        
        elements.append(Spacer(1, 20))
        
        data = [['ID', 'Fecha', 'Tipo', 'Total ($)', 'Total (Bs)', 'Productos']]
        
        total_general_usd = 0
        total_general_bs = 0
        for sale in sales:
            payment_usd = float(sale.payment)
            payment_bs = float(sale.bs_payment) if sale.bs_payment else 0
            total_general_usd += payment_usd
            total_general_bs += payment_bs
            productos = sale.sale_products.count()
            sale_type = sale.sale_type.type if sale.sale_type else '-'
            data.append([
                str(sale.id),
                sale.created_at.strftime('%d/%m/%Y %H:%M'),
                sale_type,
                f"{payment_usd:.2f}",
                f"{payment_bs:.2f}",
                str(productos)
            ])
        
        data.append(['', '', 'TOTAL', f"{total_general_usd:.2f}", f"{total_general_bs:.2f}", ''])
        
        table = Table(data, colWidths=[40, 90, 60, 60, 70, 60])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        elements.append(table)
        
        doc.build(elements)
        return response

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        now = timezone.now()
        local_now = now.astimezone(timezone.get_current_timezone())
        
        today_start = local_now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        week_start = local_now - timedelta(days=local_now.weekday())
        month_start = local_now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        total_today_usd = Sales.objects.filter(created_at__date=today_start.date()).aggregate(Sum('payment'))['payment__sum'] or 0
        total_week_usd = Sales.objects.filter(created_at__date__gte=week_start.date()).aggregate(Sum('payment'))['payment__sum'] or 0
        total_month_usd = Sales.objects.filter(created_at__date__gte=month_start.date()).aggregate(Sum('payment'))['payment__sum'] or 0
        total_all_usd = Sales.objects.aggregate(Sum('payment'))['payment__sum'] or 0
        
        total_today_bs = Sales.objects.filter(created_at__date=today_start.date()).aggregate(Sum('bs_payment'))['bs_payment__sum'] or 0
        total_week_bs = Sales.objects.filter(created_at__date__gte=week_start.date()).aggregate(Sum('bs_payment'))['bs_payment__sum'] or 0
        total_month_bs = Sales.objects.filter(created_at__date__gte=month_start.date()).aggregate(Sum('bs_payment'))['bs_payment__sum'] or 0
        total_all_bs = Sales.objects.aggregate(Sum('bs_payment'))['bs_payment__sum'] or 0
        
        count_today = Sales.objects.filter(created_at__date=today_start.date()).count()
        count_week = Sales.objects.filter(created_at__date__gte=week_start.date()).count()
        count_month = Sales.objects.filter(created_at__date__gte=month_start.date()).count()
        
        top_products = (
            Sale_products.objects
            .values('product__product_name')
            .annotate(
                total_vendido=Sum('quantity'),
                total_recaudado_usd=Sum(F('price') * F('quantity')),
                total_recaudado_bs=Sum(F('bs_price') * F('quantity'))
            )
            .order_by('-total_vendido')[:5]
        )
        
        last_7_days = []
        for i in range(6, -1, -1):
            day = local_now - timedelta(days=i)
            day_usd = Sales.objects.filter(created_at__date=day.date()).aggregate(Sum('payment'))['payment__sum'] or 0
            day_bs = Sales.objects.filter(created_at__date=day.date()).aggregate(Sum('bs_payment'))['bs_payment__sum'] or 0
            last_7_days.append({
                'date': day.strftime('%d/%m'),
                'total_usd': float(day_usd),
                'total_bs': float(day_bs)
            })
        
        return Response({
            'total_today_usd': float(total_today_usd),
            'total_week_usd': float(total_week_usd),
            'total_month_usd': float(total_month_usd),
            'total_all_usd': float(total_all_usd),
            'total_today_bs': float(total_today_bs),
            'total_week_bs': float(total_week_bs),
            'total_month_bs': float(total_month_bs),
            'total_all_bs': float(total_all_bs),
            'count_today': count_today,
            'count_week': count_week,
            'count_month': count_month,
            'top_products': list(top_products),
            'last_7_days': last_7_days
        }, status=status.HTTP_200_OK)

class SalesTypeListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        sales_types = SalesType.objects.all()
        serializer = SalesTypeSerializer(sales_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = SalesTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SalesTypeRetrieveUpdateDestroyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        try:
            sales_type = SalesType.objects.get(pk=pk)
        except SalesType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SalesTypeSerializer(sales_type)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        try:
            sales_type = SalesType.objects.get(pk=pk)
        except SalesType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SalesTypeSerializer(sales_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try:
            sales_type = SalesType.objects.get(pk=pk)
        except SalesType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        sales_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
