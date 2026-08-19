import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { pedidos } from "@/data/mock";
import { IconReloj } from "@/components/icons";

const etiquetas: Record<string, string> = {
  recibido: "Recibido",
  en_evaluacion: "En evaluación",
  en_proceso: "En proceso",
  control_de_calidad: "Control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
};

export default async function SeguimientoPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) notFound();

  const indiceActual = pedido.eventos.findIndex((e) => e.estado === pedido.estado);

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-2xl text-carbon">
          Seguimiento de tu pedido
        </h1>
        <p className="text-sm text-carbon/55 mt-1">Pedido #{pedido.codigo}</p>

        <div className="mt-10 flex justify-between relative">
          <div className="absolute top-3 left-3 right-3 h-px bg-greige/70" />
          {pedido.eventos.map((evento, i) => {
            const estadoRelativo =
              i < indiceActual ? "completado" : i === indiceActual ? "actual" : "pendiente";
            return (
              <div key={evento.estado} className="relative z-10 flex flex-col items-center gap-2 text-center w-24">
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    estadoRelativo === "completado"
                      ? "bg-[#e3ead9] border-[#3f5c2b] text-[#3f5c2b]"
                      : estadoRelativo === "actual"
                      ? "bg-borgona border-borgona text-marfil"
                      : "bg-marfil border-greige text-carbon/40"
                  }`}
                >
                  {estadoRelativo === "completado" ? "✓" : i + 1}
                </div>
                <span className="text-xs text-carbon/70">{etiquetas[evento.estado]}</span>
                <span className="text-[10px] text-carbon/45">{evento.fecha}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">
              Estado actual
            </h2>
            <p className="text-sm text-carbon/75">
              Nuestro taller está trabajando en la restauración de tu objeto con el
              mayor cuidado.
            </p>
            <Button href="#" variant="ghost" className="mt-3 px-0 text-xs">
              Ver detalle del proceso →
            </Button>
          </Card>
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">
              Tu objeto
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-lg bg-marfil border border-greige/70 flex items-center justify-center">
                <IconReloj className="h-7 w-7 text-borgona" />
              </div>
              <div>
                <p className="text-sm font-medium text-carbon">{pedido.objeto}</p>
                <p className="text-xs text-carbon/50">{pedido.proveedor}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
