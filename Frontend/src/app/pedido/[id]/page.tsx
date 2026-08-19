import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { pedidos } from "@/data/mock";
import { IconReloj } from "@/components/icons";

const servicios = [
  "Limpieza y restauración",
  "Cambio de cristal",
  "Pulido de caja",
];

export default async function DetallePedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) notFound();

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-14">
        <Card>
          <h1 className="font-display text-2xl text-carbon">
            Detalle de tu pedido
          </h1>
          <p className="text-sm text-carbon/55 mt-1">Pedido #{pedido.codigo}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-marfil border border-greige/70 flex items-center justify-center">
              <IconReloj className="h-8 w-8 text-borgona" />
            </div>
            <div>
              <p className="font-medium text-carbon">{pedido.objeto}</p>
              <p className="text-xs text-carbon/55">Taller: {pedido.proveedor}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">
              Servicios seleccionados
            </h2>
            <ul className="space-y-1.5 text-sm">
              {servicios.map((s) => (
                <li key={s} className="flex items-center gap-2 text-carbon/80">
                  <span className="text-dorado-suave">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-greige/70 pt-4">
            <span className="text-sm text-carbon/60">Total estimado</span>
            <span className="font-display text-xl text-borgona">
              ${pedido.total.toLocaleString("es-CO")}
            </span>
          </div>

          <div className="mt-8 flex gap-3">
            <Button href={`/pedido/${pedido.id}/seguimiento`} variant="primary" className="flex-1 justify-center">
              Confirmar pedido
            </Button>
            <Button href="/recomendaciones" variant="secondary">
              Volver
            </Button>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
