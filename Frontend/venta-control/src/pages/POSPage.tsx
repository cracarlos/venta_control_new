import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/services/productsServices'
import { getSales, createSale } from '@/services/salesServices'
import type { Product } from '@/types/product'
import type { Sale, SaleRegister } from '@/types/sale'
import { toast } from 'sonner'
import { Plus, Minus, Trash2, DollarSign, CreditCard } from 'lucide-react'
import { useTasa } from '@/hooks/useTasa'

const getImageUrl = (image: string | null): string | undefined => {
    if (!image) return undefined;
    if (image.startsWith('http')) return image;
    return `http://localhost:8000${image}`;
}

interface CartItem {
    product: Product
    quantity: number
}

export const POSPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [recentSales, setRecentSales] = useState<Sale[]>([])
    const [cart, setCart] = useState<CartItem[]>([])
    const [paymentType, setPaymentType] = useState<1 | 2 | null>(null)
    const { formatPrice } = useTasa()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [productsData, salesData] = await Promise.all([
                getProducts(),
                getSales()
            ])
            setProducts(productsData)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const todaySales = salesData.filter(sale => {
                const saleDate = new Date(sale.created_at)
                return saleDate >= today
            })
            setRecentSales(todaySales.slice(0, 10))
        } catch {
            toast.error('Error al cargar datos')
        }
    }

    const getAvailableStock = (productId: number) => {
        const cartItem = cart.find(item => item.product.id === productId)
        const product = products.find(p => p.id === productId)
        if (!product) return 0
        const inCart = cartItem ? cartItem.quantity : 0
        return product.quantity - inCart
    }

    const addToCart = (product: Product) => {
        const availableStock = getAvailableStock(product.id)
        if (availableStock <= 0) {
            toast.warning('No hay stock disponible')
            return
        }
        
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id)
            if (existing) {
                if (existing.quantity >= product.quantity) {
                    toast.warning('Stock insuficiente')
                    return prev
                }
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { product, quantity: 1 }]
        })
    }

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    const availableStock = getAvailableStock(productId)
                    const newQty = item.quantity + delta
                    
                    if (newQty <= 0) return item
                    if (newQty > item.product.quantity) {
                        toast.warning('Stock insuficiente')
                        return item
                    }
                    if (delta > 0 && newQty > availableStock + item.quantity) {
                        toast.warning('No hay suficiente stock')
                        return item
                    }
                    return { ...item, quantity: newQty }
                }
                return item
            }).filter(item => item.quantity > 0)
        })
    }

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId))
    }

    const cartTotal = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.product.price) * item.quantity)
    }, 0)

    const handlePayment = async () => {
        if (cart.length === 0) {
            toast.error('Agregue productos al carrito')
            return
        }
        if (!paymentType) {
            toast.error('Seleccione tipo de pago')
            return
        }

        const saleData: SaleRegister = {
            payment: cartTotal.toFixed(2),
            sale_type_id: paymentType,
            products: cart.map(item => ({
                product: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            }))
        }

        try {
            await createSale(saleData)
            toast.success('Venta registrada exitosamente')
            setCart([])
            setPaymentType(null)
            loadData()
        } catch (error) {
            const err = error as { detail?: string }
            toast.error(err.detail || 'Error al registrar venta')
        }
    }

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-2 lg:gap-4 h-[calc(100vh-140px)] overflow-auto">
            <Card className="lg:col-span-1 order-2 lg:order-1">
                <CardHeader className="py-2 lg:py-3 px-2 lg:px-4">
                    <CardTitle className="text-xs lg:text-sm">Últimas Ventas</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto h-40 lg:h-auto space-y-2 pb-2 px-2 lg:px-4">
                    {recentSales.length === 0 ? (
                        <p className="text-muted-foreground text-xs lg:text-sm">No hay ventas recientes</p>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                            {recentSales.map(sale => {
                                const price = formatPrice(sale.payment)
                                return (
                                <div key={sale.id} className="flex justify-between items-center p-1 lg:p-2 border rounded-lg">
                                    <div>
                                        <p className="font-medium text-xs">#{sale.id}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(sale.created_at).toLocaleString('es-VE')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600 text-xs">
                                            ${price.usd}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {price.bs} Bs
                                        </p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="lg:col-span-3 order-1 lg:order-2">
                <CardHeader className="py-2 lg:py-3 px-2 lg:px-4">
                    <CardTitle className="text-xs lg:text-sm">Productos</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto h-80 lg:h-auto pb-2 px-2 lg:px-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="border rounded-lg p-2 cursor-pointer hover:bg-accent transition-colors overflow-hidden"
                                onClick={() => addToCart(product)}
                            >
                                {product.image && (
                                    <img 
                                        src={getImageUrl(product.image)} 
                                        alt={product.product_name}
                                        className="w-full h-10 lg:h-20 object-cover rounded-md mb-1"
                                    />
                                )}
                                <p className="font-medium text-xs truncate">{product.product_name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {product.product_description}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        <p className="font-semibold text-green-600 text-xs">
                                            ${formatPrice(product.price).usd}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatPrice(product.price).bs} Bs
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {product.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-1 order-3">
                <CardHeader className="py-2 lg:py-3 px-2 lg:px-4">
                    <CardTitle className="text-xs lg:text-sm">Carrito</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto h-40 lg:h-auto space-y-2 pb-2 px-2 lg:px-4">
                    {cart.length === 0 ? (
                        <p className="text-muted-foreground text-xs lg:text-sm">Carrito vacío</p>
                    ) : (
                        cart.map(item => {
                            const price = formatPrice(item.product.price)
                            return (
                            <div key={item.product.id} className="flex items-center justify-between p-1 lg:p-2 border rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs truncate">{item.product.product_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        ${price.usd} ({price.bs} Bs)
                                    </p>
                                </div>
                                <div className="flex items-center gap-0 lg:gap-1 flex-shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 lg:h-6 w-5 lg:w-6"
                                        onClick={() => updateQuantity(item.product.id, -1)}
                                    >
                                        <Minus className="h-2 w-2" />
                                    </Button>
                                    <span className="w-4 lg:w-5 text-center text-xs">{item.quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 lg:h-6 w-5 lg:w-6"
                                        onClick={() => updateQuantity(item.product.id, 1)}
                                    >
                                        <Plus className="h-2 w-2" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 lg:h-6 w-5 lg:w-6 text-red-500"
                                        onClick={() => removeFromCart(item.product.id)}
                                    >
                                        <Trash2 className="h-2 w-2" />
                                    </Button>
                                </div>
                            </div>
                        )})
                    )}
                </CardContent>

                <div className="p-2 lg:p-3 pt-0 space-y-2 flex-shrink-0">
                    <div className="flex justify-between items-center font-semibold">
                        <span className="text-xs lg:text-sm">Total:</span>
                        <div className="text-right">
                            <span className="text-green-600 text-xs lg:text-sm">${formatPrice(cartTotal).usd}</span>
                            <span className="text-xs lg:text-sm text-muted-foreground ml-1">
                                ({formatPrice(cartTotal).bs} Bs)
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-1">
                        <Button
                            variant={paymentType === 1 ? 'default' : 'outline'}
                            className="flex-1 text-xs py-1 h-7 lg:h-8"
                            onClick={() => setPaymentType(1)}
                        >
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Efectivo</span>
                            <span className="sm:hidden">Efec.</span>
                        </Button>
                        <Button
                            variant={paymentType === 2 ? 'default' : 'outline'}
                            className="flex-1 text-xs py-1 h-7 lg:h-8"
                            onClick={() => setPaymentType(2)}
                        >
                            <CreditCard className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Tarjeta</span>
                            <span className="sm:hidden">Tarj.</span>
                        </Button>
                    </div>

                    <Button
                        className="w-full text-xs py-1 h-7 lg:h-8"
                        onClick={handlePayment}
                        disabled={cart.length === 0 || !paymentType}
                    >
                        Pagar
                    </Button>
                </div>
            </Card>
        </div>
    )
}