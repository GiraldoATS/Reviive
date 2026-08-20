import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

const documentos = [
  { nombre: "Identificación oficial", estado: "Revisado" },
  { nombre: "Comprobante de domicilio", estado: "Revisado" },
  { nombre: "RFC / Constancia de situación fiscal", estado: "En revisión" },
  { nombre: "Constancia de taller o negocio", estado: "Pendiente" },
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  Revisado: "success",
  "En revisión": "progress",
  Pendiente: "pending",
};

export default function ValidacionProveedorAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Proveedores", "Validación"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Validación de proveedor</h1>
          <p className="text-sm text-carbon/55">Manos de Plata · Cali</p>
        </div>
        <Badge tone="progress">En revisión</Badge>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-4">Documentos revisados</h2>
          <ul className="divide-y divide-greige/50">
            {documentos.map((d) => (
              <li key={d.nombre} className="flex items-center justify-between py-3">
                <span className="text-sm text-carbon">{d.nombre}</span>
                <Badge tone={toneByEstado[d.estado]}>{d.estado}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="h-fit space-y-3">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Decisión</h2>
          <Button variant="primary" className="w-full justify-center">Aprobar proveedor</Button>
          <Button variant="secondary" className="w-full justify-center">Solicitar ajustes</Button>
          <Button variant="ghost" className="w-full justify-center text-[#a64b4b]">Rechazar</Button>
        </Card>
      </div>
    </RolePortalShell>
  );
}
