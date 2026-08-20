import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IconSparkle, IconCheckCircle, IconStar, IconPlus } from "@/components/icons";

const agentes = [
  ["Orquestador", "Coordina y orquesta tareas", "v2.1.0", "GPT-4o", "99.2%"],
  ["Acompañamiento (Alma)", "Brinda acompañamiento emocional", "v1.8.3", "Claude 3.5 Sonnet", "97.8%"],
  ["Extracción", "Extrae y estructura información", "v2.0.4", "GPT-4o Mini", "98.7%"],
  ["Creativo", "Genera contenido y alternativas", "v1.9.1", "GPT-4o", "96.3%"],
  ["Proveedores", "Gestiona proveedores y servicios", "v1.7.2", "Claude 3.5 Haiku", "98.1%"],
  ["Cotización", "Genera y evalúa cotizaciones", "v1.6.5", "GPT-4o Mini", "97.2%"],
  ["Evaluador", "Evalúa calidad y desempeño", "v1.4.8", "GPT-4o Mini", "97.9%"],
];

export default function AgentesSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Agentes"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Gestión de agentes</h1>
          <p className="text-sm text-carbon/55">Supervisa, evalúa y administra los agentes de IA orquestados en n8n.</p>
        </div>
        <Button variant="primary" className="text-xs"><IconPlus className="h-4 w-4" /> Nuevo agente</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconSparkle className="h-5 w-5" />} value="9" label="Agentes activos" trend="100% operativos" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="136" label="Pruebas ejecutadas (30 días)" tone="verde" />
        <StatCard icon={<IconStar className="h-5 w-5" />} value="98.4%" label="Tasa de éxito promedio" trend="+2.6% vs. periodo anterior" trendTone="up" tone="dorado" />
      </div>

      <SimpleTable
        columns={["Agente", "Versión", "Modelo", "Tasa de éxito", ""]}
        rows={agentes.map((a, i) => [
          <div key="n"><p className="font-medium text-carbon">{a[0]}</p><p className="text-xs text-carbon/45">{a[1]}</p></div>,
          a[2], a[3],
          <Badge key="t" tone="success">{a[4]}</Badge>,
          <a key="link" href={`/supervision/agentes/${i + 1}`} className="text-borgona text-xs">Ver →</a>,
        ])}
      />
    </RolePortalShell>
  );
}
