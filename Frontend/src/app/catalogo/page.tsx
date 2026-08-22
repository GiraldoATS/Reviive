"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import {
  IconMessage,
  IconSearch,
  IconFilter,
  IconGrid,
  IconArrowLeft,
  IconArrowRight,
  IconUpload,
} from "@/components/icons";

const categoriasChips = [
  { titulo: "Joyería y relojes", icono: "/images/servicios/cat-joyas.png" },
  { titulo: "Fotografías y cartas", icono: "/images/servicios/cat-fotos.png" },
  { titulo: "Textiles y telas", icono: "/images/servicios/cat-textiles.png" },
  { titulo: "Peluches y juguetes", icono: "/images/servicios/cat-peluches.png" },
  { titulo: "Objetos decorativos", icono: "/images/servicios/cat-objetos.png" },
  { titulo: "Muebles y maderas", icono: "/images/servicios/cat-muebles.png" },
  { titulo: "Prendas de vestir", icono: "/images/servicios/cat-prendas.png" },
];

const productos = [
  {
    id: "peluche-memoria",
    tag: "Peluches",
    nombre: "Peluches Memoria",
    descripcion: "Convierte tu peluche significativo en un recuerdo que puedas revivir a diario.",
    tiempo: "4 a 6 semanas",
    precio: "Desde $198.000",
    foto: "/images/servicios/sol-peluche.png",
  },
  {
    id: "cojin-memoria",
    tag: "Textiles",
    nombre: "Cojín Memoria",
    descripcion: "Creamos un cojín único, vestido con las prendas que más significaron para ti.",
    tiempo: "3 a 5 semanas",
    precio: "Desde $148.000",
    foto: "/images/servicios/sol-cojin.png",
  },
  {
    id: "album-memorias",
    tag: "Fotografías",
    nombre: "Álbum de Memorias",
    descripcion: "Organizamos y restauramos tus fotografías y cartas en un álbum que cuenta tu historia.",
    tiempo: "4 a 6 semanas",
    precio: "Desde $176.000",
    foto: "/images/servicios/before-after/fotos-after.png",
  },
  {
    id: "restauracion-fotografica",
    tag: "Fotografías",
    nombre: "Restauración fotográfica",
    descripcion: "Recuperamos e iluminamos fotografías para que vuelvan a cobrar vida.",
    tiempo: "2 a 4 semanas",
    precio: "Desde $126.000",
    foto: "/images/servicios/sol-fotografica.png",
  },
  {
    id: "caja-recuerdos",
    tag: "Decorativos",
    nombre: "Caja de Recuerdos",
    descripcion: "Un lugar seguro para conservar cartas y pequeños tesoros.",
    tiempo: "2 a 4 semanas",
    precio: "Desde $176.000",
    foto: "/images/servicios/cat-caja-recuerdos.png",
  },
  {
    id: "restauracion-relojes",
    tag: "Joyería y relojes",
    nombre: "Restauración de relojes",
    descripcion: "Devolvemos la funcionalidad y belleza de relojes que guardan tu historia.",
    tiempo: "2 a 4 semanas",
    precio: "Desde $258.000",
    foto: "/images/servicios/cat-relojes-taller.png",
  },
  {
    id: "restauracion-joyas",
    tag: "Joyería y relojes",
    nombre: "Restauración de joyas",
    descripcion: "Limpiamos, reparamos y devolvemos el brillo a tus joyas especiales.",
    tiempo: "2 a 4 semanas",
    precio: "Desde $148.000",
    foto: "/images/servicios/cat-joyas-compartido.png",
  },
  {
    id: "restauracion-muebles",
    tag: "Muebles",
    nombre: "Restauración de muebles",
    descripcion: "Devolvemos vida y calidez a tus muebles familiares.",
    tiempo: "2 a 6 semanas",
    precio: "Desde $298.000",
    foto: "/images/servicios/sol-muebles.png",
  },
  {
    id: "manta-memoria",
    tag: "Textiles",
    nombre: "Manta Memoria",
    descripcion: "Transformamos tus prendas en una manta que abriga historias.",
    tiempo: "4 a 6 semanas",
    precio: "Desde $228.000",
    foto: "/images/servicios/before-after/prenda-before.png",
  },
  {
    id: "marco-personalizado",
    tag: "Fotografías",
    nombre: "Marco personalizado",
    descripcion: "Creamos piezas únicas que combinan objetos, fotos y materiales con significado.",
    tiempo: "Según proyecto",
    precio: "Cotización previa",
    foto: "/images/servicios/cat-marco-historia.png",
  },
];

