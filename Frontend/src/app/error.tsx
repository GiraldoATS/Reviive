"use client";

import SiteShell from "@/components/SiteShell";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { IconAlertTriangle } from "@/components/icons";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <SiteShell hideFloatingAlma>
      <EmptyState
        tone="danger"
        icon={<IconAlertTriangle className="h-8 w-8" />}
        title="¡Algo salió mal!"
        description="Ocurrió un error inesperado. Nuestro equipo ya fue notificado."
        secondaryLabel="Contactar soporte"
        secondaryHref="/contacto"
      />
      <div className="text-center -mt-10 pb-16">
        <Button onClick={reset} variant="primary">Intentar nuevamente</Button>
      </div>
    </SiteShell>
  );
}
