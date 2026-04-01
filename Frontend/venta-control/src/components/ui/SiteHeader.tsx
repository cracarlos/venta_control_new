import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./layouts/ModeToggle"
import { DollarSign } from 'lucide-react'
import { useTasa } from '@/hooks/useTasa'

export function SiteHeader() {
    const { tasa, formatPrice } = useTasa()
    
    const price = tasa ? formatPrice(tasa) : null

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">Dashboard</h1>
                <div className="ml-auto flex items-center gap-3 pr-4 lg:pr-6">
                    {price && (
                        <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md border border-green-200 dark:border-green-800">
                            <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
                            <span className="text-green-700 dark:text-green-300 font-semibold text-sm">
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
