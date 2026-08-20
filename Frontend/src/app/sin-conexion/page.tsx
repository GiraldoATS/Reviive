import SiteShell from "@/components/SiteShell";
import EmptyState from "@/components/EmptyState";
import { IconWifiOff } from "@/components/icons";

export default function SinConexionPage() {
  return (
    <SiteShell hideFloatingAlma>
      <EmptyState
        icon={<IconWifiOff className="h-8 w-8" />}
        title="Sin conexión a internet"
        description="Parece que has perdido la conexión. Verifica tu red e intenta nuevamente."
        actionLabel="Reintentar"
        actionHref="/"
      />
    </SiteShell>
  );
}
