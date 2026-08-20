import SiteShell from "@/components/SiteShell";
import EmptyState from "@/components/EmptyState";
import { IconLock } from "@/components/icons";

export default function AccesoDenegadoPage() {
  return (
    <SiteShell hideFloatingAlma>
      <EmptyState
        tone="danger"
        icon={<IconLock className="h-8 w-8" />}
        title="Permiso insuficiente"
        description="No tienes permisos para acceder a esta sección. Si crees que es un error, contacta al administrador."
        actionLabel="Volver al inicio"
        actionHref="/"
      />
    </SiteShell>
  );
}
