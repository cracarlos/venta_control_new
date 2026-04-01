import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { DollarSign, ShoppingCart, Package } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useTasa } from '@/hooks/useTasa'

interface TopProduct {
    product__product_name: string
    total_vendido: number
    total_recaudado: number
}

interface DashboardStats {
    total_today: number
    total_week: number
    total_month: number
    total_all: number
    count_today: number
    count_week: number
    count_month: number
    top_products: TopProduct[]
    last_7_days: { date: string; total: number }[]
}

export function DashboardCards() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const { formatPrice } = useTasa()

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:8000/api/v1/sales/dashboard/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error('Error loading dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

    if (loading) {
        return <div className="p-4">Cargando...</div>
    }

    return (
        <div className="space-y-4 p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                <Card>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm">Ventas Hoy</CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-green-600">
                            ${formatPrice(stats?.total_today || 0).usd}
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <span className="text-xs">{formatPrice(stats?.total_today || 0).bs} Bs</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">{stats?.count_today || 0} ventas</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm">Semana</CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-green-600">
                            ${formatPrice(stats?.total_week || 0).usd}
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <span className="text-xs">{formatPrice(stats?.total_week || 0).bs} Bs</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">{stats?.count_week || 0} ventas</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm">Este Mes</CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-green-600">
                            ${formatPrice(stats?.total_month || 0).usd}
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <span className="text-xs">{formatPrice(stats?.total_month || 0).bs} Bs</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">{stats?.count_month || 0} ventas</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm">Histórico</CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-green-600">
                            ${formatPrice(stats?.total_all || 0).usd}
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <span className="text-xs">{formatPrice(stats?.total_all || 0).bs} Bs</span>
                        <div className="flex items-center gap-1 md:gap-2">
                            <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">Total</span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base md:text-lg">Ventas - Últimos 7 Días</CardTitle>
                    </CardHeader>
                    <div className="h-48 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.last_7_days || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{fontSize: 10}} />
                                <YAxis tick={{fontSize: 10}} />
                                <Tooltip formatter={(value) => {
                                    const price = formatPrice(value as number)
                                    return [`$${price.usd} (${price.bs} Bs)`, 'Ventas']
                                }} />
                                <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base md:text-lg">Productos Más Vendidos</CardTitle>
                    </CardHeader>
                    <div className="h-48 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.top_products || []}
                                    dataKey="total_vendido"
                                    nameKey="product__product_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    label={({ payload }) => `${payload?.product__product_name?.substring(0, 8) || ''}: ${payload?.total_vendido || 0}`}
                                >
                                    {(stats?.top_products || []).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, _, props) => [value + ' un.', props.payload.product__product_name]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Top 5 Productos</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Más vendidos históricamente</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Producto</th>
                                <th className="text-right p-2">Cant.</th>
                                <th className="text-right p-2">Total</th>
                            </tr>
                        </thead>
                            <tbody>
                            {(stats?.top_products || []).map((product, index) => {
                                const price = formatPrice(product.total_recaudado)
                                return (
                                <tr key={index} className="border-b hover:bg-accent">
                                    <td className="p-2 flex items-center gap-1 md:gap-2">
                                        <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="truncate max-w-[120px] md:max-w-none">{product.product__product_name}</span>
                                    </td>
                                    <td className="p-2 text-right">{product.total_vendido}</td>
                                    <td className="p-2 text-right">
                                        <span className="text-green-600 font-medium">${price.usd}</span>
                                        <span className="text-muted-foreground text-xs ml-1 hidden md:inline">({price.bs} Bs)</span>
                                    </td>
                                </tr>
                            )})}
                            {(stats?.top_products || []).length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center p-4 text-muted-foreground">
                                        No hay productos vendidos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}