import { useState, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, Info } from "lucide-react";
import { downloadBackup, restoreBackup } from "@/services/systemService";

export const SettingsPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoring, setRestoring] = useState(false);

  const handleBackup = async () => {
    try {
      await downloadBackup();
      toast.success("Base de datos exportada correctamente");
    } catch {
      toast.error("Error al exportar la base de datos");
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".db")) {
      toast.error("Selecciona un archivo .db");
      return;
    }

    if (!window.confirm("¿Estás seguro? Esto reemplazará toda la base de datos actual. Se recomienda hacer un backup primero.")) {
      return;
    }

    setRestoring(true);
    try {
      await restoreBackup(file);
      toast.success("Base de datos restaurada. Recarga la página para ver los cambios.");
    } catch {
      toast.error("Error al restaurar la base de datos. El archivo puede ser inválido.");
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Administra tu base de datos local</p>
      </div>

      <Card className="shadow-sm border-0 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Base de datos</CardTitle>
              <CardDescription>
                La base de datos se almacena localmente en SQLite
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={handleBackup} variant="outline" className="gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
            <Download className="h-4 w-4" />
            Exportar backup
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="gap-2 transition-all hover:shadow-md hover:-translate-y-0.5"
            disabled={restoring}
          >
            <Upload className="h-4 w-4" />
            {restoring ? "Restaurando..." : "Importar backup"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".db"
            className="hidden"
            onChange={handleRestore}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Información del sistema</CardTitle>
              <CardDescription>Detalles de la aplicación</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Venta Control v1.0.0</p>
          <p>Base de datos local SQLite</p>
          <p>Sin conexión a internet requerida</p>
        </CardContent>
      </Card>
    </div>
  );
};
