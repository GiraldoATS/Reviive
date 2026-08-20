import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";

const conversaciones = [
  ["Ana María Gómez", "Consultar planes", "Atenea", "Plan Legado Esencial", "Bajo", "Abierta", "92"],
  ["Carlos Fernando Ruiz", "Asistencia técnica", "Hermes", "—", "Medio", "Pendiente", "74"],
  ["Lucía Fernández", "Consultar precios", "Atenea", "Plan Legado Premium", "Bajo", "Abierta", "88"],
  ["Jorge Alberto Molina", "Duda sobre recordatorios", "Chronos", "Recordatorios Anuales", "Alto", "Requiere revisión", "45"],
  ["María José Castillo", "Cancelación", "Hermes", "—", "Crítico", "Crítica", "28"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  Abierta: "progress",
  Pendiente: "pending",
  "Requiere revisión": "pending",
  Crítica: "pending",
};

export default function ConversacionesSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Conversaciones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Todas las conversaciones</h1>
      <p className="text-sm text-carbon/55 mb-6">Filtra por canal, riesgo y estado para priorizar tu revisión.</p>

      <SimpleTable
        columns={["Usuario", "Intención", "Agente", "Producto recomendado", "Riesgo", "Estado", "Score", ""]}
        rows={conversaciones.map((c, i) => [
          c[0], c[1], c[2], c[3], c[4],
          <Badge key="e" tone={toneByEstado[c[5]] ?? "neutral"}>{c[5]}</Badge>,
          c[6],
          <a key="a" href={`/supervision/conversaciones/${i + 1}`} className="text-borgona text-xs">Ver →</a>,
        ])}
      />
    </RolePortalShell>
  );
}
