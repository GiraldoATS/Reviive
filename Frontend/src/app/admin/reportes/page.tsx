import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconBox, IconWallet, IconWallet as IconTicket, IconStar } from "@/components/icons";

const tendencia = [40, 55, 48, 62, 70, 58, 66];
const puntos = tendencia.map((v, i) => `${(i / (tendencia.length - 1)) * 100},${100 - v}`).join(" ");

export default function ReportesAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Reportes"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Reportes y analítica</h1>
          <p className="text-sm text-carbon/55">Visualiza métricas clave y genera reportes personalizados.</p>
        </div>
        <span className="rounded-full border border-greige/70 px-4 py-1.5 text-xs text-carbon/60">1 May - 15 May 2026</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value="1,256" label="Pedidos totales" trend="+15.3%" trendTone="up" tone="rosa" />
        <StatCard icon={<IconWallet className="h-5 w-5" />} value="$432,680,000" label="Ingresos totales" trend="+18.7%" trendTone="up" tone="dorado" />
        <StatCard icon={<IconTicket className="h-5 w-5" />} value="$343,800" label="Ticket promedio" trend="+4.2%" trendTone="up" tone="verde" />
        <StatCard icon={<IconStar className="h-5 w-5" />} value="4.7 / 5" label="Índice de satisfacción" tone="greige" />
      </div>

      <Card>
        <h2 className="font-display text-lg text-carbon mb-4">Pedidos por día</h2>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
          <polyline points={puntos} fill="none" stroke="var(--color-borgona)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </Card>
    </RolePortalShell>
  );
}
