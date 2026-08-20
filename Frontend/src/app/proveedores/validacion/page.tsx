import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";

const pasos = [
  { titulo: "Registro recibido", estado: "Completado" },
  { titulo: "Documentos en revisión", estado: "En progreso" },
  { titulo: "Portafolio validado", estado: "Pendiente" },
  { titulo: "Entrevista o llamada", estado: "Pendiente" },
  { titulo: "Aprobación final", estado: "Pendiente" },
];

export default function ValidacionProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Validación"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Proceso de validación</h1>
          <p className="text-sm text-carbon/55">Estamos revisando tu información. Este es el estado de tu solicitud.</p>
        </div>
        <Badge tone="progress">En revisión</Badge>
      </div>

      <Card>
        <ol className="space-y-4">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="flex items-center gap-4">
              <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                p.estado === "Completado" ? "bg-[#3f5c2b] text-marfil" : p.estado === "En progreso" ? "bg-dorado text-borgona-dark" : "bg-greige/60 text-carbon/50"
              }`}>
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-carbon">{p.titulo}</p>
                <p className="text-xs text-carbon/50">{p.estado}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </RolePortalShell>
  );
}
