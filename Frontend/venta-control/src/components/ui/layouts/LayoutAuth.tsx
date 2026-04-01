import { Outlet } from "react-router";
import { Toaster } from "sonner";
export const LayoutAuth = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <Toaster />
      <Outlet />
    </div>
  )
}
