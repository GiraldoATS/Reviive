import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { IconMessage } from "@/components/icons";

export default function VerificarCorreoPage() {
  return (
    <SiteShell hideFloatingAlma>
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <Card>
          <div className="h-14 w-14 rounded-full bg-rosa/40 flex items-center justify-center mx-auto">
            <IconMessage className="h-7 w-7 text-borgona" />
          </div>
          <h1 className="mt-5 font-display text-2xl text-carbon">Verifica tu correo</h1>
          <p className="mt-2 text-sm text-carbon/60">
            Enviamos un enlace de confirmación a tu correo electrónico. Ábrelo
            para activar tu cuenta de Reviive.
          </p>
          <Button variant="secondary" className="w-full justify-center mt-6">
            Reenviar correo
          </Button>
        </Card>
      </div>
    </SiteShell>
  );
}
