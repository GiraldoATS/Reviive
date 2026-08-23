"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClienteShell from "@/components/ClienteShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import {
  IconMessage,
  IconEnviar,
  IconUpload,
  IconPlus,
  IconMapPin,
  IconGrid,
  IconCamara,
  IconCalendario,
  IconInfo,
} from "@/components/icons";

const pasos = [
  { icono: "paso1-comparte", titulo: "Comparte tu historia", texto: "Cuéntanos todo sobre tu objeto y su significado." },
  { icono: "paso2-fotos", titulo: "Sube tus fotos", texto: "Adjunta imágenes claras desde diferentes ángulos." },
  { icono: "paso3-recibe", titulo: "Recibe nuestra recomendación", texto: "Analizamos y te sugerimos la mejor opción para tu recuerdo." },
  { icono: "paso4-comienza", titulo: "Comienza el proceso", texto: "Te acompañamos en cada paso para devolverle su valor." },
];

const categorias = [
  { id: "joyas", icono: "cat-joyas", titulo: "Joyas y relojes" },
  { id: "fotos", icono: "cat-fotos", titulo: "Fotografías y cartas" },
  { id: "textiles", icono: "cat-textiles", titulo: "Textiles y telas" },
  { id: "peluches", icono: "cat-peluches", titulo: "Peluches y juguetes" },
  { id: "objetos", icono: "cat-objetos", titulo: "Objetos decorativos" },
  { id: "muebles", icono: "cat-muebles", titulo: "Muebles y maderas" },
  { id: "prendas", icono: "cat-prendas", titulo: "Prendas de vestir" },
  { id: "otro", icono: "cat-otro", titulo: "Otro" },
];

const deseos = [
  { id: "restaurar", icono: "deseo-restaurar", titulo: "Restaurar", texto: "Devolver su estado original." },
  { id: "preservar", icono: "deseo-preservar", titulo: "Preservar", texto: "Conservar y proteger su esencia." },
  { id: "transformar", icono: "deseo-transformar", titulo: "Transformar", texto: "Dar una nueva vida y propósito." },
  { id: "noseguro", icono: "deseo-noseguro", titulo: "No estoy seguro", texto: "Necesito orientación para decidir." },
];

const recibiras = [
  { icono: "recibe-diagnostico", titulo: "Diagnóstico inicial", texto: "Evaluamos el estado y valor de tu objeto." },
  { icono: "recibe-recomendacion", titulo: "Recomendación personalizada", texto: "Te sugerimos la mejor opción según tus objetivos." },
  { icono: "recibe-rango", titulo: "Rango estimado de intervención", texto: "Incluye tiempos, procesos y costos orientativos." },
  { icono: "recibe-pasos", titulo: "Siguientes pasos claros", texto: "Te guiamos para continuar con confianza." },
];

const preguntas = [
  "¿La evaluación tiene costo?",
  "¿Necesito enviar el objeto de inmediato?",
  "¿Puedo solicitar evaluación para más de un objeto?",
  "¿Qué tan rápido recibiré respuesta?",
];

function BranchTag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {children}
      <span className="relative h-5 w-9 shrink-0">
        <Image src="/images/solicitar-evaluacion/rama-pequena.png" alt="" fill sizes="36px" className="object-contain" unoptimized />
      </span>
    </span>
  );
}

type Foto = { id: string; url: string; nombre: string };

