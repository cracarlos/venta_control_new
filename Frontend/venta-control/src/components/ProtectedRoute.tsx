import { useAuthStore } from "@/hooks/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router";

interface AuthState {
  isAuthenticated: boolean;
  passwordUpdate: boolean;
  permissions: string[];
}

const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard": ["superuser", "dashboard"],
  "/pos": ["superuser", "view_sale_products", "add_sale"],
  "/sales": ["superuser", "view_sales", "add_sale"],
  "/products": ["superuser", "view_products", "add_product", "change_product", "delete_product"],
  "/users": ["superuser", "view_user", "add_user", "change_user", "delete_user"],
  "/roles": ["superuser", "view_group", "add_group", "change_group", "delete_group"],
};

export const ProtectedRoute = () => {
    const location = useLocation();
    
    const { isAuthenticated, passwordUpdate, permissions }: AuthState = useAuthStore();

    if (isAuthenticated && location.pathname === "/") {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    if (isAuthenticated && !passwordUpdate && location.pathname !== "/password-update" ) {
        return <Navigate to="/password-update" replace />
    }

    if (isAuthenticated && passwordUpdate && location.pathname === "/password-update") {
        const redirect = getFirstAllowedRoute(permissions);
        return <Navigate to={redirect} replace />
    }

    if (isAuthenticated && passwordUpdate && location.pathname !== "/password-update") {
        const allowedRoutes = getAllowedRoutes(permissions);
        if (!allowedRoutes.includes(location.pathname)) {
            const redirect = getFirstAllowedRoute(permissions);
            return <Navigate to={redirect} replace />
        }
    }
    
    return <Outlet />;

};

function getFirstAllowedRoute(permissions: string[]): string {
    const routes = Object.keys(ROUTE_PERMISSIONS);
    for (const route of routes) {
        const routePerms = ROUTE_PERMISSIONS[route];
        if (routePerms.some(p => permissions.includes(p))) {
            return route;
        }
    }
    return "/dashboard";
}

function getAllowedRoutes(permissions: string[]): string[] {
    const allowed: string[] = [];
    for (const [route, routePerms] of Object.entries(ROUTE_PERMISSIONS)) {
        if (routePerms.some(p => permissions.includes(p))) {
            allowed.push(route);
        }
    }
    return allowed;
}