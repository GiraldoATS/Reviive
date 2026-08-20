import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import LeafSprig from "@/components/LeafSprig";
import {
  IconAnillo,
  IconFotografia,
  IconVasija,
  IconBolso,
  IconSilla,
  IconManosCorazon,
  IconMedalla,
  IconConfianza,
  IconBrote,
  IconRelojArena,
} from "@/components/icons";

const pasos = [
  { foto: "/images/steps/step1-historia-v3.png", titulo: "Cuéntanos tu historia", texto: "Cada objeto tiene un significado. Escuchamos tu historia y entendemos qué lo hace único." },
  { foto: "/images/steps/step2-lupa-v3.png", titulo: "Evaluamos y proponemos", texto: "Analizamos su estado y te proponemos la mejor forma de preservarlo o transformarlo." },
  { foto: "/images/steps/step3-manos-v3.png", titulo: "Restauramos y creamos", texto: "Trabajamos con técnicas artesanales y materiales de la más alta calidad para devolverle vida." },
  { foto: "/images/steps/step4-hourglass-v3.png", titulo: "Lo devolvemos a tu historia", texto: "Recibes tu pieza restaurada o transformada, lista para seguir siendo parte de tu vida." },
];

const categorias = [
  { Icono: IconAnillo, titulo: "Joyas y Relojes", texto: "Restauración y mantenimiento de piezas que guardan momentos inolvidables.", foto: "/images/categories/joyas-relojes.png" },
  { Icono: IconFotografia, titulo: "Memorias en Papel", texto: "Conservación y restauración de fotografías, cartas y documentos familiares.", foto: "/images/categories/memorias-papel.png" },
  { Icono: IconVasija, titulo: "Objetos Decorativos", texto: "Devolvemos la belleza a piezas de cerámica, vidrio, metal y más.", foto: "/images/categories/objetos-decorativos.png" },
  { Icono: IconBolso, titulo: "Cuero y Textiles", texto: "Restauración de bolsos, prendas y textiles con valor emocional.", foto: "/images/categories/cuero-textiles.png" },
  { Icono: IconSilla, titulo: "Muebles y Maderas", texto: "Reparación y restauración para que vuelvan a ser parte de tu hogar.", foto: "/images/categories/muebles-maderas.png" },
];

const confianza = [
  { Icono: IconManosCorazon, titulo: "Hecho con cuidado", texto: "Cada pieza es tratada con el máximo respeto y dedicación." },
  { Icono: IconMedalla, titulo: "Artesanía experta", texto: "Técnicas tradicionales y materiales de la más alta calidad." },
  { Icono: IconConfianza, titulo: "Confidencialidad", texto: "Tu historia y tus objetos están en las mejores manos." },
  { Icono: IconBrote, titulo: "Sostenibilidad", texto: "Damos nueva vida a lo que ya existe, reduciendo impacto y cuidando el planeta." },
  { Icono: IconRelojArena, titulo: "Herencias que perduran", texto: "Creamos piezas que siguen contando historias por generaciones." },
];

const testimonios = [
  { nombre: "Mariana G.", foto: "/images/avatars/mariana.png", texto: "Mi abuela estaría feliz de ver su reloj otra vez conmigo. Gracias por tanto cuidado y amor." },
  { nombre: "Andrés P.", foto: "/images/avatars/andres.png", texto: "Transformaron un mueble que ya no usábamos en la pieza favorita de mi hogar." },
  { nombre: "Lucía T.", foto: "/images/avatars/lucia.png", texto: "Profesionales, cálidos y atentos. Superaron todas mis expectativas." },
];

