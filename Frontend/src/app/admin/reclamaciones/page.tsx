import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IconAlertTriangle, IconClockAlert, IconCheckCircle, IconFlag, IconPlus } from "@/components/icons";

const reclamaciones = [
  ["REC-2025-0048", "Producto", "Ana María Ruiz", "Abierta", "Alta"],
  ["REC-2025-0047", "Servicio", "Carlos Gómez", "En proceso", "Media"],
  ["REC-2025-0046", "Producto", "Laura Torres", "Resuelta", "Media"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  Abierta: "pending",
  "En proceso": "progress",
  Resuelta: "success",
};

export default function ReclamacionesAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Reclamaciones"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Reclamaciones e incidencias</h1>
          <p className="text-sm text-carbon/55">Gestiona solicitudes, quejas y problemas de pedidos.</p>
        </div>
        <Button variant="primary" className="text-xs"><IconPlus className="h-4 w-4" /> Nueva reclamación</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value="27" label="Abiertas" tone="borgona" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value="12" label="En proceso" tone="dorado" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="68" label="Resueltas (mes)" tone="verde" />
        <StatCard icon={<IconFlag className="h-5 w-5" />} value="2" label="SLA incumplido" tone="rosa" />
      </div>

      <SimpleTable
        columns={["ID", "Tipo", "Cliente", "Estado", "Prioridad", ""]}
        rows={reclamaciones.map((r) => [
          r[0], r[1], r[2],
          <Badge key="e" tone={toneByEstado[r[3]] ?? "neutral"}>{r[3]}</Badge>,
          r[4],
          <span key="a" className="text-borgona text-xs">Ver →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
