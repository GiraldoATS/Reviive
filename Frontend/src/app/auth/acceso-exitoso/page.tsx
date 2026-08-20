import SiteShell from "@/components/SiteShell";
import EmptyState from "@/components/EmptyState";
import { IconCheckCircle } from "@/components/icons";

export default function AccesoExitosoPage() {
  return (
    <SiteShell hideFloatingAlma>
      <EmptyState
        tone="success"
        icon={<IconCheckCircle className="h-8 w-8" />}
        title="¡Acceso concedido!"
        description="Tu sesión se inició correctamente. Te llevamos a tu panel."
        actionLabel="Ir a mi panel"
        actionHref="/"
      />
    </SiteShell>
  );
}