export default function Home() {
  return (
    <SiteShell>
      <section className="grid lg:grid-cols-2 items-stretch">
        <div className="relative px-6 py-16 lg:py-24 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))] overflow-hidden">
          <div className="hidden lg:block absolute left-2 top-1/2 -translate-y-1/2 h-[420px] w-32">
            <Image src="/images/branch-left-v2.png" alt="" fill sizes="128px" className="object-contain object-top" />
          </div>
          <h1 className="relative font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            El taller donde el tiempo se devuelve.
            <span className="absolute -right-2 bottom-2 h-14 w-24 translate-x-full">
              <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="96px" className="object-contain" />
            </span>
          </h1>
          <p className="relative mt-5 text-carbon/75 max-w-md">
            Preservamos, restauramos y transformamos objetos significativos
            para que sigan contando tu historia durante generaciones.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-4">
            <Button href="/recuerdos/nuevo" variant="primary">
              Solicitar evaluación →
            </Button>
            <Button href="/como-funciona" variant="secondary">
              Conocer el proceso
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-auto">
          <Image
            src="/images/landing-hero.png"
            alt="Objetos restaurados por Reviive"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-widest text-dorado-suave">Cómo funciona</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-medium text-borgona-dark">
          Un proceso cuidadoso, humano y artesanal.
        </h2>
        <div className="relative h-7 w-14 mx-auto mt-2">
          <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="56px" className="object-contain" />
        </div>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:divide-x md:divide-dotted md:divide-greige">
          {pasos.map((p, i) => (
            <div key={p.titulo} className="md:px-2">
              <div className="h-14 w-14 mx-auto rounded-full bg-rosa/40 flex items-center justify-center">
                <div className="relative h-7 w-7">
                  <Image src={p.foto} alt="" fill sizes="28px" className="object-contain" />
                </div>
              </div>
              <h3 className="mt-4 font-display text-base text-borgona">
                {i + 1}. {p.titulo}
              </h3>
              <p className="mt-2 text-sm text-carbon/60">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-greige/20 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs uppercase tracking-widest text-dorado-suave">
            Categorías destacadas
          </p>
          <div className="relative h-7 w-14 mx-auto mt-2">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="56px" className="object-contain" />
          </div>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 gap-6">
            {categorias.map((c) => (
              <div key={c.titulo} className="rounded-2xl border border-greige/70 bg-white/70 overflow-hidden">
                <div className="relative h-28 w-full">
                  <Image src={c.foto} alt="" fill sizes="220px" className="object-cover" />
                </div>
                <div className="px-4 pb-5 pt-8 relative text-center">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white border border-greige/60 flex items-center justify-center shadow-sm">
                    <c.Icono className="h-5 w-5 text-borgona" />
                  </div>
                  <h3 className="font-display text-base text-borgona">{c.titulo}</h3>
                  <p className="mt-1.5 text-xs text-carbon/60">{c.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-borgona text-marfil py-16 relative overflow-hidden">
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-64 w-40 -rotate-6">
          <Image src="/images/branch-left-v2.png" alt="" fill sizes="160px" className="object-contain object-left" />
        </div>
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-64 w-40 rotate-6 scale-x-[-1]">
          <Image src="/images/branch-left-v2.png" alt="" fill sizes="160px" className="object-contain object-left" />
        </div>
        <div className="mx-auto max-w-6xl px-6 relative">
          <div className="flex items-center justify-center gap-2">
            <p className="text-center text-xs uppercase tracking-widest text-dorado">
              Por qué confiar en Reviive
            </p>
            <span className="relative h-6 w-12 shrink-0">
              <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="48px" className="object-contain" />
            </span>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 gap-8 text-center md:divide-x md:divide-dotted md:divide-dorado/40">
            {confianza.map((c) => (
              <div key={c.titulo} className="md:px-2">
                <c.Icono className="h-8 w-8 mx-auto text-dorado" />
                <h3 className="mt-3 font-display text-base">{c.titulo}</h3>
                <p className="mt-1.5 text-xs text-marfil/70">{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rosa/25 py-16">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div>
            <span className="font-display text-5xl text-dorado leading-none">&ldquo;</span>
            <p className="font-display text-2xl text-borgona leading-snug">
              No es solo restaurar un objeto, es devolverle su lugar en tu historia.
            </p>
            <LeafSprig className="h-10 w-10 text-dorado mt-3" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonios.map((t) => (
              <div key={t.nombre} className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                    <Image src={t.foto} alt={t.nombre} fill sizes="40px" className="object-cover" />
                  </div>
                </div>
                <p className="text-sm text-carbon/75 italic">&ldquo;{t.texto}&rdquo;</p>
                <p className="text-xs font-medium text-borgona">{t.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
