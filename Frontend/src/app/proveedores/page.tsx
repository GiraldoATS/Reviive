import PortalSidebar from "@/components/PortalSidebar";
import Badge from "@/components/Badge";
import { pedidos } from "@/data/mock";

const sidebarItems = [
  { href: "/proveedores", label: "Inicio", active: true },
  { href: "/proveedores", label: "Pedidos asignados" },
  { href: "/proveedores", label: "Mis proyectos" },
  { href: "/proveedores", label: "Mensajes" },
  { href: "/proveedores", label: "Facturación" },
  { href: "/proveedores", label: "Mi perfil" },
];

const tabs = ["Activos", "En revisión", "Completados"];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  en_proceso: "progress",
  en_evaluacion: "pending",
  entregado: "success",
};

export default function PortalProveedoresPage() {
  return (
    <div className="min-h-screen flex bg-marfil">
      <PortalSidebar
        title="Proveedores"
        userLabel="Taller El Tiempo"
        items={sidebarItems}
      />
      <main className="flex-1 px-10 py-8">
        <h1 className="font-display text-2xl text-carbon mb-1">
          Pedidos asignados
        </h1>
        <p className="text-sm text-carbon/55 mb-6">
          Taller El Tiempo
        </p>

        <div className="flex gap-2 mb-6">
          {tabs.map((tab, i) => (
            <span
              key={tab}
              className={`rounded-full px-4 py-1.5 text-sm ${
                i === 0 ? "bg-borgona text-marfil" : "border border-greige/70 text-carbon/70"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="rounded-2xl border border-greige/70 bg-white/60 divide-y divide-greige/60">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="text-sm font-medium text-carbon">
                  #{pedido.codigo} · {pedido.objeto}
                </p>
                <p className="text-xs text-carbon/50">
                  Cliente: {pedido.clienteNombre}
                </p>
              </div>
              <Badge tone={toneByEstado[pedido.estado] ?? "pending"}>
                {pedido.estado.replace(/_/g, " ")}
              </Badge>
            </div>
          ))}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-carbon">
                #RV-2024-0513 · Cámara Rolleiflex
              </p>
              <p className="text-xs text-carbon/50">Cliente: Andrés P.</p>
            </div>
            <Badge tone="progress">en proceso</Badge>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-carbon">
                #RV-2024-0514 · Máquina de escribir Remington
              </p>
              <p className="text-xs text-carbon/50">Cliente: Laura G.</p>
            </div>
            <Badge tone="pending">en evaluación</Badge>
          </div>
        </div>
      </main>
    </div>
  );
}
