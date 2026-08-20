import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconStar, IconCheckCircle, IconAlertTriangle } from "@/components/icons";

const evaluaciones = [
  ["Atenea", "Consultar planes", "4.8", "Aprobada"],
  ["Chronos", "Duda sobre recordatorios", "3.1", "Requiere revisión"],
  ["Hermes", "Cancelación", "2.4", "Rechazada"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  Aprobada: "success",
  "Requiere revisión": "pending",
  Rechazada: "pending",
};

export default function EvaluacionesSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Evaluaciones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Evaluación de calidad</h1>
      <p className="text-sm text-carbon/55 mb-6">Criterios de exactitud, utilidad, seguridad, tono y cumplimiento.</p>

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconStar className="h-5 w-5" />} value="4.6 / 5" label="Puntaje promedio" tone="dorado" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="86%" label="Evaluaciones aprobadas" tone="verde" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value="12" label="Requieren revisión humana" tone="borgona" />
      </div>

      <SimpleTable
        columns={["Agente", "Intención", "Puntaje", "Resultado", ""]}
        rows={evaluaciones.map((e) => [
          e[0], e[1], e[2],
          <Badge key="s" tone={toneByEstado[e[3]] ?? "neutral"}>{e[3]}</Badge>,
          <span key="a" className="text-borgona text-xs">Ver conversación →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
