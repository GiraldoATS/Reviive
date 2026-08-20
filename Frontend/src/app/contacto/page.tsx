import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ContactoPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-4xl text-carbon text-center">Contacto</h1>
        <p className="mt-3 text-carbon/65 text-center">
          Escríbenos y con gusto te acompañamos en tu proyecto.
        </p>
        <Card className="mt-10">
          <form className="space-y-4">
            <label className="block">
              <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Nombre</span>
              <input className="input" placeholder="Tu nombre" />
            </label>
            <label className="block">
              <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
              <input type="email" className="input" placeholder="tu@email.com" />
            </label>
            <label className="block">
              <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Mensaje</span>
              <textarea className="input resize-none" rows={4} placeholder="Cuéntanos en qué podemos ayudarte..." />
            </label>
            <Button type="submit" variant="primary" className="w-full justify-center">
              Enviar mensaje
            </Button>
          </form>
        </Card>
      </div>
    </SiteShell>
  );
}
