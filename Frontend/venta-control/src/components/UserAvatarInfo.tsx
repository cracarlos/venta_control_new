import { useNavigate } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, LogOut, Settings, UserRound } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"
import { useAuthStore } from "@/hooks/useAuthStore";


export function UserAvatarInfo() {
    const { isMobile } = useSidebar();
    
    const { Logout, email, fullName } = useAuthStore();

    let navigate = useNavigate();

    const handleLogout = async () => {
      
      const resp = await Logout();

      if (resp.refresh != "Este campo es requerido.") {
        
        navigate("/");
      };

    };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src="https://scontent.fccs5-1.fna.fbcdn.net/v/t39.30808-6/486358186_10229982211312032_2656589612710528705_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=lhN-r63O0aUQ7kNvwFzf1tg&_nc_oc=AdkLrrovrt69ZKx-RcImFnwaPmSL9jKjzWOux7A9IaqjmIRv7LL2VgATuou3O-bGdW8&_nc_zt=23&_nc_ht=scontent.fccs5-1.fna&_nc_gid=dhA8TyS4ej1I4YrjwBYQ1A&oh=00_AfsxUSJfTjzKTRSZN_E2hngXhktviQl3eErRpt0h_uOb5Q&oe=6996D484" alt="img" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
              </div>
              <EllipsisVertical />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="https://scontent.fccs5-1.fna.fbcdn.net/v/t39.30808-6/486358186_10229982211312032_2656589612710528705_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=lhN-r63O0aUQ7kNvwFzf1tg&_nc_oc=AdkLrrovrt69ZKx-RcImFnwaPmSL9jKjzWOux7A9IaqjmIRv7LL2VgATuou3O-bGdW8&_nc_zt=23&_nc_ht=scontent.fccs5-1.fna&_nc_gid=dhA8TyS4ej1I4YrjwBYQ1A&oh=00_AfsxUSJfTjzKTRSZN_E2hngXhktviQl3eErRpt0h_uOb5Q&oe=6996D484" alt="img" />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{fullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRound />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Configuraciones
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Salir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
