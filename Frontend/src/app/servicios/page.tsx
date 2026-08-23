"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Modal from "@/components/Modal";
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
  {
    foto: "/images/servicios/sol-peluche.png",
    titulo: "Peluche Memoria",
    texto: "Transformamos tu prenda en un peluche único que abraza tu historia.",
    historia: [
      "Hay prendas que dejan de usarse pero nunca dejan de significar algo: la camisa de un ser querido, la cobija de la infancia, la ropa de un bebé que ya creció. En lugar de guardarlas en un cajón, las convertimos en un peluche que se puede volver a abrazar.",
      "El proceso conserva la tela original —su textura, su color, incluso pequeñas manchas o detalles que hacen parte de la historia— y le da una nueva forma pensada para acompañar el día a día: en la cama, en el sofá, en los brazos de quien lo necesite.",
      "No se trata de reemplazar el recuerdo, sino de darle una manera distinta de seguir presente.",
    ],
  },
  {
    foto: "/images/servicios/sol-cojin.png",
    titulo: "Cojín Memoria",
    texto: "Un recuerdo que decora tu hogar y te acompaña.",
    historia: [
      "Un cojín memoria nace de una prenda o una tela que ya no se usa pero que sigue teniendo un lugar especial: un vestido, una camisa deportiva, una cobija tejida a mano. Le damos una segunda vida como parte de la decoración del hogar.",
      "Cuidamos cada detalle de la tela original para que conserve su identidad, y lo convertimos en una pieza funcional que puede acompañar las tardes en el sofá o descansar sobre una cama, siempre a la vista y siempre presente.",
      "Es una forma sencilla de mantener cerca algo que importa, sin que se quede guardado y olvidado.",
    ],
  },
  {
    foto: "/images/servicios/sol-fotografica.png",
    titulo: "Restauración fotográfica",
    texto: "Recuperamos imágenes para que tu historia nunca se borre.",
    historia: [
      "El tiempo, la humedad y el manejo desgastan las fotografías físicas: se manchan, se decoloran, se rasgan o pierden nitidez. Muchas veces son el único registro que queda de un momento o de una persona.",
      "Nuestro equipo trabaja sobre la imagen digitalizada para corregir manchas, rasgaduras, decoloración y otros daños, cuidando de mantener la fidelidad al original. El objetivo no es inventar detalles, sino recuperar lo que el tiempo fue borrando.",
      "Al final, entregamos una versión restaurada que puede imprimirse, enmarcarse o conservarse digitalmente, lista para seguir contando su historia por muchos años más.",
    ],
  },
  {
    foto: "/images/servicios/sol-cartas.png",
    titulo: "Conservación de cartas",
    texto: "Protegemos cartas y documentos importantes.",
    historia: [
      "Una carta escrita a mano guarda algo que ninguna otra cosa reemplaza: la letra, el papel, las palabras elegidas en un momento particular. Con los años, ese papel se vuelve frágil y corre el riesgo de deteriorarse o perderse.",
      "Trabajamos en la limpieza, estabilización y protección física del documento, usando materiales y técnicas pensadas para conservación a largo plazo, sin alterar el contenido ni la escritura original.",
      "El resultado es una pieza que se puede volver a leer y a mostrar con cuidado, protegida de la humedad, la luz y el paso del tiempo.",
    ],
  },
  {
    foto: "/images/servicios/sol-muebles.png",
    titulo: "Restauración de muebles",
    texto: "Devolvemos vida y belleza a tus muebles familiares.",
    historia: [
      "Un mueble familiar suele acumular más que años de uso: acumula historia. La mesa donde se reunía la familia, la silla que perteneció a un abuelo, el armario que pasó de generación en generación merecen algo más que terminar descartados por el desgaste.",
      "Evaluamos el estado de la madera, la estructura y los acabados para definir qué tipo de intervención necesita cada pieza, ya sea una restauración completa o un mantenimiento puntual, siempre buscando conservar su esencia original.",
      "El objetivo es que el mueble vuelva a cumplir su función y a lucir bien, sin perder aquello que lo hace parte de la historia de una familia.",
    ],
  },
  {
    foto: "/images/servicios/sol-relojes.png",
    titulo: "Restauración de relojes",
    texto: "Recuperamos su funcionamiento y su historia.",
    historia: [
      "Un reloj heredado suele guardar más valor sentimental que material: fue el reloj de un padre, un abuelo o alguien especial, y con el tiempo puede dejar de funcionar o perder su apariencia original.",
      "Nuestro trabajo incluye la revisión del mecanismo, la limpieza de sus componentes y la restauración estética de la caja y el material, buscando que vuelva a funcionar y a verse como corresponde a su historia.",
      "Así, una pieza que parecía condenada al cajón puede volver a marcar el tiempo y a acompañar el día a día de quien la recibe.",
    ],
  },
];

