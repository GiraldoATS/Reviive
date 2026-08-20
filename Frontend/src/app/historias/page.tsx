import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import ProductPhoto from "@/components/ProductPhoto";

const historias = [
  {
    photo: "/images/hero-watch.png",
    titulo: "El reloj de mi abuelo",
    texto: "Después de 40 años parado, el reloj de bolsillo de Omega de mi abuelo vuelve a marcar el tiempo en mi muñeca.",
    autor: "Carolina M., Bogotá",
  },
  {
    icono: "compartido",
    titulo: "El anillo de mamá",
    texto: "Restauramos el anillo de compromiso de mi madre para dárselo a mi hija el día de su boda.",
    autor: "Andrés P., Medellín",
  },
  {
    icono: "libro",
    titulo: "Fotografías que casi se pierden",
    texto: "La humedad casi destruye el único álbum familiar que teníamos. Hoy está digitalizado y restaurado.",
    autor: "Laura G., Cali",
  },
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
          <div key={h.titulo} className="rounded-2xl border border-greige/70 bg-white/60 overflow-hidden">
            {h.photo ? (
              <div className="relative h-40 w-full">
                <Image src={h.photo} alt="" fill sizes="360px" className="object-cover" />
              </div>
            ) : (
              <ProductPhoto icono={h.icono!} className="h-40 w-full" />
            )}
            <div className="p-6">
              <h3 className="font-display text-lg text-carbon">{h.titulo}</h3>
              <p className="mt-2 text-sm text-carbon/65">{h.texto}</p>
              <p className="mt-4 text-xs text-carbon/45">— {h.autor}</p>
            </div>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
