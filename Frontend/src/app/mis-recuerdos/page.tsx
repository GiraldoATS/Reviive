"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconSearch, IconClockAlert, IconCheckCircle, IconChevronDown, IconBox, IconRelojArena } from "@/components/icons";

const ICONS = "/images/mis-recuerdos";

const beneficios = [
  { icono: "icon-shield-plus.png", titulo: "Cuidado y confianza", texto: "Tus recuerdos están protegidos con los más altos estándares de seguridad." },
  { icono: "icon-heart.png", titulo: "Historias que conectan", texto: "Cada objeto tiene una historia. Estamos aquí para ayudarte a contarla y preservarla." },
  { icono: "icon-hourglass.png", titulo: "Acompañamiento experto", texto: "Te guiamos en cada etapa: evaluación, restauración y preservación." },
  { icono: "icon-people.png", titulo: "Comunidad Reviive", texto: "Forma parte de una comunidad que valora el arte, la memoria y la autenticidad." },
];

const filtros = [
  { id: "todos", label: "Todos", icono: IconBox },
  { id: "evaluacion", label: "En evaluación", icono: IconSearch },
  { id: "proceso", label: "En proceso", icono: IconRelojArena },
  { id: "finalizado", label: "Finalizados", icono: IconCheckCircle },
] as const;

interface ArchivoAPI {
  id: string;
  url: string;
}
interface ObjetoMemoriaAPI {
  id: string;
  tipo: string;
  estado?: string;
  archivos: ArchivoAPI[];
}
interface RecuerdoAPI {
  id: string;
  persona_recordada: string;
  objetos: ObjetoMemoriaAPI[];
  creado_en: string;
  actualizado_en: string;
}

function primerObjeto(r: RecuerdoAPI): ObjetoMemoriaAPI | null {
  return r.objetos?.[0] ?? null;
}

function primeraFoto(r: RecuerdoAPI): string | null {
  for (const objeto of r.objetos ?? []) {
    const archivo = objeto.archivos?.[0];
    if (archivo?.url) return archivo.url;
  }
  return null;
}

function categoriaDe(r: RecuerdoAPI): "evaluacion" | "proceso" | "finalizado" | "otro" {
  const estado = (primerObjeto(r)?.estado ?? "").toLowerCase();
  if (estado.includes("final") || estado.includes("complet") || estado.includes("entreg")) return "finalizado";
  if (estado.includes("proceso") || estado.includes("restaura")) return "proceso";
  if (estado.includes("eval")) return "evaluacion";
  return "otro";
}

