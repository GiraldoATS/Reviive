"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Modal from "@/components/Modal";
import { IconArrowLeft, IconArrowRight, IconChevronDown } from "@/components/icons";

const categorias = [
  "Joyas y Relojes",
  "Memorias en Papel",
  "Objetos Decorativos",
  "Cuero y Textiles",
  "Muebles y Maderas",
];

const iconoPorCategoria: Record<string, string> = {
  "Joyas y Relojes": "/images/servicios/cat-joyas.png",
  "Memorias en Papel": "/images/servicios/cat-fotos.png",
  "Objetos Decorativos": "/images/servicios/cat-objetos.png",
  "Cuero y Textiles": "/images/servicios/cat-textiles.png",
  "Muebles y Maderas": "/images/servicios/cat-muebles.png",
};

const historias = [
  {
    id: "reloj",
    categoria: "Joyas y Relojes",
    titulo: "El reloj de mi abuelo",
    texto: "Este reloj no solo marcaba el tiempo, marcaba nuestras reuniones familiares. Hoy vuelve a latir.",
    narrativa: [
      "Este reloj perteneció a mi abuelo desde que tengo memoria. Lo llevaba en cada reunión familiar, en cada Navidad, en cada domingo de sobremesa. Cuando él ya no estuvo, el reloj se quedó guardado en un cajón, parado, como si el tiempo también se hubiera detenido con él.",
      "Durante años no me atreví a hacer nada con él. Tenía miedo de que al intentar repararlo terminara perdiéndolo del todo. La maquinaria estaba oxidada, el cristal rayado, y una de las manecillas ni siquiera se movía.",
      "Cuando por fin lo llevé a Reviive, me explicaron cada paso antes de tocarlo: qué piezas se limpiarían, cuáles se conservarían tal cual y por qué. Eso me dio la confianza de dejarlo en sus manos.",
      "Hoy el reloj vuelve a marcar la hora, y cada vez que lo veo late otra vez, como si mi abuelo siguiera ahí, revisando la hora antes de cada reunión familiar.",
    ],
  },
  {
    id: "cartas",
    categoria: "Memorias en Papel",
    titulo: "Cartas que vuelven a hablar",
    texto: "Conservar las cartas de mamá era devolverme su voz. Cada página restaurada es un abrazo.",
    narrativa: [
      "Guardaba una caja con las cartas que mi mamá me escribió durante los años en que vivimos en ciudades distintas. Con el tiempo, la humedad y el papel amarillento empezaron a borrar su letra, y sentí que estaba perdiendo su voz otra vez.",
      "No quería enmarcarlas ni guardarlas más en una caja donde siguieran deteriorándose. Quería poder volver a leerlas sin miedo a que se deshicieran entre mis manos.",
      "En Reviive trabajaron cada hoja con muchísimo cuidado, limpiando el papel y estabilizando la tinta sin alterar ni una palabra de lo que ella escribió. Verlas de nuevo, legibles, fue como recibir una carta suya otra vez.",
      "Ahora las tengo protegidas en un lugar donde puedo abrirlas cuando la extraño. Cada página restaurada sigue siendo, para mí, un abrazo que llega justo a tiempo.",
    ],
  },
  {
    id: "taza",
    categoria: "Objetos Decorativos",
    titulo: "La taza de los domingos",
    texto: "Esa taza de porcelana sobrevivió a todo. La restauramos para que siga acompañando nuestros domingos.",
    narrativa: [
      "Esta taza de porcelana era la que mi familia usaba cada domingo, sin falta, desde que yo era niña. Tenía una grieta fina que crecía cada año y un desportillado en el borde que me hacía temer que un día se rompiera del todo.",
      "Pensé varias veces en reemplazarla por una nueva, pero no era lo mismo: esa taza había estado en la mesa en cada desayuno importante, en cada conversación de domingo.",
      "Cuando la llevé a restaurar, me sorprendió lo delicado del proceso: reforzaron la grieta desde adentro y recuperaron el brillo original sin que se notara ninguna intervención por fuera.",
      "Hoy sigue en la mesa cada domingo, exactamente donde siempre estuvo, acompañando las mismas conversaciones de siempre.",
    ],
  },
  {
    id: "bolso",
    categoria: "Cuero y Textiles",
    titulo: "Mi bolso, mi historia",
    texto: "Este bolso me acompañó en cada etapa importante. Lo restauramos y ahora estoy lista para seguir.",
    narrativa: [
      "Este bolso me lo regalaron en un momento importante de mi vida y desde entonces me acompañó a entrevistas de trabajo, viajes y celebraciones. Con los años el cuero se resecó, las costuras cedieron y uno de los broches dejó de cerrar.",
      "No quería un bolso nuevo que se pareciera al original. Quería este, con sus rayones y su historia, pero funcional otra vez.",
      "El equipo de Reviive restauró el cuero, reforzó las costuras y recuperó el color original sin quitarle el carácter que le habían dado los años de uso.",
      "Hoy vuelvo a usarlo con la misma confianza de siempre, sabiendo que está listo para acompañarme en la siguiente etapa que venga.",
    ],
  },
  {
    id: "silla",
    categoria: "Muebles y Maderas",
    titulo: "La silla de la abuela",
    texto: "Donde ella contaba historias, hoy mis hijos escuchan las suyas. La restauramos con amor.",
    narrativa: [
      "En esta silla mi abuela se sentaba cada tarde a contarnos historias mientras tejía. Cuando ella faltó, la silla quedó arrinconada, con la madera reseca y el tapizado completamente gastado.",
      "Durante mucho tiempo no supe qué hacer con ella. No quería deshacerme de un objeto tan cargado de recuerdos, pero tampoco podía usarla en el estado en que estaba.",
      "En Reviive restauraron la madera respetando su forma original y renovaron el tapizado con una tela que mantiene el mismo espíritu de la silla que yo recordaba.",
      "Ahora está de nuevo en la sala, y son mis hijos quienes se sientan ahí a escuchar las historias que yo les cuento, en el mismo lugar donde yo escuché las de mi abuela.",
    ],
  },
  {
    id: "bandeja",
    categoria: "Objetos Decorativos",
    titulo: "Brillo que vuelve",
    texto: "Esta bandeja estuvo opaca durante años. Hoy vuelve a brillar en nuestras celebraciones.",
    narrativa: [
      "Esta bandeja de plata era la que se usaba en cada celebración familiar importante, desde cumpleaños hasta reuniones de fin de año. Con el paso del tiempo se fue opacando hasta quedar casi gris, cubierta de manchas que ya no salían con nada.",
      "La guardé en una vitrina durante años, más como recuerdo que como objeto de uso, porque me daba pena sacarla en ese estado.",
      "Cuando la llevé a restaurar, recuperaron el brillo original de la plata sin desgastar el metal ni los detalles grabados en el borde, que ya casi no se distinguían.",
      "Hoy vuelve a brillar en nuestra mesa en cada celebración, tal como la recuerdo de cuando era niña.",
    ],
  },
  {
    id: "retrato",
    categoria: "Memorias en Papel",
    titulo: "Una foto, mil recuerdos",
    texto: "Estaba deteriorada por el tiempo, pero su valor era incalculable. Hoy vuelve a sonreír como ese día.",
    narrativa: [
      "Esta es una de las pocas fotos que tengo de ese día, y con los años se había deteriorado tanto que apenas se distinguían los rostros. Las esquinas estaban quebradas y una mancha de humedad cubría casi la mitad de la imagen.",
      "Sabía que si no hacía algo pronto, terminaría perdiendo la foto por completo. No existía un negativo ni ninguna otra copia.",
      "En Reviive restauraron la imagen con muchísimo respeto por los detalles originales, recuperando expresiones y texturas que yo pensaba que ya se habían perdido para siempre.",
      "Hoy la foto vuelve a sonreír como aquel día, y puedo compartirla con el resto de mi familia sin miedo a que desaparezca.",
    ],
  },
  {
    id: "bordado",
    categoria: "Cuero y Textiles",
    titulo: "Bordado de generaciones",
    texto: "Este bordado pasó por tres generaciones. Lo restauramos para que siga contando nuestra historia.",
    narrativa: [
      "Este bordado lo hizo mi bisabuela y pasó de generación en generación hasta llegar a mí. Los hilos se habían deshilachado en varias zonas y la tela base empezaba a rasgarse por el paso de los años.",
      "Me daba miedo que, si no hacía nada, la próxima generación ya no pudiera conocerlo más que en fotos.",
      "El equipo de Reviive reforzó la tela y recuperó los hilos originales donde fue posible, respetando cada puntada tal como se hizo hace décadas.",
      "Hoy sigue contando nuestra historia, y espero algún día poder heredarlo también, tal como llegó a mí.",
    ],
  },
];

