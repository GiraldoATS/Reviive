import SiteShell from "@/components/SiteShell";
import EmptyState from "@/components/EmptyState";
import { IconClockAlert } from "@/components/icons";

export default function SesionExpiradaPage() {
  return (
    <SiteShell hideFloatingAlma>
      <EmptyState
        tone="neutral"
        icon={<IconClockAlert className="h-8 w-8" />}
        title="Tu sesión ha expirado"
        description="Por tu seguridad, hemos cerrado tu sesión por inactividad."
        actionLabel="Iniciar sesión nuevamente"
        actionHref="/auth/login"
      />
    </SiteShell>
  );
}
