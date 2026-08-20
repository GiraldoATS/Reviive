import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProductPhoto from "@/components/ProductPhoto";
import { IconCuidado, IconConfianza, IconTrazable, IconSeguro } from "@/components/icons";
import { getProductos } from "@/lib/api";

const principios = [
  { Icono: IconCuidado, titulo: "Artesanal", texto: "Trazado a mano, con cuidado y respeto por cada pieza." },
  { Icono: IconConfianza, titulo: "Confiable", texto: "Trazabilidad y transparencia en cada paso del proceso." },
  { Icono: IconTrazable, titulo: "Trazable", texto: "Seguimiento del pedido de principio a fin." },
  { Icono: IconSeguro, titulo: "Seguro", texto: "Custodia responsable de objetos con valor sentimental." },
];

export default async function Home() {
  const productos = await getProductos();

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-carbon">
            Devolvemos la vida a tus recuerdos
          </h1>
          <p className="mt-5 text-carbon/75 max-w-md">
            Restauración artesanal de objetos con valor emocional. Cada pieza
            cuenta una historia, y en Reviive la acompañamos hasta devolverle
            su lugar en tu vida.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/recuerdos/nuevo" variant="primary">
              Comenzar proyecto →
            </Button>
            <Button href="/catalogo" variant="secondary">
              Explorar catálogo →
            </Button>
          </div>
          <div className="mt-10 flex gap-8 text-xs uppercase tracking-wide text-carbon/60">
            <span>Artesanal</span>
            <span>Confiable</span>
            <span>Trazable</span>
            <span>Seguro</span>
          </div>
        </div>
        <div className="rounded-2xl border border-dorado/30 overflow-hidden bg-marfil">
          <div className="relative h-64 w-full">
            <Image
              src="/images/hero-watch.png"
              alt="Reloj restaurado por Reviive"
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <p className="font-display text-lg text-borgona text-center">
              &ldquo;Historias que vuelven a marcar momentos.&rdquo;
            </p>
            <Button href="/historias" variant="ghost" className="w-full justify-center text-sm mt-2">
              Ver historias de restauración →
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {principios.map((p) => (
            <div key={p.titulo} className="text-center">
              <p.Icono className="h-8 w-8 mx-auto text-dorado" />
              <h3 className="mt-3 font-display text-lg text-borgona">{p.titulo}</h3>
              <p className="mt-1 text-sm text-carbon/65">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl text-carbon">
            Servicios de restauración
          </h2>
          <Button href="/catalogo" variant="ghost">
            Ver catálogo completo →
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {productos.slice(0, 4).map((prod) => (
            <div
              key={prod.id}
              className="rounded-2xl border border-greige/70 bg-white/60 overflow-hidden hover:shadow-md transition-shadow"
            >
              <ProductPhoto icono={prod.imagen} className="h-32 w-full" />
              <div className="p-5">
                <h3 className="font-display text-lg text-carbon">{prod.nombre}</h3>
                <p className="mt-2 text-sm text-carbon/65">{prod.descripcion}</p>
                <p className="mt-4 text-sm text-dorado-suave">
                  Desde ${prod.precioBase.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Card className="bg-borgona text-marfil border-none flex flex-col md:flex-row items-center justify-between gap-6 p-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl">
              Cuéntale tu historia a Alma
            </h2>
            <p className="mt-2 text-marfil/80 max-w-md">
              Nuestro asistente te acompaña a registrar el recuerdo y a
              encontrar el servicio ideal para restaurarlo.
            </p>
          </div>
          <Button href="/chat" variant="secondary" className="!text-marfil !border-marfil hover:!bg-marfil/10">
            Hablar con Alma →
          </Button>
        </Card>
      </section>
    </SiteShell>
  );
}