const destacadaNarrativa = [
  "Este tocador acompañó a mi mamá durante más de treinta años. Cada mañana se sentaba frente a él para arreglarse, y cada noche lo usaba para quitarse el maquillaje mientras me contaba cómo le había ido el día. Para mí, ese mueble es tan parte de ella como su propia voz.",
  "Cuando ella murió, no pude deshacerme de él, pero tampoco podía verlo así: el espejo estaba opaco, casi ciego, y la madera se había resecado y agrietado con los años hasta perder por completo su brillo original.",
  "Lo tuve guardado durante mucho tiempo, cubierto con una sábana, porque me dolía verlo en ese estado. Pensé varias veces en dejarlo ir, pero algo dentro de mí sabía que aún podía recuperar su lugar.",
  "Cuando lo llevé a Reviive, me explicaron con mucho cuidado cada paso: cómo iban a tratar la madera, cómo iban a devolverle transparencia al espejo sin perder las marcas que el tiempo le había dejado, esas marcas que también son parte de su historia.",
  "Verlo terminado me hizo llorar. Hoy vuelve a estar en mi casa, brillando, tal como lo recuerdo, y cada vez que paso frente a él siento que una parte de mi mamá sigue ahí.",
];

const testimonios = [
  {
    nombre: "Mariana G.",
    foto: "/images/historias/cliente-mariana.png",
    texto: "Me devolvieron más que un objeto, me devolvieron recuerdos que creía perdidos.",
  },
  {
    nombre: "Andrés P.",
    foto: "/images/historias/cliente-andres.png",
    texto: "El cuidado y la dedicación se notan en cada detalle. Un servicio extraordinario.",
  },
  {
    nombre: "Lucía T.",
    foto: "/images/historias/cliente-lucia.png",
    texto: "Profesionales cálidos, atentos y apasionados por lo que hacen. Los recomiendo siempre.",
  },
];