const BADGE: Record<string, { label: string; icono: typeof IconSearch; clase: string }> = {
  evaluacion: { label: "En evaluación", icono: IconSearch, clase: "bg-blue-50 text-blue-700" },
  proceso: { label: "En restauración", icono: IconClockAlert, clase: "bg-dorado-suave/15 text-borgona-dark" },
  finalizado: { label: "Finalizado", icono: IconCheckCircle, clase: "bg-purple-50 text-purple-700" },
  otro: { label: "Registrado", icono: IconCheckCircle, clase: "bg-greige/40 text-carbon/70" },
};

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function ContenidoMisRecuerdos() {
  const { accessToken } = useAuth();
  const [recuerdos, setRecuerdos] = useState<RecuerdoAPI[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");

  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API_URL}/memories/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRecuerdos(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => setRecuerdos([]))
      .finally(() => setCargandoDatos(false));
  }, [accessToken]);

  if (cargandoDatos) {
    return <div className="min-h-[60vh]" />;
  }

  const tieneRecuerdos = recuerdos.length > 0;
  const visibles = filtro === "todos" ? recuerdos : recuerdos.filter((r) => categoriaDe(r) === filtro);

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>

        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-carbon">Mis recuerdos</h1>
            <p className="mt-1 font-display text-lg text-dorado-suave max-w-sm">
              Aquí viven los objetos, historias y procesos que has confiado a Reviive.
            </p>
            <Button href="/recuerdos/nuevo" variant="primary" className="mt-6 inline-flex items-center gap-2">
              + Registrar un nuevo recuerdo
            </Button>
          </div>
          <div className="relative hidden lg:block min-h-[280px]">
            <Image src={`${ICONS}/hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filtros.map((f) => {
              const Icono = f.icono;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFiltro(f.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                    filtro === f.id ? "bg-borgona text-marfil" : "bg-white/70 text-carbon/70 hover:bg-white"
                  }`}
                >
                  <Icono className="h-3.5 w-3.5" />
                  {f.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-greige/60 bg-white/70 px-4 py-2 text-sm text-carbon/70"
          >
            Más recientes
            <IconChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {tieneRecuerdos ? (
        <section className="mx-auto max-w-6xl w-full px-6 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibles.map((r) => {
              const objeto = primerObjeto(r);
              const foto = primeraFoto(r);
              const badge = BADGE[categoriaDe(r)];
              const Icono = badge.icono;
              return (
                <div key={r.id} className="rounded-2xl border border-greige/50 bg-greige/20 overflow-hidden">
                  <div className="relative aspect-[4/3] bg-greige/30">
                    {foto ? (
                      <Image src={foto} alt="" fill sizes="280px" className="object-cover" unoptimized />
                    ) : (
                      <span className="relative h-full w-full block p-10 opacity-40">
                        <Image src={`${ICONS}/icon-caja-sparkle.png`} alt="" fill sizes="120px" className="object-contain" unoptimized />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-carbon">{r.persona_recordada || "Recuerdo"}</h3>
                    {objeto?.tipo && <p className="text-xs text-carbon/55">{objeto.tipo}</p>}
                    <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${badge.clase}`}>
                      <Icono className="h-3.5 w-3.5" />
                      {badge.label}
                    </span>
                    <div className="mt-3 border-t border-greige/50 pt-3 text-xs text-carbon/55 space-y-0.5">
                      <p>Registrado: {fechaCorta(r.creado_en)}</p>
                      {r.actualizado_en && <p>Actualizado: {fechaCorta(r.actualizado_en)}</p>}
                    </div>
                    <Link
                      href={`/mis-recuerdos/${r.id}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-borgona hover:text-borgona-dark transition-colors"
                    >
                      Ver recuerdo →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl w-full px-6 py-10">
          <div className="relative overflow-hidden rounded-2xl border border-greige/50 bg-greige/20 p-10 text-center">
            <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 hidden h-64 w-56 opacity-30 md:block">
              <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
            </div>
            <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 hidden h-64 w-56 opacity-30 md:block -scale-x-100">
              <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
            </div>

            <span className="relative h-28 w-28 mx-auto block rounded-full bg-rosa/40">
              <Image src={`${ICONS}/icon-caja-sparkle.png`} alt="" fill sizes="112px" className="object-contain p-6" unoptimized />
            </span>
            <h2 className="mt-5 font-display text-2xl text-carbon">Aún no has registrado recuerdos.</h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-dorado-suave">
              <span className="h-px w-10 bg-dorado-suave/40" />♡<span className="h-px w-10 bg-dorado-suave/40" />
            </div>
            <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
              Cada historia comienza con un objeto especial. Registra el primero y cuéntanos por qué es
              importante para ti.
            </p>
            <Button href="/recuerdos/nuevo" variant="primary" className="mt-5 inline-flex items-center gap-2">
              <span className="relative h-4 w-4 shrink-0">
                <Image src="/images/dashboard/icon-hourglass.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
              </span>
              Registrar mi primer recuerdo
            </Button>
            <p className="mt-3">
              <Link href="/preguntas-frecuentes" className="text-sm text-borgona hover:text-borgona-dark transition-colors">
                ¿Cómo funciona? →
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl w-full px-6 pb-16">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {beneficios.map((b) => (
            <div key={b.titulo}>
              <span className="relative h-12 w-12 mx-auto block rounded-full bg-rosa/40">
                <Image src={`${ICONS}/${b.icono}`} alt="" fill sizes="48px" className="object-contain p-3" unoptimized />
              </span>
              <h3 className="mt-2 font-display text-sm text-borgona">{b.titulo}</h3>
              <p className="mt-1 text-xs text-carbon/60">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function MisRecuerdosPage() {
  return (
    <ClienteShell activeHref="/mis-recuerdos">
      <ContenidoMisRecuerdos />
    </ClienteShell>
  );
}
