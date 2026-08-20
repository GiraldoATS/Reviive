import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

const candidatos = [
  { nombre: "Taller El Tiempo", ciudad: "Bogotá", especialidad: "Relojes", puntaje: 94, calificacion: 4.9 },
  { nombre: "Atelier Luz", ciudad: "Medellín", especialidad: "Fotografía", puntaje: 88, calificacion: 4.8 },
  { nombre: "Manos de Plata", ciudad: "Cali", especialidad: "Joyas", puntaje: 81, calificacion: 4.6 },
];

export default function MatchingAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Matching"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Matching de proveedores</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Sugerencias de proveedores compatibles para la solicitud #REQ-7821.
      </p>

      <Card className="mb-6">
        <p className="text-xs uppercase tracking-wide text-carbon/45 mb-1">Solicitud</p>
        <p className="text-sm text-carbon">Reloj de bolsillo · Restauración completa · Ciudad de México</p>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {candidatos.map((c) => (
          <Card key={c.nombre} className="flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-carbon">{c.nombre}</h3>
              <Badge tone="progress">{c.puntaje}% compatible</Badge>
            </div>
            <p className="mt-1 text-sm text-carbon/60">{c.ciudad} · {c.especialidad}</p>
            <p className="mt-2 text-sm text-dorado-suave">★ {c.calificacion}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" className="flex-1 justify-center text-xs">Asignar</Button>
              <Button variant="secondary" className="text-xs">Ver perfil</Button>
            </div>
          </Card>
        ))}
      </div>
    </RolePortalShell>
  );
}
