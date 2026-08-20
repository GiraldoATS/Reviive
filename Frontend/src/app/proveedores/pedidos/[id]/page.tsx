import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IconBox } from "@/components/icons";

const etapas = ["Asignado", "Para iniciar", "En producción", "En revisión", "Listo para entrega", "Entregado"];

export default async function DetalleOperativoPedidoProveedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actual = 2;

  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Pedidos", `#${id}`]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Pedido #{id}</h1>
          <p className="text-sm text-carbon/55">Restauración de baúl de madera</p>
        </div>
        <Badge tone="progress">En producción</Badge>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-4">Línea de tiempo del pedido</h2>
            <div className="flex justify-between relative">
              <div className="absolute top-2.5 left-2 right-2 h-px bg-greige/70" />
              {etapas.map((e, i) => (
                <div key={e} className="relative z-10 flex flex-col items-center gap-2 text-center w-20">
                  <span className={`h-5 w-5 rounded-full ${i <= actual ? "bg-borgona" : "bg-greige"}`} />
                  <span className="text-[11px] text-carbon/60">{e}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-carbon/75">
              Estado actual: <strong className="text-carbon">En producción</strong>. Tiempo transcurrido 6 días, tiempo restante estimado 14 días.
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs uppercase tracking-wide text-carbon/50">Evidencias del progreso</h2>
              <Button variant="ghost" className="text-xs px-0">Subir nueva evidencia</Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-marfil border border-greige/70 flex items-center justify-center">
                  <IconBox className="h-6 w-6 text-greige" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-fit space-y-4">
          <div>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-1">Cliente</h2>
            <p className="text-sm font-medium text-carbon">Ana Lucía Ramírez</p>
            <p className="text-xs text-carbon/50">★ 4.9 (32) · Cliente verificado</p>
          </div>
          <div className="pt-3 border-t border-greige/60">
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-1">Logística</h2>
            <p className="text-sm text-carbon/75">Entrega en domicilio · Recolección incluida</p>
          </div>
          <div className="pt-3 border-t border-greige/60 space-y-2">
            <Button variant="primary" className="w-full justify-center">Marcar como listo para revisión</Button>
            <Button variant="secondary" className="w-full justify-center">Reportar incidencia</Button>
          </div>
        </Card>
      </div>
    </RolePortalShell>
  );
}
