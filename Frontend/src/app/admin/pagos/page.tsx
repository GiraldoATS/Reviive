import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconWallet } from "@/components/icons";

const pagos = [
  ["Taller El Tiempo", "24", "$12,450,000", "Pagado", "20 May 2026"],
  ["Detalles con Amor", "18", "$8,750,000", "Pendiente", "15 May 2026"],
  ["Antes del Recuerdo", "16", "$6,380,000", "Pagado", "15 May 2026"],
];

export default function PagosAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Pagos y comisiones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Pagos y comisiones</h1>
      <p className="text-sm text-carbon/55 mb-6">Controla pagos a proveedores, comisiones y estados financieros.</p>

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="$18,560,000" label="Pagos a proveedores (mes)" tone="rosa" />
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="$95,340,000" label="Pendientes de pago" tone="dorado" />
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="$22,150,000" label="Disponible" tone="verde" />
      </div>

      <SimpleTable
        columns={["Proveedor", "Pedidos", "Monto a pagar", "Estado", "Fecha estimada", ""]}
        rows={pagos.map((p) => [
          p[0], p[1], p[2],
          <Badge key="e" tone={p[3] === "Pagado" ? "success" : "pending"}>{p[3]}</Badge>,
          p[4],
          <span key="a" className="text-borgona text-xs">Ver →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
