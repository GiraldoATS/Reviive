import SiteShell from "@/components/SiteShell";
import EmptyState from "@/components/EmptyState";
import { IconSearch } from "@/components/icons";

export default function NotFound() {
  return (
    <SiteShell hideFloatingAlma>
      <EmptyState
        icon={<IconSearch className="h-8 w-8" />}
        title="404 · Página no encontrada"
        description="La página que buscas no existe o ha sido movida."
        actionLabel="Volver al inicio"
        actionHref="/"
        secondaryLabel="Ir al catálogo"
        secondaryHref="/catalogo"
      />
    </SiteShell>
  );
}
