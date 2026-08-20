import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export default async function DetalleAgenteSupervisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Agentes", "Detalle"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Acompañamiento (Alma)</h1>
          <p className="text-sm text-carbon/55">Brinda acompañamiento emocional a clientes en cada canal.</p>
        </div>
        <Badge tone="success">Activo</Badge>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <Card className="space-y-4">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Configuración</h2>
          <label className="block"><span className="block text-xs text-carbon/50 mb-1">Modelo</span><input className="input" defaultValue="Claude 3.5 Sonnet" readOnly /></label>
          <label className="block"><span className="block text-xs text-carbon/50 mb-1">Versión activa</span><input className="input" defaultValue="v1.8.3" readOnly /></label>
          <label className="block"><span className="block text-xs text-carbon/50 mb-1">Prompt del sistema (resumen)</span>
            <textarea className="input resize-none" rows={4} readOnly defaultValue="Acompaña con tono cálido, claro y no invasivo. No se presenta como psicólogo. Escala mensajes de riesgo o solicitudes fuera de alcance." />
          </label>
        </Card>

        <Card className="h-fit space-y-3 text-sm">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Métricas (30 días)</h2>
          <div className="flex justify-between"><span className="text-carbon/50">Tasa de éxito</span><span>97.8%</span></div>
          <div className="flex justify-between"><span className="text-carbon/50">Latencia promedio</span><span>2.4s</span></div>
          <div className="flex justify-between"><span className="text-carbon/50">Pruebas ejecutadas</span><span>18</span></div>
          <div className="pt-3 border-t border-greige/60 space-y-2">
            <Button variant="secondary" className="w-full justify-center text-xs">Ver versiones</Button>
            <Button variant="primary" className="w-full justify-center text-xs">Ejecutar pruebas</Button>
          </div>
        </Card>
      </div>
    </RolePortalShell>
  );
}
