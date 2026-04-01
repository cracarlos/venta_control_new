import { useAuthStore } from "@/hooks/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router";

// 1. Definimos una interfaz sencilla para el estado de autenticación
interface AuthState {
  isAuthenticated: boolean;
  passwordUpdate: boolean;
  permissions: string[]; 
}

export const ProtectedRoute = () => {
    const location = useLocation();
    
    const { isAuthenticated, passwordUpdate, permissions }: AuthState = useAuthStore();

    // si está autenticado y intenta acceder a /
    if (isAuthenticated && location.pathname === "/") {
        console.log("pasando")
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
    
    // Si el usuario no ha actualizado su contraseña
    if (isAuthenticated && !passwordUpdate && location.pathname !== "/password-update" ) return <Navigate to="/password-update" replace />
    // Si el usuario está autenticado y ya actualizó su contraseña
    if (isAuthenticated && passwordUpdate && location.pathname === "/password-update" ) {
        if (permissions.includes("dashboard") || permissions.includes("view_sales")){
            console.log("pasando2")
            return <Navigate to="/pos" state={{ from: location }} replace />;
        }
        // return <Navigate to="/dashboard" replace />

    } 
    // if (isAuthenticated && passwordUpdate && location.pathname === "/password-update" ) return <Navigate to="/dashboard" replace />
    
    return <Outlet />;

};