import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconTruck, IconBox, IconAlertTriangle, IconCheckCircle } from "@/components/icons";

const envios = [
  ["RV-2024-0512", "Carolina M.", "Bogotá", "Coordinadora", "En tránsito"],
  ["RV-2024-0513", "Andrés P.", "Medellín", "Interrápidísimo", "Retraso"],
  ["RV-2024-0514", "Laura G.", "Cali", "Servientrega", "Entregado"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  "En tránsito": "progress",
  Retraso: "pending",
  Entregado: "success",
};

export default function LogisticaAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Logística"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión logística</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra envíos, transportadoras y tiempos de entrega.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconTruck className="h-5 w-5" />} value="28" label="En tránsito" tone="dorado" />
        <StatCard icon={<IconBox className="h-5 w-5" />} value="15" label="Entregas hoy" tone="rosa" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value="3" label="Retrasos" tone="borgona" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="312" label="Entregados (mes)" tone="verde" />
      </div>

      <SimpleTable
        columns={["Pedido", "Cliente", "Destino", "Transportadora", "Estado", ""]}
        rows={envios.map((e) => [
          e[0], e[1], e[2], e[3],
          <Badge key="e" tone={toneByEstado[e[4]] ?? "neutral"}>{e[4]}</Badge>,
          <span key="a" className="text-borgona text-xs">Ver →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
