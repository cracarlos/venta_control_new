import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface TopProduct {
    product__product_name: string
    total_vendido: number
    total_recaudado_usd: number
    total_recaudado_bs: number
}

interface DashboardStats {
    total_today_usd: number
    total_week_usd: number
    total_month_usd: number
    total_all_usd: number
    total_today_bs: number
    total_week_bs: number
    total_month_bs: number
    total_all_bs: number
    count_today: number
    count_week: number
    count_month: number
    top_products: TopProduct[]
    last_7_days: { date: string; total_usd: number; total_bs: number }[]
}

function SkeletonCard() {
    return (
        <Card className="animate-pulse">
            <CardHeader className="pb-1 md:pb-2">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-36" />
            </CardHeader>
            <div className="px-3 md:px-6 py-1 md:py-2">
                <Skeleton className="h-4 w-24" />
            </div>
        </Card>
    )
}

const COLORS = ['#0d9488', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

export function DashboardCards() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

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

    if (loading) {
        return (
            <div className="space-y-4 p-2 md:p-4">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card><Skeleton className="h-64 m-4" /></Card>
                    <Card><Skeleton className="h-64 m-4" /></Card>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                <Card className="animate-slide-up bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-card border-emerald-100 dark:border-emerald-900 shadow-sm" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm flex items-center gap-1.5">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            Ventas Hoy
                        </CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                            ${stats?.total_today_usd?.toFixed(2) || '0.00'}
                            <span className="text-xs ml-1.5 text-amber-600 dark:text-amber-400">({stats?.total_today_bs?.toFixed(2) || '0.00'} Bs)</span>
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 md:gap-2">
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">{stats?.count_today || 0} ventas</span>
                        </div>
                    </div>
                </Card>

                <Card className="animate-slide-up bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-card border-teal-100 dark:border-teal-900 shadow-sm" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm">Semana</CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-teal-700 dark:text-teal-400">
                            ${stats?.total_week_usd?.toFixed(2) || '0.00'}
                            <span className="text-xs ml-1.5 text-amber-600 dark:text-amber-400">({stats?.total_week_bs?.toFixed(2) || '0.00'} Bs)</span>
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 md:gap-2">
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">{stats?.count_week || 0} ventas</span>
                        </div>
                    </div>
                </Card>

                <Card className="animate-slide-up bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-card border-amber-100 dark:border-amber-900 shadow-sm" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm">Este Mes</CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-amber-700 dark:text-amber-400">
                            ${stats?.total_month_usd?.toFixed(2) || '0.00'}
                            <span className="text-xs ml-1.5">({stats?.total_month_bs?.toFixed(2) || '0.00'} Bs)</span>
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 md:gap-2">
                            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">{stats?.count_month || 0} ventas</span>
                        </div>
                    </div>
                </Card>

                <Card className="animate-slide-up bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/20 dark:to-card border-sky-100 dark:border-sky-900 shadow-sm" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                    <CardHeader className="pb-1 md:pb-2">
                        <CardDescription className="text-xs md:text-sm">Histórico</CardDescription>
                        <CardTitle className="text-lg md:text-2xl font-semibold tabular-nums text-sky-700 dark:text-sky-400">
                            ${stats?.total_all_usd?.toFixed(2) || '0.00'}
                            <span className="text-xs ml-1.5 text-amber-600 dark:text-amber-400">({stats?.total_all_bs?.toFixed(2) || '0.00'} Bs)</span>
                        </CardTitle>
                    </CardHeader>
                    <div className="px-3 md:px-6 py-1 md:py-2 flex flex-col gap-0.5 md:gap-1 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 md:gap-2">
                            <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs md:text-sm">Total</span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base md:text-lg">Ventas - Últimos 7 Días</CardTitle>
                    </CardHeader>
                    <div className="h-48 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.last_7_days || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="date" tick={{fontSize: 10}} stroke="var(--muted-foreground)" />
                                <YAxis tick={{fontSize: 10}} stroke="var(--muted-foreground)" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        color: 'var(--card-foreground)'
                                    }}
                                    formatter={(_, __, payload) => {
                                        const p = payload?.payload || {}
                                        return [`$${p.total_usd?.toFixed(2) || 0} (${p.total_bs?.toFixed(2) || 0} Bs)`, 'Ventas']
                                    }}
                                />
                                <Bar dataKey="total" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="shadow-sm">
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
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius)',
                                        color: 'var(--card-foreground)'
                                    }}
                                    formatter={(value, _, props) => [value + ' un.', props.payload.product__product_name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base md:text-lg">Top 5 Productos</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Más vendidos históricamente</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 font-medium text-muted-foreground">Producto</th>
                                <th className="text-right p-2 font-medium text-muted-foreground">Cant.</th>
                                <th className="text-right p-2 font-medium text-muted-foreground">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stats?.top_products || []).map((product, index) => {
                                return (
                                <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="p-2 flex items-center gap-1 md:gap-2">
                                        <Package className="h-3 w-3 md:h-4 md:w-4 text-emerald-500 flex-shrink-0" />
                                        <span className="truncate max-w-[120px] md:max-w-none">{product.product__product_name}</span>
                                    </td>
                                    <td className="p-2 text-right tabular-nums">{product.total_vendido}</td>
                                    <td className="p-2 text-right">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">${product.total_recaudado_usd?.toFixed(2)}</span>
                                        <span className="text-muted-foreground text-xs ml-1 hidden md:inline tabular-nums">({product.total_recaudado_bs?.toFixed(2)} Bs)</span>
                                    </td>
                                </tr>
                            )})}
                            {(stats?.top_products || []).length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center p-8 text-muted-foreground">
                                        <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                        <p>No hay productos vendidos aún</p>
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
