import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSalesByFilter } from '@/services/salesServices'
import type { Sale } from '@/types/sale'
import { toast } from 'sonner'
import { DollarSign, Calendar, FileDown, Loader2 } from 'lucide-react'
import { useTasa } from '@/hooks/useTasa'

interface SaleWithTotal extends Sale {
    sale_products?: { length: number }[]
    total_items: number
}

export const SalesPage = () => {
    const [sales, setSales] = useState<SaleWithTotal[]>([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentParams, setCurrentParams] = useState('')
    const [exporting, setExporting] = useState(false)
    const { formatPrice } = useTasa()

    useEffect(() => {
        loadSales('day')
    }, [])

    const loadSales = async (period?: string, start?: string, end?: string) => {
        try {
            const params = new URLSearchParams()
            if (period) {
                params.append('period', period)
            }
            if (start && end) {
                params.append('start_date', start)
                params.append('end_date', end)
            }
            
            const paramString = params.toString()
            setCurrentParams(paramString)
            
            const data = await getSalesByFilter(paramString)
            setSales(data as SaleWithTotal[])
        } catch {
            toast.error('Error al cargar ventas')
        }
    }

    const handleExportPdf = async () => {
        if (sales.length === 0) {
            toast.error('No hay ventas para exportar')
            return
        }
        
        setExporting(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:8000/api/v1/sales/report/pdf/?${currentParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if (!response.ok) throw new Error('Error al exportar')
            
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            a.remove()
            
            toast.success('PDF exportado correctamente')
        } catch {
            toast.error('Error al exportar PDF')
        } finally {
            setExporting(false)
        }
    }

    const handleDateFilter = () => {
        if (!startDate || !endDate) {
            toast.error('Seleccione ambas fechas')
            return
        }
        loadSales(undefined, startDate, endDate)
    }

    const totalVentas = sales.reduce((sum, sale) => sum + parseFloat(sale.payment), 0)

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Consultar Ventas
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => loadSales('day')}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Hoy
                        </Button>
                        <Button variant="outline" onClick={() => loadSales('week')}>
                            Semana
                        </Button>
                        <Button variant="outline" onClick={() => loadSales('month')}>
                            Mes
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-end gap-4">
                        <div>
                            <Label htmlFor="start_date">Desde</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end_date">Hasta</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleDateFilter}>Consultar</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Resultados</CardTitle>
                    <Button 
                        variant="outline" 
                        onClick={handleExportPdf}
                        disabled={sales.length === 0 || exporting}
                    >
                        {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
                        Exportar PDF
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-semibold mb-4">
                        Total: <span className="text-green-600">${formatPrice(totalVentas).usd}</span>
                        <span className="text-muted-foreground ml-1">
                            ({formatPrice(totalVentas).bs} Bs)
                        </span>
                        <span className="text-muted-foreground ml-4">
                            ({sales.length} venta{sales.length !== 1 ? 's' : ''})
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">ID</th>
                                    <th className="text-left p-2">Fecha</th>
                                    <th className="text-left p-2">Tipo</th>
                                    <th className="text-left p-2">Productos</th>
                                    <th className="text-right p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-muted-foreground">
                                            No hay ventas en este período
                                        </td>
                                    </tr>
                                ) : (
                                    sales.map(sale => (
                                        <tr key={sale.id} className="border-b hover:bg-accent">
                                            <td className="p-2">#{sale.id}</td>
                                            <td className="p-2">
                                                {new Date(sale.created_at).toLocaleString('es-VE')}
                                            </td>
                                            <td className="p-2">
                                                {sale.sale_type?.type || '-'}
                                            </td>
                                            <td className="p-2">
                                                {sale.sale_products?.length || 0} producto{sale.sale_products?.length !== 1 ? 's' : ''}
                                            </td>
                                            <td className="p-2 text-right">
                                                <span className="font-medium text-green-600">${formatPrice(sale.payment).usd}</span>
                                                <span className="text-muted-foreground ml-1 text-xs">
                                                    ({formatPrice(sale.payment).bs} Bs)
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}