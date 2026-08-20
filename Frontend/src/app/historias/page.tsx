import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import { IconReloj, IconJoya, IconFotografia } from "@/components/icons";

const historias = [
  { icon: IconReloj, titulo: "El reloj de mi abuelo", texto: "Después de 40 años parado, el reloj de bolsillo de Omega de mi abuelo vuelve a marcar el tiempo en mi muñeca.", autor: "Carolina M., Bogotá" },
  { icon: IconJoya, titulo: "El anillo de mamá", texto: "Restauramos el anillo de compromiso de mi madre para dárselo a mi hija el día de su boda.", autor: "Andrés P., Medellín" },
  { icon: IconFotografia, titulo: "Fotografías que casi se pierden", texto: "La humedad casi destruye el único álbum familiar que teníamos. Hoy está digitalizado y restaurado.", autor: "Laura G., Cali" },
];

export default function HistoriasPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="font-display text-4xl text-carbon">Historias que inspiran</h1>
        <p className="mt-3 text-carbon/65 max-w-xl mx-auto">
          Proyectos reales que han marcado momentos en la vida de nuestros clientes.
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-24 grid md:grid-cols-3 gap-6">
        {historias.map((h) => (
          <Card key={h.titulo}>
            <h.icon className="h-8 w-8 text-borgona" />
            <h3 className="mt-4 font-display text-lg text-carbon">{h.titulo}</h3>
            <p className="mt-2 text-sm text-carbon/65">{h.texto}</p>
            <p className="mt-4 text-xs text-carbon/45">— {h.autor}</p>
          </Card>
        ))}
      </div>
    </SiteShell>
  );
}
