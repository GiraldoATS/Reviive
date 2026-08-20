import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconMessage, IconClockAlert, IconAlertTriangle, IconCheckCircle } from "@/components/icons";

export default function SupervisionResumenPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Resumen"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Bandeja de conversaciones</h1>
      <p className="text-sm text-carbon/55 mb-6">Monitorea, revisa y asegura conversaciones significativas.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconMessage className="h-5 w-5" />} value="128" label="Abiertas" trend="+12 hoy" trendTone="up" tone="rosa" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value="45" label="Pendientes" trend="+7 hoy" trendTone="up" tone="dorado" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value="12" label="Críticas" trend="+3 hoy" trendTone="up" tone="borgona" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="86" label="Corregidas" trend="+15 hoy" trendTone="up" tone="verde" />
      </div>

      <Card>
        <p className="font-display text-lg text-borgona text-center italic">
          &ldquo;Cada conversación es un recuerdo en construcción.&rdquo;
        </p>
      </Card>
    </RolePortalShell>
  );
}
