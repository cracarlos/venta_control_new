import { useLocation } from "react-router";
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./layouts/ModeToggle"
import { TrendingUp } from 'lucide-react'
import { useTasa } from '@/hooks/useTasa'

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pos": "Caja / POS",
  "/sales": "Ventas",
  "/users": "Usuarios",
  "/roles": "Roles",
  "/products": "Productos",
  "/settings": "Configuración",
}

export function SiteHeader() {
    const location = useLocation()
    const { tasa, formatPrice } = useTasa()

    const title = PAGE_TITLES[location.pathname] || "Venta Control"
    const price = tasa && tasa > 0 ? formatPrice(tasa) : null

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{title}</h1>
                <div className="ml-auto flex items-center gap-3 pr-4 lg:pr-6">
                    {price && (
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm tabular-nums">
                                ${price.usd}
                            </span>
                        </div>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
