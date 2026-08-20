import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";

const solicitudes = [
  ["Urna de madera tallada", "Guadalajara, Jalisco", "$8,000 - $12,000", "Alta", "92%"],
  ["Caja conmemorativa premium", "Monterrey, Nuevo León", "$6,000 - $9,000", "Media", "86%"],
  ["Urna de barro tradicional", "Puebla, Puebla", "$4,500 - $7,000", "Media", "81%"],
  ["Caja de madera con grabado", "México, CDMX", "$5,000 - $7,500", "Baja", "78%"],
];

export default function SolicitudesProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Solicitudes"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Solicitudes disponibles</h1>
      <p className="text-sm text-carbon/55 mb-6">Encuentra solicitudes que coincidan con tu especialidad.</p>

      <SimpleTable
        columns={["Solicitud", "Ciudad", "Presupuesto", "Urgencia", "Coincidencia", ""]}
        rows={solicitudes.map((s, i) => [
          s[0], s[1], s[2],
          <Badge key="u" tone={s[3] === "Alta" ? "progress" : "neutral"}>{s[3]}</Badge>,
          s[4],
          <a key="a" href={`/proveedores/solicitudes/${i + 1}`} className="text-borgona text-xs">Ver detalle →</a>,
        ])}
      />
    </RolePortalShell>
  );
}
