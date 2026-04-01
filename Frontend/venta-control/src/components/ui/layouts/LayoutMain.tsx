import { Outlet } from "react-router";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { SiteHeader } from "../SiteHeader"
import { Toaster } from "@/components/ui/sonner"

export const LayoutMain = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
        <SidebarInset>
            <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <Toaster />
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-2">
                            <Outlet />
                        </div>
                    </div>
                </div>
        </SidebarInset>
    </SidebarProvider>
  )
}