const tagToChip: Record<string, string> = {
  Peluches: "Peluches y juguetes",
  Textiles: "Textiles y telas",
  Fotografías: "Fotografías y cartas",
  Decorativos: "Objetos decorativos",
  "Joyería y relojes": "Joyería y relojes",
  Muebles: "Muebles y maderas",
};

const transformaciones = [
  { titulo: "Peluches memoria", icono: "/images/servicios/icon-card-peluches.png" },
  { titulo: "Cojín memoria", icono: "/images/servicios/icon-card-cojin.png" },
  { titulo: "Manta memoria", icono: "/images/servicios/icon-card-manta.png" },
  { titulo: "Cuadro tela", icono: "/images/servicios/icon-card-cuadro-tela.png" },
  { titulo: "Caja de recuerdos", icono: "/images/servicios/icon-card-caja.png" },
];

const preservaciones = [
  { titulo: "Conservación textil", icono: "/images/servicios/icon-card-textil.png" },
  { titulo: "Enmarcado profesional", icono: "/images/servicios/icon-card-marco.png" },
  { titulo: "Almacenamiento especializado", icono: "/images/servicios/icon-card-almacenamiento.png" },
];

const nuevasHistorias = [
  { titulo: "De peluche a cojín memoria", before: "/images/servicios/sol-peluche.png", after: "/images/servicios/sol-cojin.png" },
  { titulo: "De reloj a pieza restaurada", before: "/images/servicios/cat-relojes-taller.png", after: "/images/servicios/sol-relojes.png" },
  { titulo: "De foto antigua a recuerdo renovado", before: "/images/servicios/before-after/fotos-before.png", after: "/images/servicios/before-after/fotos-after.png" },
  { titulo: "De prenda a manta memoria", before: "/images/servicios/prenda-manta-before.png", after: "/images/servicios/prenda-manta-after.png" },
];

const explorando = [
  { nombre: "Peluches Memoria", foto: "/images/servicios/explorando-peluches.png" },
  { nombre: "Cojín Memoria", foto: "/images/servicios/explorando-cojin.png" },
  { nombre: "Manta Memoria", foto: "/images/servicios/explorando-manta.png" },
  { nombre: "Caja de Recuerdos", foto: "/images/servicios/explorando-caja.png" },
  { nombre: "Conservación Cartas", foto: "/images/servicios/explorando-cartas.png" },
  { nombre: "Restauración Muebles", foto: "/images/servicios/explorando-muebles.png" },
  { nombre: "Restauración Fotográfica", foto: "/images/servicios/explorando-fotografica.png" },
  { nombre: "Álbum de Memorias", foto: "/images/servicios/explorando-album.png" },
  { nombre: "Restauración Relojes", foto: "/images/servicios/explorando-relojes.png" },
  { nombre: "Restauración Joyas", foto: "/images/servicios/explorando-joyas.png" },
];

