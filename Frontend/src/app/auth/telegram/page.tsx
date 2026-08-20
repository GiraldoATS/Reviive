import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function VinculacionTelegramPage() {
  return (
    <SiteShell hideFloatingAlma>
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <Card>
          <div className="h-14 w-14 rounded-full bg-[#e8f4fb] flex items-center justify-center mx-auto text-2xl">
            ✈️
          </div>
          <h1 className="mt-5 font-display text-2xl text-carbon">Vincula tu cuenta con Telegram</h1>
          <p className="mt-2 text-sm text-carbon/60">
            Ingresa el siguiente código en el bot de Reviive en Telegram para
            continuar tu conversación de forma segura.
          </p>
          <p className="mt-5 font-display text-3xl tracking-widest text-borgona">RV-4821</p>
          <p className="mt-1 text-xs text-carbon/45">Este código expira en 10 minutos.</p>
          <Button variant="primary" className="w-full justify-center mt-6">
            Abrir bot de Telegram
          </Button>
        </Card>
      </div>
    </SiteShell>
  );
}
