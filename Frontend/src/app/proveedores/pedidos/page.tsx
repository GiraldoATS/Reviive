import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";

const pedidos = [
  ["#1256", "Ana Lucía Ramírez", "Baúl de madera antiguo", "En producción", "30 MAY"],
  ["#1261", "Jorge Martínez", "Caja de madera tallada", "En producción", "26 MAY"],
  ["#1263", "María Fernanda López", "Canasta artesanal", "Pendiente de envío", "28 MAY"],
  ["#1268", "Carlos Aguilar", "Restauración de silla", "Para iniciar", "02 JUN"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending" | "neutral"> = {
  "En producción": "progress",
  "Pendiente de envío": "pending",
  "Para iniciar": "neutral",
};

export default function PedidosProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Pedidos"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Pedidos asignados</h1>
      <p className="text-sm text-carbon/55 mb-6">Gestiona y da seguimiento a los pedidos que te han sido asignados.</p>

      <Card className="mb-6 flex flex-wrap gap-2 !p-3 w-fit">
        {["Todos 12", "Para iniciar 2", "En producción 5", "En revisión 1", "Listos 1", "Entregados 2"].map((t, i) => (
          <span key={t} className={`rounded-full px-4 py-1.5 text-sm ${i === 0 ? "bg-borgona text-marfil" : "text-carbon/60"}`}>
            {t}
          </span>
        ))}
      </Card>

      <SimpleTable
        columns={["Pedido", "Cliente", "Producto / Solicitud", "Estado", "Fecha estimada", ""]}
        rows={pedidos.map((p) => [
          p[0], p[1], p[2],
          <Badge key="e" tone={toneByEstado[p[3]] ?? "neutral"}>{p[3]}</Badge>,
          p[4],
          <a key="a" href={`/proveedores/pedidos/${p[0].replace("#", "")}`} className="text-borgona text-xs">Ver →</a>,
        ])}
      />
    </RolePortalShell>
  );
}
