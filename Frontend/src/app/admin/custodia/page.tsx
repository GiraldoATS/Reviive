import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";

const registros = [
  ["RV-2024-0512", "Recibido", "Taller El Tiempo", "16 May 08:10 am"],
  ["RV-2024-0513", "En tránsito", "Atelier Luz", "17 May 09:00 am"],
  ["RV-2024-0514", "Entregado", "Manos de Plata", "15 May 04:30 pm"],
];

export default function CustodiaAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Cadena de custodia"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Cadena de custodia</h1>
      <p className="text-sm text-carbon/55 mb-6">Rastrea cada pedido desde la recepción hasta la entrega final.</p>

      <SimpleTable
        columns={["Pedido", "Estado de custodia", "Responsable actual", "Último evento", ""]}
        rows={registros.map((r) => [
          r[0],
          <Badge key="e" tone="progress">{r[1]}</Badge>,
          r[2],
          r[3],
          <a key="a" href={`/admin/pedidos/${r[0]}`} className="text-borgona text-xs">Ver trazabilidad →</a>,
        ])}
      />
    </RolePortalShell>
  );
}