export default function HistoriasPage() {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [orden, setOrden] = useState<"recientes" | "antiguas">("recientes");
  const [historiaAbierta, setHistoriaAbierta] = useState<string | null>(null);
  const [destacadaAbierta, setDestacadaAbierta] = useState(false);
  const filtrosRef = useRef<HTMLDivElement>(null);
  const [filtrosScroll, setFiltrosScroll] = useState({ left: false, right: false });

  function updateFiltrosScroll() {
    const el = filtrosRef.current;
    if (!el) return;
    setFiltrosScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    });
  }

  useEffect(() => {
    const el = filtrosRef.current;
    if (!el) return;
    updateFiltrosScroll();
    const raf = requestAnimationFrame(updateFiltrosScroll);
    document.fonts?.ready.then(updateFiltrosScroll);
    window.addEventListener("resize", updateFiltrosScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateFiltrosScroll);
    };
  }, []);

  function scrollFiltros(amount: number) {
    filtrosRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  const filtroArrowClass = (enabled: boolean) =>
    `flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
      enabled
        ? "border-borgona/50 text-borgona bg-rosa/20 hover:bg-rosa/40"
        : "border-greige/60 text-carbon/30 cursor-default"
    }`;

  const historiasFiltradas = useMemo(() => {
    const filtradas = categoriaActiva
      ? historias.filter((h) => h.categoria === categoriaActiva)
      : historias;
    return orden === "recientes" ? filtradas : [...filtradas].reverse();
  }, [categoriaActiva, orden]);

  const historiaModal = historias.find((h) => h.id === historiaAbierta) ?? null;

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 pt-4 text-xs text-carbon/50">
        <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-carbon/70">Historias</span>
      </div>

      <section className="relative overflow-hidden grid lg:grid-cols-2 lg:items-center">
        <div className="pointer-events-none absolute -left-4 top-0 hidden h-full w-36 opacity-25 sm:block md:w-44">
          <Image src="/images/historias/rama-hero.png" alt="" fill sizes="176px" className="object-contain object-top" unoptimized />
        </div>
        <div className="relative px-6 py-12 lg:py-16 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Historias que permanecen
          </h1>
          <p className="mt-5 text-carbon/75 max-w-md">
            Objetos que guardan recuerdos. Historias que merecen seguir vivas. Descubre cómo el cuidado y la restauración pueden devolverles su lugar en la vida y en el corazón.
          </p>
          <span className="relative mt-3 h-5 w-10 block">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="40px" className="object-contain" />
          </span>
        </div>
        <div className="relative h-64 w-full lg:h-auto lg:aspect-[1348/850]">
          <Image
            src="/images/historias/hero.png"
            alt="Objetos con historia restaurados por Reviive"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!filtrosScroll.left}
            onClick={() => scrollFiltros(-240)}
            className={filtroArrowClass(filtrosScroll.left)}
          >
            <IconArrowLeft className="h-4 w-4" />
          </button>
          <div
            ref={filtrosRef}
            onScroll={updateFiltrosScroll}
            className="no-scrollbar flex-1 flex items-center gap-3 overflow-x-auto scroll-smooth"
          >
            <button
              type="button"
              onClick={() => setCategoriaActiva(null)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm border transition-colors ${
                categoriaActiva === null
                  ? "bg-borgona text-marfil border-borgona"
                  : "bg-greige/20 text-carbon/75 border-greige/50 hover:border-borgona/40"
              }`}
            >
              Todas las historias
            </button>
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoriaActiva(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm border transition-colors ${
                  categoriaActiva === c
                    ? "bg-borgona text-marfil border-borgona"
                    : "bg-greige/20 text-carbon/75 border-greige/50 hover:border-borgona/40"
                }`}
              >
                {c}
              </button>
            ))}
            <div className="relative shrink-0">
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as "recientes" | "antiguas")}
                className="appearance-none rounded-full border border-greige/60 bg-white/70 pl-4 pr-9 py-2.5 text-sm text-carbon/75 focus:outline-none focus:border-borgona/50"
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguas">Más antiguas</option>
              </select>
              <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40" />
            </div>
          </div>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={!filtrosScroll.right}
            onClick={() => scrollFiltros(240)}
            className={filtroArrowClass(filtrosScroll.right)}
          >
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {historiasFiltradas.map((h) => (
            <div key={h.id} className="rounded-2xl border border-greige/50 bg-greige/20 overflow-hidden flex flex-col text-left">
              <BeforeAfterSlider
                before={`/images/historias/${h.id}-antes.png`}
                after={`/images/historias/${h.id}-despues.png`}
                alt={h.titulo}
                className="aspect-[4/3] w-full"
              />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="relative h-4 w-4 shrink-0">
                    <Image src={iconoPorCategoria[h.categoria]} alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-dorado-suave">{h.categoria}</span>
                </div>
                <h3 className="mt-2 font-display text-base text-borgona">{h.titulo}</h3>
                <p className="mt-1.5 text-xs text-carbon/60 flex-1">{h.texto}</p>
                <button
                  type="button"
                  onClick={() => setHistoriaAbierta(h.id)}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-borgona hover:text-borgona-dark transition-colors"
                >
                  Leer historia →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-greige/20 border border-greige/50 p-8 grid md:grid-cols-[1fr_320px] gap-8 items-center">
          <div className="pointer-events-none absolute -left-10 -top-16 hidden h-64 w-48 opacity-20 sm:block">
            <Image src="/images/historias/rama-secundaria.png" alt="" fill sizes="192px" className="object-contain" unoptimized />
          </div>
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-dorado-suave">
              Historia destacada
              <span className="relative h-4 w-8 shrink-0">
                <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
              </span>
            </p>
            <h2 className="mt-2 font-display text-2xl text-borgona">El tocador de mi mamá</h2>
            <p className="mt-3 text-sm text-carbon/70 max-w-md">
              Mi mamá lo usaba todos los días. El espejo estaba opaco, la madera dañada por el tiempo. Pensé en dejarlo, pero algo me dijo que aún podía brillar. Reviive lo restauró con un cuidado que emocionó mi alma.
            </p>
            <p className="mt-4 font-display text-lg text-borgona italic max-w-md">
              &ldquo;No es solo un mueble, es el espejo donde crecí.&rdquo;
            </p>
            <p className="mt-1 text-xs text-carbon/50">— Valeria G.</p>
            <Button onClick={() => setDestacadaAbierta(true)} variant="primary" className="mt-5">
              Leer historia completa
            </Button>
          </div>
          <div className="relative flex flex-col gap-3 w-full">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image src="/images/historias/destacada-tocador-completo.png" alt="El tocador de mi mamá" fill sizes="320px" className="object-cover" unoptimized />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/images/historias/destacada-detalle-1.png" alt="" fill sizes="210px" className="object-cover" unoptimized />
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/images/historias/destacada-detalle-2.png" alt="" fill sizes="210px" className="object-cover" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-rosa/25 py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-display text-2xl md:text-3xl text-borgona-dark leading-snug">
            Cada objeto restaurado es una historia que vuelve a tener voz.
          </p>
          <div className="relative mx-auto mt-4 h-6 w-40">
            <Image src="/images/historias/divisor-cita.png" alt="" fill sizes="160px" className="object-contain" unoptimized />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-6 mt-10 grid sm:grid-cols-3 gap-6">
          {testimonios.map((t) => (
            <div key={t.nombre} className="flex items-start gap-4 text-left">
              <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0 ring-2 ring-white">
                <Image src={t.foto} alt={t.nombre} fill sizes="56px" className="object-cover" unoptimized />
              </div>
              <div>
                <p className="text-sm text-carbon/75 italic">&ldquo;{t.texto}&rdquo;</p>
                <p className="mt-1.5 text-xs font-medium text-borgona">{t.nombre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal open={historiaModal !== null} onClose={() => setHistoriaAbierta(null)} className="max-w-4xl">
        {historiaModal && (
          <div className="grid md:grid-cols-[300px_1fr]">
            <div className="p-4 md:p-4">
              <BeforeAfterSlider
                before={`/images/historias/${historiaModal.id}-antes.png`}
                after={`/images/historias/${historiaModal.id}-despues.png`}
                alt={`${historiaModal.titulo} — historia completa`}
                className="aspect-[3/4] w-full rounded-xl"
              />
            </div>
            <div className="p-6 pt-2 md:p-8 md:pl-0">
              <div className="flex items-center gap-2">
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={iconoPorCategoria[historiaModal.categoria]} alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <span className="text-[11px] uppercase tracking-wide text-dorado-suave">{historiaModal.categoria}</span>
              </div>
              <h3 className="mt-2 font-display text-2xl text-borgona">{historiaModal.titulo}</h3>
              <div className="mt-3 space-y-2 text-sm text-carbon/75 leading-relaxed">
                {historiaModal.narrativa.map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
              <Button href="/recuerdos/nuevo" variant="primary" className="mt-5">
                Solicitar una historia como esta →
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={destacadaAbierta} onClose={() => setDestacadaAbierta(false)} className="max-w-5xl">
        <div className="grid md:grid-cols-[280px_1fr]">
          <div className="p-4 space-y-3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/historias/destacada-tocador-completo.png"
                alt="El tocador de mi mamá"
                fill
                sizes="280px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/historias/destacada-detalle-1.png" alt="" fill sizes="140px" className="object-cover" unoptimized />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/historias/destacada-detalle-2.png" alt="" fill sizes="140px" className="object-cover" unoptimized />
              </div>
            </div>
          </div>
          <div className="p-6 pt-2 md:p-8 md:pl-0">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-dorado-suave">
              Historia destacada
            </p>
            <h3 className="mt-1.5 font-display text-2xl text-borgona">El tocador de mi mamá</h3>
            <div className="mt-3 space-y-2 text-sm text-carbon/75 leading-relaxed">
              {destacadaNarrativa.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>
            <p className="mt-3 font-display text-lg text-borgona italic">
              &ldquo;No es solo un mueble, es el espejo donde crecí.&rdquo;
            </p>
            <p className="mt-1 text-xs text-carbon/50">— Valeria G.</p>
            <Button href="/recuerdos/nuevo" variant="primary" className="mt-4">
              Solicitar evaluación →
            </Button>
          </div>
        </div>
      </Modal>
    </SiteShell>
  );
}
