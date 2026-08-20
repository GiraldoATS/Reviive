import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { IconReloj } from "@/components/icons";

const eventos = [
  { estado: "Solicitud creada", fecha: "12 May 10:15 am", responsable: "Cliente" },
  { estado: "Cotización aceptada", fecha: "12 May 02:45 pm", responsable: "Cliente" },
  { estado: "Pedido confirmado", fecha: "13 May 09:30 am", responsable: "Admin Reviive" },
  { estado: "Inicio de producción", fecha: "14 May 11:20 am", responsable: "Taller El Tiempo" },
  { estado: "Enviado", fecha: "16 May 08:10 am", responsable: "Taller El Tiempo" },
];

export default async function DetalleAdminPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Pedidos", id]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Cadena de custodia</h1>
          <p className="text-sm text-carbon/55">Pedido #{id}</p>
        </div>
        <Badge tone="progress">En proceso</Badge>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-4">Historial de eventos</h2>
          <ol className="space-y-4">
            {eventos.map((e, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-borgona" />
                  {i < eventos.length - 1 && <span className="w-px flex-1 bg-greige/70 mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-carbon">{e.estado}</p>
                  <p className="text-xs text-carbon/50">{e.fecha} · {e.responsable}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="h-fit">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-marfil border border-greige/70 flex items-center justify-center">
              <IconReloj className="h-6 w-6 text-borgona" />
            </div>
            <div>
              <p className="text-sm font-medium text-carbon">Reloj de bolsillo Omega</p>
              <p className="text-xs text-carbon/50">Cliente: Carolina M.</p>
            </div>
          </div>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-carbon/50">Proveedor</dt><dd>Taller El Tiempo</dd></div>
            <div className="flex justify-between"><dt className="text-carbon/50">Total</dt><dd>$95,000</dd></div>
            <div className="flex justify-between"><dt className="text-carbon/50">Estado actual</dt><dd>Entregado</dd></div>
          </dl>
        </Card>
      </div>
    </RolePortalShell>
  );
}
