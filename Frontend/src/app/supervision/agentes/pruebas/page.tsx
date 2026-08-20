import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

const casos = [
  ["Caso normal: consulta de precios", "Aprobado"],
  ["Caso ambiguo: objeto sin categoría clara", "Aprobado"],
  ["Caso sensible: mención de pérdida reciente", "Requiere revisión"],
];

export default function PruebasAgentesSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Agentes", "Pruebas"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Pruebas de agentes</h1>
          <p className="text-sm text-carbon/55">Ejecuta el conjunto de regresión antes de publicar una nueva versión.</p>
        </div>
        <Button variant="primary" className="text-xs">Ejecutar suite completa</Button>
      </div>

      <Card>
        <SimpleTable
          columns={["Caso de prueba", "Resultado", ""]}
          rows={casos.map((c) => [
            c[0],
            <Badge key="e" tone={c[1] === "Aprobado" ? "success" : "pending"}>{c[1]}</Badge>,
            <span key="a" className="text-borgona text-xs">Ver detalle →</span>,
          ])}
        />
      </Card>
    </RolePortalShell>
  );
}
