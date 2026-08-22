import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { IconMessage, IconPlus } from "@/components/icons";

const tiposServicio = [
  {
    icono: "/images/servicios/icon-restauracion.png",
    titulo: "Restauración",
    texto: "Recuperamos el estado, funcionalidad o apariencia de objetos deteriorados.",
    ideal: ["Muebles y maderas", "Joyas y relojes", "Fotografías", "Objetos decorativos"],
  },
  {
    icono: "/images/servicios/icon-preservacion.png",
    titulo: "Preservación",
    texto: "Protegemos tus recuerdos para evitar que continúen deteriorándose.",
    ideal: ["Fotografías y cartas", "Documentos", "Textiles y telas", "Objetos familiares"],
  },
  {
    icono: "/images/servicios/icon-transformacion.png",
    titulo: "Transformación",
    texto: "Convertimos un objeto significativo en una nueva pieza conservando su esencia.",
    ideal: ["Prendas de vestir", "Textiles y telas", "Cartas y documentos", "Objetos especiales"],
  },
  {
    icono: "/images/servicios/icon-mantenimiento.png",
    titulo: "Mantenimiento",
    texto: "Cuidamos objetos restaurados o especiales para prolongar su conservación.",
    ideal: ["Muebles", "Cuero y textiles", "Joyas y relojes", "Piezas restauradas"],
  },
  {
    icono: "/images/servicios/icon-evaluacion.png",
    titulo: "Evaluación",
    texto: "Analizamos tu objeto y te recomendamos la mejor opción para conservarlo.",
    ideal: ["Objetos con daño", "No sabes qué hacer", "Dudas sobre intervención"],
  },
];

const categorias = [
  { icono: "/images/servicios/cat-joyas.png", titulo: "Joyas y relojes" },
  { icono: "/images/servicios/cat-fotos.png", titulo: "Fotografías y cartas" },
  { icono: "/images/servicios/cat-textiles.png", titulo: "Textiles y telas" },
  { icono: "/images/servicios/cat-peluches.png", titulo: "Peluches y juguetes" },
  { icono: "/images/servicios/cat-objetos.png", titulo: "Objetos decorativos" },
  { icono: "/images/servicios/cat-muebles.png", titulo: "Muebles y maderas" },
  { icono: "/images/servicios/cat-prendas.png", titulo: "Prendas de vestir" },
];

const transformaciones = [
  {
    before: "/images/servicios/before-after/camisa-before.png",
    after: "/images/servicios/before-after/camisa-after.png",
    titulo: "Camisa → Peluche memoria",
    texto: "De una prenda llena de significado a un nuevo abrazo para siempre.",
  },
  {
    before: "/images/servicios/before-after/prenda-before.png",
    after: "/images/servicios/before-after/prenda-after.png",
    titulo: "Prenda → Cojín memoria",
    texto: "Un pedacito de tu historia que decora y acompaña.",
  },
  {
    before: "/images/servicios/before-after/fotos-before.png",
    after: "/images/servicios/before-after/fotos-after.png",
    titulo: "Fotografías → Álbum restaurado",
    texto: "Recuperamos imágenes para que los recuerdos nunca se borren.",
  },
  {
    before: "/images/servicios/before-after/mueble-before.png",
    after: "/images/servicios/before-after/mueble-after.png",
    titulo: "Mueble familiar → Pieza restaurada",
    texto: "Conservamos su esencia, devolviéndole su belleza.",
  },
];

const pasos = [
  { icono: "/images/como-funciona/icon-comparte.png", titulo: "Cuéntanos tu historia", texto: "Comparte la historia de tu objeto y envíanos fotos para conocer cada detalle." },
  { icono: "/images/como-funciona/icon-evaluamos.png", titulo: "Evaluamos tu pieza", texto: "Nuestros especialistas analizan el estado, materiales y posibles alternativas." },
  { icono: "/images/como-funciona/icon-propuesta.png", titulo: "Te proponemos opciones", texto: "Recibes una propuesta clara con el plan de trabajo, tiempos y costos." },
  { icono: "/images/como-funciona/icon-restauramos.png", titulo: "Realizamos el proceso", texto: "Trabajamos con técnicas artesanales y materiales de alta calidad." },
  { icono: "/images/como-funciona/icon-entrega.png", titulo: "Entrega cuidadosa", texto: "Tu pieza viaja protegida hasta tus manos, con un empaque seguro." },
  { icono: "/images/como-funciona/icon-propuesta.png", titulo: "Tu recuerdo sigue vivo", texto: "Tu memoria vuelve a ser parte de tu día a día y de las historias que están por venir." },
];

