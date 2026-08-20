import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import SimpleTable from "@/components/SimpleTable";
import Button from "@/components/Button";
import { IconPlus } from "@/components/icons";

const plantillas = [
  ["Confirmación de pedido", "Correo", "12 May 2026"],
  ["Pedido en producción", "Correo", "10 May 2026"],
  ["Pedido enviado", "Correo", "09 May 2026"],
  ["Recordatorio de pago", "Correo", "07 May 2026"],
  ["Bienvenida proveedor", "Correo", "05 May 2026"],
];

export default function NotificacionesAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Notificaciones"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Notificaciones y plantillas</h1>
          <p className="text-sm text-carbon/55">Crea y gestiona plantillas de correos y notificaciones.</p>
        </div>
        <Button variant="primary" className="text-xs"><IconPlus className="h-4 w-4" /> Nueva plantilla</Button>
      </div>

      <Card className="mb-6 flex gap-2 !p-3 w-fit">
        {["Plantillas", "Enviados", "Configuración"].map((t, i) => (
          <span key={t} className={`rounded-full px-4 py-1.5 text-sm ${i === 0 ? "bg-borgona text-marfil" : "text-carbon/60"}`}>
            {t}
          </span>
        ))}
      </Card>

      <SimpleTable
        columns={["Nombre de plantilla", "Tipo", "Última edición", ""]}
        rows={plantillas.map((p) => [p[0], p[1], p[2], <span key="a" className="text-borgona text-xs">Editar →</span>])}
      />
    </RolePortalShell>
  );
}
