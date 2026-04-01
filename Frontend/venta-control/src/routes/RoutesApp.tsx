import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LayoutAuth } from "@/components/ui/layouts/LayoutAuth";
import { LayoutMain } from "@/components/ui/layouts/LayoutMain";
import { UserPasswordUpdate } from "@/components/UserPasswordUpdate";
import { AuthPage } from "@/pages/AuthPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { POSPage } from "@/pages/POSPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { SalesPage } from "@/pages/SalesPage";
import { UsersPage } from "@/pages/UsersPage";
import { HashRouter, Routes, Route, Navigate } from "react-router";


export const RoutesApp = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Rutas públicas - sin protección */}
        <Route element={<LayoutAuth />}>
          <Route index element={<AuthPage />} />
          <Route path="password-update" element={<UserPasswordUpdate />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutMain />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="pos" element={<POSPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Route>

        {/* Redirect raíz a / */}
        <Route path="/" element={<Navigate to="/" replace />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<div className="p-8 text-center">Página no encontrada</div>} />
      </Routes>
    </HashRouter>
  )
}