const testimonios = [
  { nombre: "Mariana G.", foto: "/images/avatars/mariana-v3.png", texto: "Mi camisa favorita de mi papá ahora es un peluche que abraza a mi hijo cada noche. Gracias Reviive por hacerlo posible." },
  { nombre: "Andrés P.", foto: "/images/avatars/andres-v3.png", texto: "Restauraron las fotos de mi abuela y ahora mis hijos conocen su historia tal como ella quería que la recordáramos." },
  { nombre: "Lucía T.", foto: "/images/avatars/lucia-v3.png", texto: "El mueble de mi bisabuela volvió a brillar. No es solo un mueble, es parte de nuestra historia familiar." },
];

const preguntas = [
  {
    p: "¿Cómo sé qué servicio necesita mi objeto?",
    r: "Puedes hacer una evaluación gratuita: cuéntanos sobre tu objeto y nuestro equipo (o Alma) te recomendará si necesita restauración, preservación o transformación.",
  },
  {
    p: "¿Qué objetos recibe Reviive?",
    r: "Recibimos prácticamente cualquier objeto con significado: prendas, fotografías, cartas, muebles, joyas, relojes, textiles y más. Si tiene una historia detrás, lo evaluamos.",
  },
  {
    p: "¿Puedo transformar una prenda en otro objeto?",
    r: "Sí, es una de nuestras soluciones más pedidas: convertimos prendas en peluches, cojines u otras piezas que conservan la tela original.",
  },
  {
    p: "¿Qué pasa si mi pieza está muy deteriorada?",
    r: "Evaluamos su estado y te proponemos las alternativas posibles según el nivel de daño; en la mayoría de los casos siempre hay algo que se puede recuperar o transformar.",
  },
  {
    p: "¿Cómo calculan el precio de la intervención?",
    r: "El costo depende del tipo de objeto, su estado y la complejidad del proceso requerido; siempre recibirás una propuesta clara antes de iniciar cualquier trabajo.",
  },
  {
    p: "¿Dónde se realiza el trabajo?",
    r: "Todo el proceso se realiza en nuestro taller en Medellín, con especialistas dedicados a cada tipo de restauración.",
  },
  {
    p: "¿Cómo envío mi objeto a Reviive?",
    r: "Puedes enviarlo por transportadora o coordinar una recolección con nosotros; te acompañamos en cada paso para que tu objeto viaje seguro.",
  },
  {
    p: "¿Cómo hacen seguimiento al proceso?",
    r: "Podrás ver el avance de tu pieza desde tu cuenta en Reviive, donde te mantenemos informado en cada etapa del proceso, que suele tomar entre 2 y 8 semanas según la complejidad.",
  },
];

export default function ServiciosPage() {
  const [solucionAbierta, setSolucionAbierta] = useState<number | null>(null);

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
            <div key={s.titulo} className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex flex-col text-left">
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
            {soluciones.map((s, i) => (
              <div key={s.titulo} className="rounded-2xl border border-greige/50 bg-greige/20 overflow-hidden flex flex-col text-left">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={s.foto} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" unoptimized />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-base text-borgona">{s.titulo}</h3>
                  <p className="mt-1.5 text-xs text-carbon/60 flex-1">{s.texto}</p>
                  <button
                    type="button"
                    onClick={() => setSolucionAbierta(i)}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-borgona hover:text-borgona-dark transition-colors"
                  >
                    Conocer más →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal
        open={solucionAbierta !== null}
        onClose={() => setSolucionAbierta(null)}
        className="max-w-4xl"
      >
        {solucionAbierta !== null && (
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="relative h-48 md:h-auto">
              <Image
                src={soluciones[solucionAbierta].foto}
                alt={soluciones[solucionAbierta].titulo}
                fill
                sizes="(min-width: 768px) 280px, 100vw"
                className="object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                unoptimized
              />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="font-display text-xl text-borgona">
                {soluciones[solucionAbierta].titulo}
              </h3>
              <div className="mt-3 space-y-2.5">
                {soluciones[solucionAbierta].historia.map((parrafo, idx) => (
                  <p key={idx} className="text-sm text-carbon/70 leading-relaxed">
                    {parrafo}
                  </p>
                ))}
              </div>
              <Button href="/recuerdos/nuevo" variant="primary" className="mt-5">
                Solicitar evaluación →
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          Ellos confiaron en Reviive para conservar sus recuerdos
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {testimonios.map((t) => (
            <div key={t.nombre} className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex items-start gap-4 text-left">
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
          {preguntas.map((item) => (
            <details key={item.p} className="group border-b border-greige/60 py-3">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm text-carbon/80">
                {item.p}
                <IconPlus className="h-4 w-4 shrink-0 text-dorado-suave transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="mt-2 text-sm text-carbon/60">{item.r}</p>
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