const soluciones = [
  { foto: "/images/servicios/sol-peluche.png", titulo: "Peluche Memoria", texto: "Transformamos tu prenda en un peluche único que abraza tu historia." },
  { foto: "/images/servicios/sol-cojin.png", titulo: "Cojín Memoria", texto: "Un recuerdo que decora tu hogar y te acompaña." },
  { foto: "/images/servicios/sol-fotografica.png", titulo: "Restauración fotográfica", texto: "Recuperamos imágenes para que tu historia nunca se borre." },
  { foto: "/images/servicios/sol-cartas.png", titulo: "Conservación de cartas", texto: "Protegemos cartas y documentos importantes." },
  { foto: "/images/servicios/sol-muebles.png", titulo: "Restauración de muebles", texto: "Devolvemos vida y belleza a tus muebles familiares." },
  { foto: "/images/servicios/sol-relojes.png", titulo: "Restauración de relojes", texto: "Recuperamos su funcionamiento y su historia." },
];

const testimonios = [
  { nombre: "Mariana G.", foto: "/images/avatars/mariana-v3.png", texto: "Mi camisa favorita de mi papá ahora es un peluche que abraza a mi hijo cada noche. Gracias Reviive por hacerlo posible." },
  { nombre: "Andrés P.", foto: "/images/avatars/andres-v3.png", texto: "Restauraron las fotos de mi abuela y ahora mis hijos conocen su historia tal como ella quería que la recordáramos." },
  { nombre: "Lucía T.", foto: "/images/avatars/lucia-v3.png", texto: "El mueble de mi bisabuela volvió a brillar. No es solo un mueble, es parte de nuestra historia familiar." },
];

const preguntas = [
  "¿Cómo sé qué servicio necesita mi objeto?",
  "¿Qué objetos recibe Reviive?",
  "¿Puedo transformar una prenda en otro objeto?",
  "¿Qué pasa si mi pieza está muy deteriorada?",
  "¿Cómo calculan el precio de la intervención?",
  "¿Dónde se realiza el trabajo?",
  "¿Cómo envío mi objeto a Reviive?",
  "¿Cómo hacen seguimiento al proceso?",
];