export default function CatalogoPage() {
  const [chipActivo, setChipActivo] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const chipsRef = useRef<HTMLDivElement>(null);
  const explorandoRef = useRef<HTMLDivElement>(null);
  const [chipScroll, setChipScroll] = useState({ left: false, right: false });
  const [explorandoScroll, setExplorandoScroll] = useState({ left: false, right: false });

  function updateScrollState(ref: React.RefObject<HTMLDivElement | null>, setState: (s: { left: boolean; right: boolean }) => void) {
    const el = ref.current;
    if (!el) return;
    setState({
      left: el.scrollLeft > 4,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    });
  }

  useEffect(() => {
    const onResize = () => {
      updateScrollState(chipsRef, setChipScroll);
      updateScrollState(explorandoRef, setExplorandoScroll);
    };
    onResize();
    const raf = requestAnimationFrame(onResize);
    document.fonts?.ready.then(onResize);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function scrollByAmount(ref: React.RefObject<HTMLDivElement | null>, amount: number) {
    ref.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  const arrowClass = (enabled: boolean, display = "flex") =>
    `${display} h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
      enabled
        ? "border-borgona/50 text-borgona bg-rosa/20 hover:bg-rosa/40"
        : "border-greige/60 text-carbon/30 cursor-default"
    }`;

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideChip = !chipActivo || tagToChip[p.tag] === chipActivo;
      const coincideBusqueda =
        !busqueda.trim() || p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
      return coincideChip && coincideBusqueda;
    });
  }, [chipActivo, busqueda]);

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 pt-4 text-xs text-carbon/50">
        <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-carbon/70">Categorías</span>
      </div>

      <section className="relative overflow-hidden grid lg:grid-cols-2 lg:items-center">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-30 sm:block md:w-52">
          <Image src="/images/servicios/categorias-rama.png" alt="" fill sizes="208px" className="object-contain object-top" unoptimized />
        </div>
        <div className="relative px-6 py-12 lg:py-16 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Cada objeto guarda una historia diferente.
          </h1>
          <p className="mt-5 text-carbon/75 max-w-md">
            Explora las posibilidades que Reviive puede crear a partir de aquello que quieres conservar.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#catalogo" variant="primary">
              Explorar catálogo →
            </Button>
            <Button href="/chat" variant="secondary" className="inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Preguntar a Alma
            </Button>
          </div>
        </div>
        <div className="relative h-64 w-full lg:h-auto lg:aspect-[1916/821]">
          <Image
            src="/images/servicios/categorias-hero.png"
            alt="Objetos y recuerdos restaurados por Reviive"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          ¿Qué tipo de recuerdo tienes?
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!chipScroll.left}
            onClick={() => scrollByAmount(chipsRef, -240)}
            className={arrowClass(chipScroll.left, "hidden sm:flex")}
          >
            <IconArrowLeft className="h-4 w-4" />
          </button>
          <div
            ref={chipsRef}
            onScroll={() => updateScrollState(chipsRef, setChipScroll)}
            className="no-scrollbar flex-1 flex items-center gap-3 overflow-x-auto scroll-smooth px-1"
          >
            <button
              type="button"
              onClick={() => setChipActivo(null)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm border transition-colors ${
                chipActivo === null
                  ? "bg-borgona text-marfil border-borgona"
                  : "bg-white/60 text-carbon/75 border-greige/60 hover:border-borgona/40"
              }`}
            >
              <IconGrid className="h-4 w-4" />
              Todos
            </button>
            {categoriasChips.map((c) => (
              <button
                key={c.titulo}
                type="button"
                onClick={() => setChipActivo(c.titulo)}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition-colors ${
                  chipActivo === c.titulo
                    ? "bg-borgona text-marfil border-borgona"
                    : "bg-white/60 text-carbon/75 border-greige/60 hover:border-borgona/40"
                }`}
              >
                <span className="relative h-5 w-5 shrink-0">
                  <Image src={c.icono} alt="" fill sizes="20px" className="object-contain" unoptimized />
                </span>
                {c.titulo}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={!chipScroll.right}
            onClick={() => scrollByAmount(chipsRef, 240)}
            className={arrowClass(chipScroll.right, "hidden sm:flex")}
          >
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-2xl text-borgona">Catálogo Reviive</h2>
            <p className="mt-1 text-sm text-carbon/60">
              Descubre lo que es posible, preserva y transforma tus recuerdos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar soluciones..."
                className="rounded-full border border-greige/60 bg-white/70 pl-9 pr-4 py-2.5 text-sm text-carbon/80 placeholder:text-carbon/40 focus:outline-none focus:border-borgona/50 w-52"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-greige/60 bg-white/70 px-4 py-2.5 text-sm text-carbon/75 hover:border-borgona/40 transition-colors"
            >
              <IconFilter className="h-4 w-4" />
              Filtros
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-greige/60 bg-white/70 px-4 py-2.5 text-sm text-carbon/75 hover:border-borgona/40 transition-colors"
            >
              <IconGrid className="h-4 w-4" />
              Ordenar
            </button>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {productosFiltrados.map((p) => (
            <div key={p.id} className="rounded-2xl border border-greige/60 bg-white/70 overflow-hidden flex flex-col text-left">
              <div className="relative h-32 w-full">
                <span className="absolute left-2 top-2 z-10 rounded-full bg-marfil/90 px-2 py-0.5 text-[10px] font-medium text-borgona">
                  {p.tag}
                </span>
                <Image src={p.foto} alt="" fill sizes="260px" className="object-cover" unoptimized />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display text-base text-borgona">{p.nombre}</h3>
                <p className="mt-1.5 text-xs text-carbon/60 flex-1">{p.descripcion}</p>
                <p className="mt-3 text-[11px] text-carbon/50">{p.tiempo}</p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <span className="text-xs font-medium text-dorado-suave">{p.precio}</span>
                  <Link
                    href="/recuerdos/nuevo"
                    className="inline-flex items-center gap-1 text-xs font-medium text-borgona hover:text-borgona-dark transition-colors"
                  >
                    Ver detalle →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="secondary">Ver más soluciones ↓</Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8">
          <h2 className="text-left font-display text-2xl text-borgona">¿Qué puedo hacer con mi objeto?</h2>
          <p className="mt-1 text-left text-sm text-carbon/60">
            Usa tu objeto como punto de partida y descubre todas las posibilidades.
          </p>
          <div className="mt-8 grid md:grid-cols-[220px_auto_1fr_auto_1fr] gap-8 items-start">
            <div className="rounded-xl border border-greige/60 bg-white/70 p-4 text-center">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-marfil">
                <Image src="/images/servicios/ejemplo-camisa.png" alt="" fill sizes="200px" className="object-contain" unoptimized />
              </div>
              <p className="mt-3 text-xs text-carbon/70">Ejemplo: Tela de una camisa</p>
              <button type="button" className="mt-2 text-xs font-medium text-borgona hover:text-borgona-dark transition-colors">
                Cambiar objeto
              </button>
            </div>

            <div className="hidden md:block w-px self-stretch bg-greige/60" />

            <div>
              <p className="text-center text-xs uppercase tracking-widest text-dorado-suave">Transfórmalo en</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {transformaciones.map((t) => (
                  <div key={t.titulo} className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden">
                    <Image src={t.icono} alt={t.titulo} fill sizes="80px" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block w-px self-stretch bg-greige/60" />

            <div>
              <p className="text-center text-xs uppercase tracking-widest text-dorado-suave">Presérvalo mediante</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {preservaciones.map((t) => (
                  <div key={t.titulo} className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden">
                    <Image src={t.icono} alt={t.titulo} fill sizes="80px" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          De recuerdo a nueva historia
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <p className="mt-2 text-sm text-carbon/60">
          Transformamos lo que te importa en algo que podrás volver a vivir.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nuevasHistorias.map((n) => (
            <div key={n.titulo} className="text-left">
              <div className="flex items-center gap-2 rounded-2xl border border-greige/60 bg-white/70 p-2">
                <div className="relative h-20 flex-1 rounded-lg overflow-hidden">
                  <Image src={n.before} alt="" fill sizes="140px" className="object-cover" unoptimized />
                </div>
                <IconArrowRight className="h-4 w-4 shrink-0 text-dorado-suave" />
                <div className="relative h-20 flex-1 rounded-lg overflow-hidden">
                  <Image src={n.after} alt="" fill sizes="140px" className="object-cover" unoptimized />
                </div>
              </div>
              <h3 className="mt-3 font-display text-sm text-borgona">{n.titulo}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8 flex flex-col justify-between gap-6">
          <div>
            <h3 className="font-display text-xl text-borgona">¿Tu idea no está en nuestro catálogo?</h3>
            <p className="mt-2 text-sm text-carbon/70">
              Cada recuerdo es único. Evaluamos tu idea y creamos una solución completamente personalizada para ti.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-28 shrink-0 rounded-lg overflow-hidden">
              <Image src="/images/servicios/personalizado-hilo.png" alt="" fill sizes="112px" className="object-cover" unoptimized />
            </div>
            <Button href="/recuerdos/nuevo" variant="primary">
              Solicitar creación personalizada →
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -bottom-8 hidden h-48 w-40 opacity-50 sm:block">
            <Image src="/images/servicios/card-rama-alma.png" alt="" fill sizes="160px" className="object-contain object-bottom" unoptimized />
          </div>
          <div className="relative flex items-center gap-5">
            <div className="relative h-36 w-32 shrink-0 rounded-2xl overflow-hidden ring-2 ring-white shadow-sm md:h-44 md:w-36">
              <Image src="/images/servicios/alma-recomendando.png" alt="Alma" fill sizes="144px" className="object-cover" unoptimized />
            </div>
            <div>
              <h3 className="font-display text-xl text-borgona">Habla con Alma</h3>
              <p className="mt-1 text-sm text-carbon/70">
                Cuéntame sobre tu objeto especial y te ayudaré a descubrir lo que podemos crear juntos.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/chat" variant="primary" className="inline-flex items-center gap-2 justify-center">
                  <IconMessage className="h-4 w-4" />
                  Hablar con Alma
                </Button>
                <Button href="/recuerdos/nuevo" variant="secondary" className="inline-flex items-center gap-2 justify-center">
                  <IconUpload className="h-4 w-4" />
                  Subir foto del objeto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 text-center">
        <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
          Lo que más están explorando
          <span className="relative h-5 w-8 shrink-0">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </h2>
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!explorandoScroll.left}
            onClick={() => scrollByAmount(explorandoRef, -340)}
            className={arrowClass(explorandoScroll.left)}
          >
            <IconArrowLeft className="h-4 w-4" />
          </button>
          <div
            ref={explorandoRef}
            onScroll={() => updateScrollState(explorandoRef, setExplorandoScroll)}
            className="no-scrollbar flex-1 flex items-stretch gap-4 overflow-x-auto scroll-smooth"
          >
            {explorando.map((e) => (
              <Link
                key={e.nombre}
                href="/recuerdos/nuevo"
                className="relative block w-80 shrink-0 aspect-[2172/724] rounded-2xl overflow-hidden group"
              >
                <Image
                  src={e.foto}
                  alt={e.nombre}
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  unoptimized
                />
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={!explorandoScroll.right}
            onClick={() => scrollByAmount(explorandoRef, 340)}
            className={arrowClass(explorandoScroll.right)}
          >
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="relative overflow-hidden bg-borgona py-8">
        <div className="pointer-events-none absolute left-4 bottom-0 h-24 w-24 opacity-50 md:left-8 md:h-32 md:w-32">
          <Image src="/images/servicios/cta-cat-rama-izquierda.png" alt="" fill sizes="128px" className="object-contain object-left-bottom" unoptimized />
        </div>
        <div className="pointer-events-none absolute right-4 bottom-0 h-24 w-24 opacity-50 md:right-8 md:h-32 md:w-32">
          <Image src="/images/servicios/cta-cat-rama-derecha.png" alt="" fill sizes="128px" className="object-contain object-right-bottom" unoptimized />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-display text-xl text-dorado-suave">Tu historia merece seguir viva.</p>
            <p className="mt-1 text-sm text-marfil/70">Comencemos a transformar tu recuerdo en algo inolvidable.</p>
          </div>
          <Button href="/recuerdos/nuevo" variant="secondary" className="!text-borgona !bg-marfil !border-marfil hover:!bg-marfil/90">
            Crear mi recuerdo →
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
