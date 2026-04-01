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
import { Barcode, DollarSign, LayoutDashboard, NotebookTabs, Receipt, Shield, Users } from "lucide-react";
import { Link } from "react-router";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <NotebookTabs />
                <span className="text-base font-semibold">Venta Control</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem key="dashboard">
                    <SidebarMenuButton asChild>
                      <Link to={"/dashboard"} >
                        <LayoutDashboard />
                        Dashboard
                      </Link> 
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>Ventas</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem key="ventas">
                    <SidebarMenuButton asChild>
                        <Link to={"/pos"}>
                            <DollarSign />
                            <span>Caja</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="ventas-listado">
                    <SidebarMenuButton asChild>
                        <Link to={"/sales"}>
                            <Receipt />
                            <span>Ventas</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>Inventario</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem key="inventarios-produtos">
                    <SidebarMenuButton asChild>
                        <Link to={"/products"}>
                          <Barcode />
                          <span>Productos</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>Usuarios</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem key="user-listado">
                    <SidebarMenuButton asChild>
                      <Link to={"/users"} >
                        <Users />
                        <span>Listado</span>
                      </Link> 
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="roles-listado">
                    <SidebarMenuButton asChild>
                      <Link to={"/roles"} >
                        <Shield />
                        <span>Roles</span>
                      </Link> 
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <UserAvatarInfo />
      </SidebarFooter>
    </Sidebar>
  )
}