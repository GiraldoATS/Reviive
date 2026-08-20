import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconWallet, IconClockAlert } from "@/components/icons";

const historial = [
  ["10 May 2026", "Pago semanal", "#1245, #1250, #1251", "$11,205", "Pagado"],
  ["03 May 2026", "Pago semanal", "#1236, #1240, #1242", "$9,882", "Pagado"],
  ["26 Abr 2026", "Pago semanal", "#1225, #1227, #1228", "$8,784", "Pagado"],
];

export default function IngresosProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Ingresos"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Pagos e ingresos</h1>
      <p className="text-sm text-carbon/55 mb-6">Consulta tus ingresos, comisiones e historial de pagos.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="$48,560" label="Ingresos del mes" trend="+18% vs. mes pasado" trendTone="up" tone="rosa" />
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="$284,750" label="Ingresos del año" trend="+22%" trendTone="up" tone="dorado" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value="$12,840" label="Pendiente por cobrar" tone="greige" />
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="12%" label="Comisión promedio" tone="verde" />
      </div>

      <Card>
        <h2 className="font-display text-lg text-carbon mb-4">Historial de pagos</h2>
        <SimpleTable
          columns={["Fecha", "Descripción", "Pedido(s)", "Monto neto", "Estatus"]}
          rows={historial.map((h) => [
            h[0], h[1], h[2], h[3],
            <Badge key="e" tone="success">{h[4]}</Badge>,
          ])}
        />
      </Card>
    </RolePortalShell>
  );
}
