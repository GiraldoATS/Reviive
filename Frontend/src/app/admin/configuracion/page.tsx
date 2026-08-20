import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ConfiguracionAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Configuración"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Configuración general</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra parámetros globales de la plataforma.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Información de la empresa</h2>
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Nombre de la empresa</span>
            <input className="input" defaultValue="Reviive SAS" />
          </label>
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Correo de contacto</span>
            <input className="input" defaultValue="contacto@reviive.com" />
          </label>
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Teléfono</span>
            <input className="input" defaultValue="+57 300 123 4567" />
          </label>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Configuración regional</h2>
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Zona horaria</span>
            <select className="input" defaultValue="bogota">
              <option value="bogota">(GMT-05:00) Bogotá</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Moneda</span>
            <select className="input" defaultValue="cop">
              <option value="cop">COP - Peso colombiano</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Idioma</span>
            <select className="input" defaultValue="es">
              <option value="es">Español</option>
            </select>
          </label>
        </Card>
      </div>
      <Button variant="primary" className="mt-6">Guardar cambios</Button>
    </RolePortalShell>
  );
}
