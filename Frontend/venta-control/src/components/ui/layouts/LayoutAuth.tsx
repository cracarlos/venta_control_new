import { Outlet } from "react-router";
import { Toaster } from "sonner";

export const LayoutAuth = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-3/5 relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="relative z-10 text-center px-12">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-800/30">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Venta Control</h1>
          <p className="text-xl text-emerald-100/80 max-w-md mx-auto leading-relaxed">
            Sistema inteligente para el control de ventas e inventario
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400 tabular-nums">100%</div>
              <div className="text-xs text-emerald-200/60 mt-1">Local</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">24/7</div>
              <div className="text-xs text-emerald-200/60 mt-1">Disponible</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">0$</div>
              <div className="text-xs text-emerald-200/60 mt-1">Sin nube</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/30 dark:to-background">
        <Toaster />
        <Outlet />
      </div>
    </div>
  );
};