export default function ServiciosPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 pt-4 text-xs text-carbon/50">
        <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-carbon/70">Servicios</span>
      </div>

      <section className="relative overflow-hidden grid lg:grid-cols-2 items-stretch">
        <div className="pointer-events-none absolute -left-4 top-0 hidden h-full w-36 opacity-25 sm:block md:w-44">
          <Image src="/images/sobre-reviive/rama-hero.png" alt="" fill sizes="176px" className="object-contain object-top" unoptimized />
        </div>
        <div className="relative px-6 py-12 lg:py-16 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-dorado-suave">
            <span className="relative h-5 w-10 shrink-0">
              <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="40px" className="object-contain" />
            </span>
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Servicios para preservar lo que no quieres perder
          </h1>
          <p className="mt-5 text-carbon/75 max-w-md">
            Cada objeto guarda una historia única. Te ayudamos a restaurarlo, conservarlo o transformarlo para que pueda seguir acompañándote.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/recuerdos/nuevo" variant="primary">
              Cuéntanos tu historia →
            </Button>
            <Button href="/chat" variant="secondary" className="inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Hablar con Alma
            </Button>
          </div>
        </div>
        <div className="relative h-64 lg:h-auto">
          <Image
            src="/images/servicios/hero.png"
            alt="Servicios de restauración Reviive"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-borgona">
          ¿Qué quieres hacer con tu recuerdo?
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {tiposServicio.map((s) => (
            <div key={s.titulo} className="rounded-2xl border border-greige/60 bg-white/70 p-6 flex flex-col text-left">
              <div className="relative h-14 w-14 mx-auto">
                <Image src={s.icono} alt="" fill sizes="96px" className="object-contain" unoptimized />
              </div>
              <h3 className="mt-3 font-display text-base text-borgona text-center">{s.titulo}</h3>
              <p className="mt-1.5 text-xs text-carbon/60 text-center">{s.texto}</p>
              <p className="mt-4 text-[11px] uppercase tracking-wide text-dorado-suave">Ideal para:</p>
              <ul className="mt-1.5 space-y-1 text-xs text-carbon/70 list-disc list-inside">
                {s.ideal.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link
                href="/catalogo"
                className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-borgona hover:text-borgona-dark transition-colors"
              >
                Ver servicio →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-greige/20 py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-borgona">
            Encuentra una solución según tu recuerdo
          </h2>
          <div className="relative mx-auto mt-2 h-6 w-44 md:w-56">
            <Image src="/images/servicios/divider-rama.png" alt="" fill sizes="224px" className="object-contain" unoptimized />
          </div>
          <p className="mt-2 text-sm text-carbon/60">
            Selecciona una categoría y te mostraremos qué servicios aplican a tu objeto.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-8">
            {categorias.map((c) => (
              <Link
                key={c.titulo}
                href="/catalogo"
                className="flex flex-col items-center gap-2 w-24 group"
              >
                <div className="relative h-14 w-14 transition-transform duration-200 group-hover:scale-105">
                  <Image src={c.icono} alt="" fill sizes="96px" className="object-contain" unoptimized />
                </div>
                <span className="text-xs text-carbon/70 text-center">{c.titulo}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          Lo que puede volver a ser
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {transformaciones.map((t) => (
            <div key={t.titulo} className="text-left">
              <BeforeAfterSlider before={t.before} after={t.after} alt={t.titulo} className="aspect-[4/3] w-full rounded-2xl" />
              <h3 className="mt-3 font-display text-sm text-borgona">{t.titulo}</h3>
              <p className="mt-1 text-xs text-carbon/60">{t.texto}</p>
            </div>
          ))}
        </div>
        <Button href="/catalogo" variant="secondary" className="mt-10">
          Ver todas las posibilidades →
        </Button>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8 md:p-10 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-4 -bottom-6 hidden h-56 w-44 opacity-60 sm:block md:h-64 md:w-52">
            <Image src="/images/servicios/card-rama-alma.png" alt="" fill sizes="208px" className="object-contain object-bottom" unoptimized />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative h-28 w-28 md:h-32 md:w-32 shrink-0">
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden ring-2 ring-white">
                <Image src="/images/servicios/alma-ayuda.png" alt="Alma" fill sizes="128px" className="object-cover" unoptimized />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-rosa/70 text-borgona ring-2 ring-marfil">
                <IconMessage className="h-4 w-4" />
              </span>
            </div>
            <div className="relative flex-1 text-center sm:text-left max-w-xl">
              <h3 className="font-display text-xl text-borgona">¿No sabes qué servicio necesitas?</h3>
              <p className="mt-2 text-sm text-carbon/70 leading-relaxed">
                Hola, soy Alma. Cuéntame sobre ese objeto tan especial, quién era importante para ti y qué te gustaría conservar de él. Te ayudaré a descubrir la mejor opción para darle una nueva vida.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 justify-center sm:justify-start">
                <Button href="/chat" variant="primary" className="inline-flex items-center gap-2 justify-center">
                  <IconMessage className="h-4 w-4" />
                  Hablar con Alma
                </Button>
                <Button href="/recuerdos/nuevo" variant="secondary" className="justify-center">
                  Subir una fotografía
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          Así es nuestro proceso
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <div className="relative z-0 mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
          <div className="hidden lg:block absolute left-[8%] right-[8%] top-8 -z-10 border-t-2 border-dotted border-dorado-suave/50" />
          {pasos.map((p, i) => (
            <div key={p.titulo}>
              <div className="relative h-16 w-16 mx-auto">
                <Image src={p.icono} alt="" fill sizes="64px" className="object-contain" />
              </div>
              <span className="mt-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-borgona text-[10px] text-marfil">
                {i + 1}
              </span>
              <h3 className="mt-2 font-display text-sm text-borgona">{p.titulo}</h3>
              <p className="mt-1.5 text-xs text-carbon/60">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-greige/20 py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
            Soluciones destacadas
            <span className="relative h-5 w-8 shrink-0">
              <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
            </span>
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {soluciones.map((s) => (
              <div key={s.titulo} className="rounded-2xl border border-greige/60 bg-white/70 overflow-hidden flex flex-col text-left">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={s.foto} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" unoptimized />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-base text-borgona">{s.titulo}</h3>
                  <p className="mt-1.5 text-xs text-carbon/60 flex-1">{s.texto}</p>
                  <Link
                    href="/catalogo"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-borgona hover:text-borgona-dark transition-colors"
                  >
                    Conocer más →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          Ellos confiaron en Reviive para conservar sus recuerdos
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {testimonios.map((t) => (
            <div key={t.nombre} className="rounded-2xl border border-greige/60 bg-white/70 p-6 flex items-start gap-4 text-left">
              <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0 ring-2 ring-white">
                <Image src={t.foto} alt={t.nombre} fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm text-carbon/75 italic">&ldquo;{t.texto}&rdquo;</p>
                <p className="mt-1.5 text-xs font-medium text-borgona">{t.nombre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="flex items-center justify-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          Preguntas frecuentes
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 gap-x-8">
          {preguntas.map((p) => (
            <details key={p} className="group border-b border-greige/60 py-3">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm text-carbon/80">
                {p}
                <IconPlus className="h-4 w-4 shrink-0 text-dorado-suave transition-transform duration-200 group-open:rotate-45" />
              </summary>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-borgona py-7">
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-24 opacity-40 md:h-40 md:w-28">
          <Image src="/images/servicios/cta-rama-izquierda.png" alt="" fill sizes="112px" className="object-contain object-left-bottom" unoptimized />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-24 opacity-40 md:h-40 md:w-28">
          <Image src="/images/servicios/cta-rama-derecha.png" alt="" fill sizes="112px" className="object-contain object-right-bottom" unoptimized />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 flex flex-col items-center gap-3 text-center">
          <div>
            <p className="font-display text-xl text-marfil">Cada recuerdo merece una oportunidad de permanecer.</p>
            <p className="mt-1 text-sm text-marfil/70">Cuéntanos qué tienes y te ayudaremos a encontrar la mejor forma de conservarlo.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/recuerdos/nuevo" variant="secondary" className="!text-marfil !border-marfil hover:!bg-marfil/10">
              Solicitar evaluación →
            </Button>
            <Button href="/chat" variant="ghost" className="!text-marfil inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Hablar con Alma
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
