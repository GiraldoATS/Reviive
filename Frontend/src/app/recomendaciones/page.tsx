import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { ProductIcon } from "@/components/icons";
import { recomendaciones } from "@/data/mock";

const tabs = ["Para el objeto", "Cuidados", "Inspiración"];

export default function RecomendacionesPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="font-display text-3xl text-carbon">
          Recomendados para ti
        </h1>
        <p className="text-sm text-carbon/60 mt-1 mb-8">
          Servicios y cuidados que interesarían.
        </p>

        <div className="flex gap-2 mb-8">
          {tabs.map((tab, i) => (
            <span
              key={tab}
              className={`rounded-full px-4 py-1.5 text-sm ${
                i === 0
                  ? "bg-borgona text-marfil"
                  : "border border-greige/70 text-carbon/70"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {recomendaciones.map((rec) => (
            <Card key={rec.id} className="flex gap-4">
              <ProductIcon icono={rec.imagen} className="h-9 w-9 shrink-0 text-borgona" />
              <div>
                <h3 className="font-display text-lg text-carbon">{rec.titulo}</h3>
                <p className="mt-1 text-sm text-carbon/65">{rec.justificacion}</p>
                <Button href="/pedido/pedido-0512" variant="ghost" className="mt-3 px-0 text-xs">
                  Ver detalle →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-10 bg-gradient-to-br from-rosa/30 to-marfil">
          <h3 className="font-display text-lg text-borgona">
            Historias que inspiran
          </h3>
          <p className="mt-2 text-sm text-carbon/65">
            Descubre proyectos que han marcado momentos.
          </p>
          <Button href="/catalogo" variant="ghost" className="mt-2 px-0 text-xs">
            Ver historias →
          </Button>
        </Card>
      </div>
    </SiteShell>
  );
}
