import SiteShell from "@/components/SiteShell";
import EmptyState from "@/components/EmptyState";
import { IconSettings } from "@/components/icons";

export default function MantenimientoPage() {
  return (
    <SiteShell hideFloatingAlma>
      <EmptyState
        icon={<IconSettings className="h-8 w-8" />}
        title="En mantenimiento"
        description="Estamos realizando mejoras para brindarte una mejor experiencia."
        actionLabel="Intentar más tarde"
        actionHref="/"
      />
    </SiteShell>
  );
}
