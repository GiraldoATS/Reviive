import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";

const fuentes = [
  { nombre: "Catálogo de servicios", version: "v2.3", estado: "Activa" },
  { nombre: "Políticas de restauración", version: "v1.7", estado: "Activa" },
  { nombre: "Preguntas frecuentes", version: "v3.1", estado: "Activa" },
];

export default function ConocimientoSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Base de conocimiento"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Base de conocimiento</h1>
      <p className="text-sm text-carbon/55 mb-6">Fuentes que consultan los agentes para responder con precisión.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {fuentes.map((f) => (
          <Card key={f.nombre}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-carbon">{f.nombre}</h3>
              <Badge tone="success">{f.estado}</Badge>
            </div>
            <p className="mt-2 text-sm text-carbon/55">Versión {f.version}</p>
          </Card>
        ))}
      </div>
    </RolePortalShell>
  );
}
