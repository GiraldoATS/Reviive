import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";

const eventos = [
  ["18 May 2026 10:24", "Carolina M.", "conversation.message.received", "CONV-2026-05-18-000842"],
  ["18 May 2026 10:31", "Alma v1.8.3", "agent.response.created", "CONV-2026-05-18-000842"],
  ["18 May 2026 11:05", "Mariana López", "conversation.review.completed", "CONV-2026-05-18-000842"],
];

export default function AuditoriaSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Auditoría y trazabilidad"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Auditoría y trazabilidad</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Cada interacción propaga un correlation_id entre frontend, API y n8n.
      </p>

      <SimpleTable
        columns={["Fecha", "Actor", "Evento", "Correlation ID"]}
        rows={eventos.map((e) => [e[0], e[1], <code key="c" className="text-xs">{e[2]}</code>, <code key="id" className="text-xs text-carbon/50">{e[3]}</code>])}
      />
    </RolePortalShell>
  );
}
