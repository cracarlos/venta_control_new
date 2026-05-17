import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getTasaDolar } from '@/services/tasaServices'

interface TasaContextType {
    tasa: number | null
    loading: boolean
    formatPrice: (priceInDollars: string | number, isBs?: boolean) => { usd: string, bs: string }
}

const TasaContext = createContext<TasaContextType>({
    tasa: null,
    loading: true,
    formatPrice: () => ({ usd: '0.00', bs: '0.00' })
})

export const useTasa = () => useContext(TasaContext)

export function TasaProvider({ children }: { children: ReactNode }) {
    const [tasa, setTasa] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadTasa = async () => {
            try {
                const data = await getTasaDolar()
                setTasa(data.valor)
            } catch {
                setTasa(null)
            } finally {
                setLoading(false)
            }
        }
        loadTasa()
    }, [])

    const formatPrice = (priceInDollars: string | number, isBs = false): { usd: string, bs: string } => {
        const numPrice = typeof priceInDollars === 'string' ? parseFloat(priceInDollars) : priceInDollars
        if (isBs) {
            return { usd: '0.00', bs: numPrice.toFixed(2) }
        }
        const usd = numPrice.toFixed(2)
        const bs = tasa ? (numPrice * tasa).toFixed(2) : '0.00'
        return { usd, bs }
    }

    return (
        <TasaContext.Provider value={{ tasa, loading, formatPrice }}>
            {children}
        </TasaContext.Provider>
    )
}
