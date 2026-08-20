import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

const taxonomia = ["Información incorrecta", "Alucinación", "Tono inadecuado", "Extracción fallida", "Uso de herramienta", "Riesgo / escalamiento"];

export default function RevisionSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Revisión y corrección"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Corregir y clasificar una respuesta</h1>
          <p className="text-sm text-carbon/55">Conversación CONV-2026-05-18-000842 · Agente Chronos</p>
        </div>
        <Badge tone="pending">Requiere revisión</Badge>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Respuesta original del agente</h2>
          <p className="text-sm text-carbon/75 bg-marfil border border-greige/70 rounded-xl p-4">
            Claro, el recordatorio se envía automáticamente cada año sin costo adicional.
          </p>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mt-6 mb-2">Respuesta esperada</h2>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Escribe la respuesta correcta que el agente debió dar..."
          />
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mt-6 mb-2">Categoría del error</h2>
          <div className="flex flex-wrap gap-2">
            {taxonomia.map((t, i) => (
              <span key={t} className={`rounded-full px-3 py-1.5 text-xs cursor-pointer ${i === 3 ? "bg-borgona text-marfil" : "border border-greige/70 text-carbon/60"}`}>
                {t}
              </span>
            ))}
          </div>
        </Card>

        <Card className="h-fit space-y-3">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Decisión</h2>
          <Button variant="primary" className="w-full justify-center">Aprobar corrección</Button>
          <Button variant="secondary" className="w-full justify-center">Marcar como pendiente</Button>
          <Button variant="ghost" className="w-full justify-center text-[#a64b4b]">Rechazar</Button>
        </Card>
      </div>
    </RolePortalShell>
  );
}
