import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserAvatarInfo} from '@/components/UserAvatarInfo';
import { useAuthStore } from "@/hooks/useAuthStore";
import { Barcode, DollarSign, LayoutDashboard, NotebookTabs, Receipt, Settings, Shield, Users } from "lucide-react";
import { Link } from "react-router";

export function AppSidebar() {
  const { permissions } = useAuthStore();
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="#">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm">
                  <NotebookTabs className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold tracking-tight">Venta Control</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarMenu>
              {
                permissions.includes("superuser") || permissions.includes("dashboard") ? 
                  <SidebarMenuItem key="dashboard">
                    <SidebarMenuButton asChild>
                      <Link to={"/dashboard"} >
                        <LayoutDashboard />
                        Dashboard
                      </Link> 
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                : null
              }
            </SidebarMenu>
        </SidebarGroup>
        {
          permissions.includes("view_sales") || permissions.includes("view_sale_products") || permissions.includes("superuser") ? (
            <SidebarGroup>
                <SidebarGroupLabel>Ventas</SidebarGroupLabel>
                <SidebarMenu>
                  {
                    permissions.includes("superuser") || permissions.includes("view_sale_products") ? 
                      <SidebarMenuItem key="ventas">
                            <SidebarMenuButton asChild>
                                <Link to={"/pos"}>
                                    <DollarSign />
                                    <span>Caja</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    : null
                  }
                  {
                    permissions.includes("superuser") || permissions.includes("view_sales") ? 
                      <SidebarMenuItem key="ventas-listado">
                          <SidebarMenuButton asChild>
                              <Link to={"/sales"}>
                                  <Receipt />
                                  <span>Ventas</span>
                              </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                    : null
                  }
                 
                </SidebarMenu>
            </SidebarGroup>
          ) : null
        }




        {
          permissions.includes("view_products") || permissions.includes("superuser") ? (
            <SidebarGroup>
                <SidebarGroupLabel>Inventario</SidebarGroupLabel>
                <SidebarMenu>
                  {
                    permissions.includes("superuser") || permissions.includes("view_products") ? 
                      <SidebarMenuItem key="inventarios-produtos">
                          <SidebarMenuButton asChild>
                              <Link to={"/products"}>
                                <Barcode />
                                <span>Productos</span>
                              </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                    : null
                  }
                </SidebarMenu>
            </SidebarGroup>
          ) : null
        }
        
        {
          permissions.includes("view_users") || permissions.includes("superuser") ? (
            <SidebarGroup>
                <SidebarGroupLabel>Usuarios</SidebarGroupLabel>
                <SidebarMenu>
                  {
                    permissions.includes("superuser") || permissions.includes("view_users") ? 
                      <SidebarMenuItem key="user-listado">
                        <SidebarMenuButton asChild>
                          <Link to={"/users"} >
                            <Users />
                            <span>Listado</span>
                          </Link> 
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    : null
                  }
                  {
                    permissions.includes("superuser") || permissions.includes("view_group") ? 
                      <SidebarMenuItem key="roles-listado">
                          <SidebarMenuButton asChild>
                            <Link to={"/roles"} >
                              <Shield />
                              <span>Roles</span>
                            </Link> 
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                    : null
                  }
                </SidebarMenu>
            </SidebarGroup>
          ) : null
        }
        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem key="settings">
              <SidebarMenuButton asChild>
                <Link to={"/settings"}>
                  <Settings />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50">
        <UserAvatarInfo />
      </SidebarFooter>
    </Sidebar>
  )
}