export default function SolicitarEvaluacionPage() {
  const router = useRouter();
  const { accessToken, cargando } = useAuth();
  const [categoria, setCategoria] = useState<string | null>(null);
  const [deseo, setDeseo] = useState<string | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([
    { id: "ejemplo-reloj", url: "/images/solicitar-evaluacion/muestra-reloj.png", nombre: "reloj.jpg" },
    { id: "ejemplo-tela", url: "/images/solicitar-evaluacion/muestra-tela.png", nombre: "tela.jpg" },
    { id: "ejemplo-carta", url: "/images/solicitar-evaluacion/muestra-carta.png", nombre: "carta.jpg" },
  ]);
  const [aceptaPolitica, setAceptaPolitica] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoriaTitulo = useMemo(
    () => categorias.find((c) => c.id === categoria)?.titulo,
    [categoria]
  );
  const deseoTitulo = useMemo(() => deseos.find((d) => d.id === deseo)?.titulo, [deseo]);

  function agregarFotos(lista: FileList | null) {
    if (!lista) return;
    const nuevas = Array.from(lista).map((archivo) => ({
      id: `${archivo.name}-${archivo.lastModified}-${archivo.size}`,
      url: URL.createObjectURL(archivo),
      nombre: archivo.name,
    }));
    setFotos((prev) => [...prev, ...nuevas]);
  }

  function quitarFoto(id: string) {
    setFotos((prev) => prev.filter((f) => f.id !== id));
  }

  useEffect(() => {
    if (!cargando && !accessToken) {
      router.push("/auth/login");
    }
  }, [cargando, accessToken, router]);

  if (cargando || !accessToken) {
    return <div className="min-h-screen bg-marfil" />;
  }

  return (
    <ClienteShell activeHref="/recuerdos/nuevo">
      <div className="mx-auto max-w-6xl px-6 pt-4 text-xs text-carbon/50">
        <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-carbon/70">Solicitar evaluación</span>
      </div>

      <section className="relative overflow-hidden grid lg:grid-cols-2 lg:items-center">
        <div className="pointer-events-none absolute -left-4 top-0 hidden h-full w-36 opacity-40 sm:block md:w-44">
          <Image src="/images/solicitar-evaluacion/rama-hero.png" alt="" fill sizes="176px" className="object-contain object-top" unoptimized />
        </div>
        <div className="relative px-6 py-12 lg:py-16 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Solicita una evaluación
          </h1>
          <p className="mt-3 font-display text-lg text-borgona-dark max-w-md">
            Tu recuerdo merece una segunda oportunidad.
          </p>
          <p className="mt-4 text-sm text-carbon/70 max-w-md">
            Cuéntanos la historia de tu objeto, comparte algunas fotografías y te guiaremos sobre la mejor forma de restaurarlo, preservarlo o transformarlo.
          </p>
          <span className="relative mt-3 h-5 w-9 block">
            <Image src="/images/solicitar-evaluacion/rama-pequena.png" alt="" fill sizes="36px" className="object-contain" unoptimized />
          </span>
          <div className="mt-6">
            <Button href="/chat" variant="secondary" className="inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Hablar con Alma
            </Button>
          </div>
        </div>
        <div className="relative h-64 w-full lg:h-auto lg:aspect-[1672/941]">
          <Image
            src="/images/solicitar-evaluacion/hero.png"
            alt="Solicita la evaluación de tu recuerdo"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {pasos.map((p, i) => (
            <div key={p.titulo} className="text-center">
              <div className="relative h-14 w-14 mx-auto rounded-full overflow-hidden">
                <Image src={`/images/solicitar-evaluacion/${p.icono}.png`} alt="" fill sizes="56px" className="object-cover" unoptimized />
              </div>
              <p className="mt-2 font-display text-sm text-borgona">{i + 1}. {p.titulo}</p>
              <p className="mt-1 text-xs text-carbon/60">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div>
          <h2 className="font-display text-xl text-borgona">
            <BranchTag>Cuéntanos sobre tu recuerdo</BranchTag>
          </h2>
          <form className="mt-5 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src="/images/solicitar-evaluacion/icon-persona.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <input className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="Nombre completo" />
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src="/images/solicitar-evaluacion/icon-correo.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <input type="email" className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="Correo electrónico" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src="/images/solicitar-evaluacion/icon-telefono.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <input className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="Teléfono" />
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src="/images/solicitar-evaluacion/icon-ubicacion.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <input className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="Ciudad / País" />
              </div>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                <Image src="/images/solicitar-evaluacion/icon-pregunta.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
              </span>
              <input className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="¿Qué objeto quieres evaluar?" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-borgona mb-2">Categoría</p>
              <div className="flex flex-wrap gap-3">
                {categorias.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoria(c.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm border transition-colors ${
                      categoria === c.id
                        ? "bg-borgona text-marfil border-borgona"
                        : "bg-greige/20 text-carbon/75 border-greige/50 hover:border-borgona/40"
                    }`}
                  >
                    <span className="relative h-5 w-5 shrink-0">
                      <Image src={`/images/solicitar-evaluacion/${c.icono}.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
                    </span>
                    {c.titulo}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-borgona mb-2">¿Qué deseas hacer?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {deseos.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDeseo(d.id)}
                    className={`rounded-xl border p-3 text-center transition-colors ${
                      deseo === d.id
                        ? "border-borgona bg-rosa/25"
                        : "border-greige/50 bg-greige/20 hover:border-borgona/40"
                    }`}
                  >
                    <span className="relative h-14 w-14 mx-auto block">
                      <Image src={`/images/solicitar-evaluacion/${d.icono}.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
                    </span>
                    <span className="mt-1.5 block text-xs font-medium text-borgona">{d.titulo}</span>
                    <span className="mt-0.5 block text-[11px] text-carbon/55">{d.texto}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="block text-xs uppercase tracking-wide text-borgona mb-1.5">¿Qué representa este objeto para ti?</span>
              <textarea
                rows={4}
                placeholder="Cuéntanos la historia, los recuerdos y el significado detrás de este objeto..."
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50 resize-none"
              />
            </label>

            <label className="block">
              <span className="block text-xs uppercase tracking-wide text-borgona mb-1.5">Estado actual del objeto</span>
              <textarea
                rows={3}
                placeholder="Describenos su estado actual, daños visibles u observaciones importantes..."
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50 resize-none"
              />
            </label>

            <div>
              <span className="block text-xs uppercase tracking-wide text-borgona mb-1.5">Adjuntar fotografías del objeto</span>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  agregarFotos(e.dataTransfer.files);
                }}
                className="rounded-xl border-2 border-dashed border-greige/70 bg-greige/20 p-4 flex flex-wrap items-center gap-3 cursor-pointer hover:border-borgona/40 transition-colors"
              >
                <div className="flex flex-col items-center justify-center text-center px-4 py-3 shrink-0">
                  <IconUpload className="h-5 w-5 text-borgona" />
                  <p className="mt-1 text-xs text-carbon/60">
                    Arrastra y suelta tus fotos aquí<br />o haz clic para seleccionar
                  </p>
                  <p className="mt-0.5 text-[11px] text-carbon/40">Formatos: JPG, PNG · Máx. 10MB cada una</p>
                </div>
                {fotos.map((f) => (
                  <div key={f.id} className="relative h-24 w-24 rounded-lg overflow-hidden shrink-0">
                    <Image src={f.url} alt={f.nombre} fill sizes="96px" className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        quitarFoto(f.id);
                      }}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-carbon/70 text-marfil text-xs"
                      aria-label="Quitar foto"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => agregarFotos(e.target.files)}
              />
            </div>

            <label className="block">
              <span className="block text-xs uppercase tracking-wide text-borgona mb-1.5">
                ¿Hay una fecha importante o necesidad especial? <span className="text-carbon/40">(opcional)</span>
              </span>
              <input
                placeholder="Ej: Una fecha límite, evento especial, etc."
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
              />
            </label>

            <label className="flex items-center gap-2.5 text-xs text-carbon/60">
              <input
                type="checkbox"
                checked={aceptaPolitica}
                onChange={(e) => setAceptaPolitica(e.target.checked)}
                className="h-4 w-4 rounded border-greige/60 accent-borgona"
              />
              He leído y acepto la{" "}
              <Link href="/politica-privacidad" className="text-borgona hover:text-borgona-dark underline">
                Política de privacidad.
              </Link>
            </label>

            <Button type="submit" variant="primary" className="w-full justify-center inline-flex items-center gap-2">
              Enviar para evaluación
              <IconEnviar className="h-4 w-4" />
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-carbon/50">
              <IconInfo className="h-3.5 w-3.5 shrink-0" />
              Tiempo estimado de respuesta: 24 a 48 horas hábiles.
            </p>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
            <h3 className="font-display text-lg text-borgona">
              <BranchTag>¿Qué recibirás?</BranchTag>
            </h3>
            <ul className="mt-4 space-y-4">
              {recibiras.map((r) => (
                <li key={r.titulo} className="flex items-start gap-3">
                  <span className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden">
                    <Image src={`/images/solicitar-evaluacion/${r.icono}.png`} alt="" fill sizes="40px" className="object-cover" unoptimized />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-borgona">{r.titulo}</p>
                    <p className="text-xs text-carbon/60">{r.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
            <h3 className="font-display text-lg text-borgona">Alma te acompaña</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden ring-2 ring-white">
                <Image src="/images/solicitar-evaluacion/alma-acompana.png" alt="Alma" fill sizes="56px" className="object-cover" unoptimized />
              </div>
              <p className="text-xs text-carbon/70">
                Estoy aquí para escucharte y ayudarte a encontrar la mejor solución para tu recuerdo. Escríbeme cuando quieras.
              </p>
            </div>
            <Button href="/chat" variant="primary" className="mt-4 w-full justify-center inline-flex items-center gap-2">
              Hablar con Alma
              <IconMessage className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
            <h3 className="font-display text-base text-borgona">Resumen de tu solicitud</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-borgona font-medium"><IconGrid className="h-5 w-5 shrink-0 text-borgona" /> Categoría</span>
                <span className="text-carbon/45">{categoriaTitulo ?? "—"}</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-borgona font-medium"><IconMessage className="h-5 w-5 shrink-0 text-borgona" /> ¿Qué deseas hacer?</span>
                <span className="text-carbon/45">{deseoTitulo ?? "—"}</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-borgona font-medium"><IconCamara className="h-5 w-5 shrink-0 text-borgona" /> Fotos adjuntas</span>
                <span className="text-carbon/45">{fotos.length || "—"}</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-borgona font-medium"><IconCalendario className="h-5 w-5 shrink-0 text-borgona" /> Fecha enviada</span>
                <span className="text-carbon/45">—</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex items-start gap-3">
            <IconMapPin className="h-5 w-5 shrink-0 text-borgona mt-0.5" />
            <div>
              <p className="text-sm font-medium text-borgona">Atención desde Medellín, Antioquia, Colombia</p>
              <p className="mt-1 text-xs text-carbon/60">Te acompañamos con dedicación y cercanía, estés donde estés.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-center font-display text-2xl text-borgona">
          <BranchTag>Preguntas frecuentes</BranchTag>
        </h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-x-8">
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

      <section className="relative overflow-hidden bg-borgona py-9">
        <div className="pointer-events-none absolute bottom-0 left-4 h-24 w-24 opacity-40 md:left-8 md:h-32 md:w-32">
          <Image src="/images/solicitar-evaluacion/cta-rama-1.png" alt="" fill sizes="128px" className="object-contain object-left-bottom" unoptimized />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-4 h-24 w-24 opacity-40 md:right-8 md:h-32 md:w-32">
          <Image src="/images/solicitar-evaluacion/cta-rama-2.png" alt="" fill sizes="128px" className="object-contain object-right-bottom" unoptimized />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-display text-lg text-marfil">Cada recuerdo merece ser escuchado.</p>
            <p className="mt-1.5 text-sm text-marfil/70">Permítenos ayudarte a descubrir el mejor camino para conservar su historia.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Button href="#" variant="secondary" className="!text-borgona !bg-marfil !border-marfil hover:!bg-marfil/90 inline-flex items-center gap-2">
              Enviar evaluación
              <IconEnviar className="h-4 w-4" />
            </Button>
            <Button href="/chat" variant="ghost" className="!text-marfil inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Hablar con Alma
            </Button>
          </div>
        </div>
      </section>
    </ClienteShell>
  );
}
