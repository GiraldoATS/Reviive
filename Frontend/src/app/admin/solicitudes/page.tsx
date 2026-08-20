import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import FilterBar from "@/components/FilterBar";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconBox, IconEye, IconClockAlert, IconFlag } from "@/components/icons";

const solicitudes = [
  ["#REQ-7821", "Juan Martínez", "Reloj de bolsillo", "Ciudad de México", "Alta", "2h 15m", "Nueva"],
  ["#REQ-7819", "Laura Méndez", "Restauración de fotografías", "Guadalajara", "Media", "6h 30m", "En revisión"],
  ["#REQ-7817", "Andrea Castillo", "Digitalización premium", "Monterrey", "Alta", "1h 05m", "Requiere contacto"],
  ["#REQ-7816", "Sofía Ramírez", "Anillo memoria personalizado", "Puebla", "Media", "8h 20m", "En revisión"],
  ["#REQ-7813", "Miguel Rodríguez", "Preservación profesional", "Querétaro", "Baja", "1d 4h", "Nueva"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  Nueva: "pending",
  "En revisión": "progress",
  "Requiere contacto": "progress",
};

export default function SolicitudesAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Solicitudes"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de solicitudes</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Administra y da seguimiento a todas las solicitudes entrantes.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value="128" label="Solicitudes nuevas" trend="+18.3% vs. mes anterior" trendTone="up" tone="rosa" />
        <StatCard icon={<IconEye className="h-5 w-5" />} value="312" label="En revisión" trend="+11.7% vs. mes anterior" trendTone="up" tone="dorado" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value="56" label="Requieren contacto" trend="+6.7% vs. mes anterior" trendTone="down" tone="borgona" />
        <StatCard icon={<IconFlag className="h-5 w-5" />} value="34" label="Priorizadas" trend="+9.4% vs. mes anterior" trendTone="up" tone="greige" />
      </div>

      <FilterBar
        fields={[
          { label: "Canal", placeholder: "Todos los canales" },
          { label: "Ciudad", placeholder: "Todas las ciudades" },
          { label: "Prioridad", placeholder: "Todas" },
          { label: "Estado", placeholder: "Todos" },
        ]}
      />

      <SimpleTable
        columns={["ID", "Solicitante", "Tipo de objeto", "Ciudad", "Prioridad", "SLA", "Estado", ""]}
        rows={solicitudes.map((s) => [
          s[0],
          s[1],
          s[2],
          s[3],
          <Badge key="p" tone={s[4] === "Alta" ? "progress" : "neutral"}>{s[4]}</Badge>,
          s[5],
          <Badge key="e" tone={toneByEstado[s[6]] ?? "neutral"}>{s[6]}</Badge>,
          <span key="a" className="text-borgona text-xs">Ver →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
