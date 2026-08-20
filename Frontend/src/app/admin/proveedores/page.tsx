import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconUsers, IconCheckCircle, IconClockAlert } from "@/components/icons";

const proveedores = [
  ["Taller El Tiempo", "Bogotá", "Relojes", "4.9", "Validado"],
  ["Atelier Luz", "Medellín", "Fotografía, Textiles", "4.8", "Validado"],
  ["Manos de Plata", "Cali", "Joyas", "4.6", "Pendiente"],
];

export default function ProveedoresAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Proveedores"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de proveedores</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra la red de talleres y artesanos validados.</p>

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconUsers className="h-5 w-5" />} value="312" label="Proveedores activos" trend="+8.1%" trendTone="up" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="286" label="Validados" tone="verde" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value="18" label="Pendientes de validación" tone="dorado" />
      </div>

      <SimpleTable
        columns={["Taller", "Ciudad", "Especialidades", "Calificación", "Estado", ""]}
        rows={proveedores.map((p) => [
          p[0], p[1], p[2], `★ ${p[3]}`,
          <Badge key="e" tone={p[4] === "Validado" ? "success" : "pending"}>{p[4]}</Badge>,
          <a key="a" href="/admin/proveedores/validacion" className="text-borgona text-xs">Ver →</a>,
        ])}
      />
    </RolePortalShell>
  );
}
