import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconBox, IconUsers, IconWallet, IconAlertTriangle } from "@/components/icons";

const stats = [
  { label: "Pedidos totales", valor: "248", cambio: "+18% vs. ayer", icon: <IconBox className="h-5 w-5" /> },
  { label: "En proceso", valor: "132", cambio: "+150% vs. ayer", icon: <IconWallet className="h-5 w-5" /> },
  { label: "Entregados", valor: "96", cambio: "+22% vs. ayer", icon: <IconUsers className="h-5 w-5" /> },
  { label: "Nuevos clientes", valor: "38", cambio: "+15% vs. ayer", icon: <IconAlertTriangle className="h-5 w-5" /> },
];

const estados = [
  { label: "Recibidos", valor: 48, color: "var(--color-greige)" },
  { label: "En proceso", valor: 132, color: "var(--color-borgona)" },
  { label: "En camino", valor: 34, color: "var(--color-dorado)" },
  { label: "Entregados", valor: 96, color: "#3f5c2b" },
  { label: "Cancelados", valor: 8, color: "var(--color-rosa)" },
];

const total = estados.reduce((acc, e) => acc + e.valor, 0);

function conicGradient() {
  let acc = 0;
  const parts = estados.map((e) => {
    const start = (acc / total) * 360;
    acc += e.valor;
    const end = (acc / total) * 360;
    return `${e.color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${parts.join(", ")})`;
}

const tendencia = [40, 55, 48, 62, 70, 58, 66];
const puntos = tendencia
  .map((v, i) => `${(i / (tendencia.length - 1)) * 100},${100 - v}`)
  .join(" ");

export default function DashboardAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Resumen"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-dorado-suave">Bienvenido de vuelta</p>
          <h1 className="font-display text-2xl text-carbon">Resumen general</h1>
        </div>
        <span className="rounded-full border border-greige/70 px-4 py-1.5 text-xs text-carbon/60">
          Hoy
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            value={s.valor}
            label={s.label}
            trend={s.cambio}
            trendTone="up"
            tone="rosa"
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg text-carbon mb-4">Pedidos por estado</h2>
          <div className="flex items-center gap-8">
            <div className="relative h-36 w-36 rounded-full shrink-0" style={{ background: conicGradient() }}>
              <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="font-display text-xl text-carbon">{total}</span>
                <span className="text-[10px] text-carbon/50">Total</span>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              {estados.map((e) => (
                <li key={e.label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
                  <span className="text-carbon/70">{e.label}</span>
                  <span className="text-carbon/45 text-xs">{e.valor}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg text-carbon mb-4">Tendencia de pedidos</h2>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-36 w-full">
            <polyline
              points={puntos}
              fill="none"
              stroke="var(--color-borgona)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="flex justify-between text-[10px] text-carbon/40 mt-2">
            <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
          </div>
        </Card>
      </div>
    </RolePortalShell>
  );
}
