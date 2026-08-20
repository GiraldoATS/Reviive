import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import FilterBar from "@/components/FilterBar";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconBox, IconTruck, IconCheckCircle, IconAlertTriangle } from "@/components/icons";

const pedidos = [
  ["RV-2024-0512", "Carolina M.", "Reloj de bolsillo Omega", "Taller El Tiempo", "$95,000", "En proceso"],
  ["RV-2024-0513", "Andrés P.", "Cámara Rolleiflex", "Atelier Luz", "$68,000", "En proceso"],
  ["RV-2024-0514", "Laura G.", "Máquina de escribir Remington", "Manos de Plata", "$54,000", "Entregado"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  "En proceso": "progress",
  Entregado: "success",
};

export default function PedidosAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Pedidos"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de pedidos</h1>
      <p className="text-sm text-carbon/55 mb-6">Supervisa el ciclo completo de cada pedido confirmado.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value="892" label="Pedidos totales" trend="+9.4%" trendTone="up" tone="rosa" />
        <StatCard icon={<IconTruck className="h-5 w-5" />} value="132" label="En proceso" tone="dorado" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="96" label="Entregados" tone="verde" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value="18" label="Con novedad" tone="borgona" />
      </div>

      <FilterBar
        fields={[
          { label: "Estado", placeholder: "Todos" },
          { label: "Proveedor", placeholder: "Todos" },
          { label: "Ciudad", placeholder: "Todas" },
          { label: "Rango de fechas", placeholder: "Últimos 30 días" },
        ]}
      />

      <SimpleTable
        columns={["Pedido", "Cliente", "Objeto", "Proveedor", "Total", "Estado", ""]}
        rows={pedidos.map((p) => [
          p[0], p[1], p[2], p[3], p[4],
          <Badge key="e" tone={toneByEstado[p[5]] ?? "neutral"}>{p[5]}</Badge>,
          <a key="a" href={`/admin/pedidos/${p[0]}`} className="text-borgona text-xs">Ver →</a>,
        ])}
      />
    </RolePortalShell>
  );
}
