import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { IconBox } from "@/components/icons";

export default async function DetalleSolicitudProveedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Solicitudes", "Detalle"]}>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl text-carbon">Restauración de baúl de madera</h1>
        <span className="text-xs text-carbon/50">Responder antes de: 26 MAY</span>
      </div>
      <p className="text-sm text-carbon/55 mb-6">Solicitud #{id} · Recibida el 24 de mayo, 9:15 am</p>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Descripción de la solicitud</h2>
          <p className="text-sm text-carbon/75">
            Es un baúl antiguo de mi abuela. La madera está reseca y tiene
            manchas, algunos detalles de metal están oxidados. Me gustaría
            restaurarlo para conservarlo como pieza familiar.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
            <div><p className="text-carbon/50 text-xs">Ciudad</p><p>Oaxaca, Oaxaca</p></div>
            <div><p className="text-carbon/50 text-xs">Presupuesto estimado</p><p>$6,100 - $8,000 MXN</p></div>
            <div><p className="text-carbon/50 text-xs">Fecha deseada de entrega</p><p>30 de junio, 2025</p></div>
            <div><p className="text-carbon/50 text-xs">Método de entrega</p><p>Entrega en domicilio</p></div>
          </div>

          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mt-6 mb-2">Fotos del objeto</h2>
          <div className="h-40 rounded-xl bg-marfil border border-greige/70 flex items-center justify-center">
            <IconBox className="h-10 w-10 text-greige" />
          </div>
        </Card>

        <Card className="h-fit space-y-4">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Información del cliente</h2>
          <p className="text-sm font-medium text-carbon">Ana Lucía Ramírez</p>
          <p className="text-xs text-carbon/50">★ 4.9 (32) · Cliente verificado</p>
          <div className="pt-3 border-t border-greige/60 space-y-2">
            <Button href={`/proveedores/cotizaciones/nueva?solicitud=${id}`} variant="primary" className="w-full justify-center">
              Crear cotización
            </Button>
            <Button variant="secondary" className="w-full justify-center">Declinar solicitud</Button>
          </div>
        </Card>
      </div>
    </RolePortalShell>
  );
}
