import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconWallet, IconCheckCircle, IconClockAlert, IconAlertTriangle } from "@/components/icons";

const cotizaciones = [
  ["#COT-0512", "Carolina M.", "Taller El Tiempo", "$95,000", "12 jun 2026", "Aceptada"],
  ["#COT-0513", "Andrés P.", "Atelier Luz", "$68,000", "14 jun 2026", "Enviada"],
  ["#COT-0514", "Laura G.", "Manos de Plata", "$54,000", "10 jun 2026", "Vencida"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  Aceptada: "success",
  Enviada: "progress",
  Vencida: "pending",
};

export default function CotizacionesAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Cotizaciones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de cotizaciones</h1>
      <p className="text-sm text-carbon/55 mb-6">Controla vigencia, aceptación y valor de cada cotización.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="842" label="Cotizaciones activas" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="512" label="Aceptadas" tone="verde" trend="+8.1%" trendTone="up" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value="204" label="Pendientes de respuesta" tone="dorado" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value="126" label="Vencidas" tone="borgona" trend="-2.3%" trendTone="down" />
      </div>

      <SimpleTable
        columns={["Cotización", "Cliente", "Proveedor", "Total", "Vigencia", "Estado", ""]}
        rows={cotizaciones.map((c) => [
          c[0], c[1], c[2], c[3], c[4],
          <Badge key="e" tone={toneByEstado[c[5]] ?? "neutral"}>{c[5]}</Badge>,
          <span key="a" className="text-borgona text-xs">Ver →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
