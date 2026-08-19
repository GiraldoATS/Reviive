import PortalSidebar from "@/components/PortalSidebar";
import { conversaciones } from "@/data/mock";

const sidebarItems = [
  { href: "/supervision", label: "Panel", active: true },
  { href: "/supervision", label: "Conversaciones" },
  { href: "/supervision", label: "Pedidos" },
  { href: "/supervision", label: "Alertas" },
  { href: "/supervision", label: "Clientes" },
  { href: "/supervision", label: "Reportes" },
];

const mensajesDetalle = [
  { autor: "Carolina M.", texto: "¿Podrían enviarme una actualización del reloj?", hora: "10:42", propio: false },
  { autor: "Alma", texto: "Claro, el reloj está en proceso de limpieza profunda.", hora: "10:43", propio: true },
];

export default function CentroSupervisionPage() {
  return (
    <div className="min-h-screen flex bg-marfil">
      <PortalSidebar
        title="Supervisión"
        userLabel="Agente Sofía"
        items={sidebarItems}
      />
      <main className="flex-1 grid md:grid-cols-[320px_1fr]">
        <section className="border-r border-greige/60 flex flex-col">
          <div className="px-5 py-4 border-b border-greige/60">
            <h2 className="font-display text-lg text-carbon">Conversaciones activas</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-greige/50">
            {conversaciones.map((c, i) => (
              <div
                key={c.id}
                className={`px-5 py-4 cursor-pointer ${i === 0 ? "bg-rosa/20" : "hover:bg-marfil"}`}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-carbon">{c.cliente}</span>
                  <span className="text-xs text-carbon/45">{c.hora}</span>
                </div>
                <p className="text-xs text-carbon/55 mt-0.5">
                  Pedido #{c.pedidoRef}
                </p>
                <p className="text-xs text-carbon/60 mt-1 truncate">
                  {c.ultimoMensaje}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col">
          <div className="px-6 py-4 border-b border-greige/60">
            <h2 className="font-display text-lg text-carbon">Carolina M.</h2>
            <p className="text-xs text-carbon/50">Pedido #RV-2024-0512</p>
          </div>
          <div className="flex-1 px-6 py-4 space-y-3 overflow-y-auto">
            {mensajesDetalle.map((m, i) => (
              <div
                key={i}
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.propio
                    ? "bg-borgona text-marfil ml-auto"
                    : "bg-white border border-greige/70 text-carbon"
                }`}
              >
                <p>{m.texto}</p>
                <p className={`mt-1 text-[10px] ${m.propio ? "text-marfil/60" : "text-carbon/40"}`}>
                  {m.hora}
                </p>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-greige/60">
            <input
              className="input"
              placeholder="Escribe tu respuesta..."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
