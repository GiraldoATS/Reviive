"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";

const ICONS = "/images/proveedor";

// Evidencias no tiene hoy respaldo real en el backend: no existe un
// endpoint que persista un archivo subido (AssetPresignView solo firma
// una URL de subida, nunca crea el registro), y tampoco existe un
// modelo de "revisión de evidencia" con estados de aprobación. Por eso,
// igual que Solicitudes, esta vista muestra el diseño del prototipo con
// datos de ejemplo, para validar la visual antes de conectarla a datos
// reales.

const stats = [
  { icono: "evi-icon-hourglass.png", numero: 3, label: "Pendientes por subir" },
  { icono: "sol-icon-clock.png", numero: 2, label: "En revisión" },
  { icono: "ped-icon-check.png", numero: 18, label: "Aprobadas" },
  { icono: "evi-icon-bell.png", numero: 1, label: "Con observaciones" },
];

const etapas = [
  { id: "todas", label: "Todas", icono: "evi-icon-box.png" },
  { id: "recepcion", label: "Recepción", icono: "evi-icon-box.png" },
  { id: "diagnostico", label: "Diagnóstico", icono: "evi-icon-magnifier.png" },
  { id: "proceso", label: "Proceso", icono: "ped-icon-wrench.png" },
  { id: "calidad", label: "Control de calidad", icono: "ped-icon-shield.png" },
  { id: "resultado", label: "Resultado final", icono: "evi-icon-camera.png" },
  { id: "entrega", label: "Entrega", icono: "evi-icon-truck.png" },
] as const;

const ESTADO_INFO: Record<string, { label: string; clase: string }> = {
  pendiente: { label: "Pendiente por subir", clase: "bg-dorado-suave/20 text-borgona-dark" },
  en_revision: { label: "En revisión", clase: "bg-rosa/40 text-borgona-dark" },
  aprobada: { label: "Aprobada", clase: "bg-emerald-50 text-emerald-700" },
  con_observaciones: { label: "Con observaciones", clase: "bg-dorado-suave/25 text-borgona-dark" },
};

interface EvidenciaEjemplo {
  id: string;
  codigo: string;
  titulo: string;
  cliente: string;
  ciudad: string;
  etapa: (typeof etapas)[number]["id"];
  subetapa: string;
  estado: keyof typeof ESTADO_INFO;
  fecha: string;
  autor: string;
  archivos: number;
  accion: string;
}

const EVIDENCIAS: EvidenciaEjemplo[] = [
  {
    id: "1",
    codigo: "PED-00128",
    titulo: "Reloj de bolsillo familiar",
    cliente: "Familia Ramírez",
    ciudad: "Medellín",
    etapa: "proceso",
    subetapa: "Intervención",
    estado: "en_revision",
    fecha: "24 ago 2026",
    autor: "María Hernández",
    archivos: 6,
    accion: "Ver evidencias",
  },
  {
    id: "2",
    codigo: "PED-00116",
    titulo: "Marco de plata antiguo",
    cliente: "Juan Camilo López",
    ciudad: "Bogotá",
    etapa: "calidad",
    subetapa: "Verificación final",
    estado: "aprobada",
    fecha: "22 ago 2026",
    autor: "María Hernández",
    archivos: 5,
    accion: "Ver evidencias",
  },
  {
    id: "3",
    codigo: "PED-00108",
    titulo: "Lámpara de bronce",
    cliente: "Ana Sofía Mejía",
    ciudad: "Medellín",
    etapa: "recepcion",
    subetapa: "Objeto recibido",
    estado: "pendiente",
    fecha: "20 ago 2026",
    autor: "María Hernández",
    archivos: 7,
    accion: "Ver evidencias",
  },
  {
    id: "4",
    codigo: "PED-00098",
    titulo: "Radio vintage",
    cliente: "Carlos Muñoz",
    ciudad: "Cali",
    etapa: "entrega",
    subetapa: "Preparación de envío",
    estado: "con_observaciones",
    fecha: "18 ago 2026",
    autor: "María Hernández",
    archivos: 3,
    accion: "Ver evidencias",
  },
];

function ContenidoEvidencias() {
  const [filtro, setFiltro] = useState<(typeof etapas)[number]["id"]>("todas");
  const [busqueda, setBusqueda] = useState("");

  const visibles = useMemo(() => {
    return EVIDENCIAS.filter((e) => {
      if (filtro !== "todas" && e.etapa !== filtro) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        return (
          e.titulo.toLowerCase().includes(q) ||
          e.cliente.toLowerCase().includes(q) ||
          e.codigo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filtro, busqueda]);

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_0.85fr_0.9fr] items-center gap-4">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Evidencias</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Documenta cada etapa del trabajo y conserva un registro visual del proceso realizado.
            </p>
          </div>
          <div
            className="relative hidden lg:block h-48"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
            }}
          >
            <Image src={`${ICONS}/evi-hero.png`} alt="" fill sizes="26vw" className="object-contain" unoptimized />
          </div>
          <div className="hidden lg:block rounded-2xl border border-greige/50 bg-white/60 p-5 mr-6">
            <h3 className="inline-flex items-center gap-2 font-display text-sm text-carbon">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS}/evi-icon-bulb.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              ¿Cómo funciona?
            </h3>
            <p className="mt-2 text-xs text-carbon/65">
              Sube fotografías y archivos de cada etapa del trabajo. Reviive revisará tus evidencias y te notificará
              cuando sean aprobadas.
            </p>
            <Link href="/preguntas-frecuentes" className="mt-2 inline-block text-xs text-borgona hover:text-borgona-dark transition-colors">
              Ver guía de evidencias →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 block">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="48px" className="object-contain" unoptimized />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl text-carbon leading-tight">{s.numero}</p>
              <p className="mt-0.5 text-xs text-carbon/60">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3 flex flex-wrap gap-2">
          {etapas.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setFiltro(e.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                filtro === e.id ? "bg-borgona text-marfil" : "bg-white/60 text-carbon/70 hover:bg-white"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 block">
              <Image src={`${ICONS}/evi-icon-magnifier.png`} alt="" fill sizes="16px" className="object-contain opacity-60" unoptimized />
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por pedido, objeto o cliente..."
              className="w-full rounded-xl border border-greige/70 bg-white/70 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-borgona/50"
            />
          </div>
        </div>

        {visibles.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-8 text-center text-sm text-carbon/60">
            No hay evidencias que coincidan con este filtro.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visibles.map((ev) => {
              const info = ESTADO_INFO[ev.estado];
              const etapaInfo = etapas.find((e) => e.id === ev.etapa);
              return (
                <div key={ev.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <span className="relative h-16 w-16 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                      <span className="relative h-8 w-8 block">
                        <Image src={`${ICONS}/${etapaInfo?.icono ?? "evi-icon-box.png"}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                      </span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg text-carbon">Pedido #{ev.codigo}</p>
                      <p className="text-sm text-carbon/70">{ev.titulo}</p>
                      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-carbon/60">
                        <span>Cliente: {ev.cliente}</span>
                        <span>Ciudad: {ev.ciudad}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[11px] text-carbon/70">
                          <span className="relative h-3.5 w-3.5 shrink-0">
                            <Image src={`${ICONS}/${etapaInfo?.icono ?? "evi-icon-box.png"}`} alt="" fill sizes="14px" className="object-contain" unoptimized />
                          </span>
                          {etapaInfo?.label}
                        </span>
                        <span className="text-[11px] text-carbon/40">{ev.subetapa}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span key={i} className="relative h-11 w-11 rounded-lg bg-white/70 flex items-center justify-center overflow-hidden">
                            <span className="relative h-5 w-5 block opacity-60">
                              <Image src={`${ICONS}/evi-icon-camera.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
                            </span>
                          </span>
                        ))}
                        {ev.archivos > 3 && (
                          <span className="h-11 w-11 rounded-lg bg-white/40 flex items-center justify-center text-xs text-carbon/50">
                            +{ev.archivos - 3}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-carbon/40">
                        {ev.fecha} · {ev.autor} · {ev.archivos} archivos
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs ${info.clase}`}>{info.label}</span>
                      <span
                        className="inline-flex items-center justify-center rounded-full bg-borgona/90 px-5 py-2 text-xs text-marfil cursor-default whitespace-nowrap"
                        title="Próximamente"
                      >
                        Ver evidencias
                      </span>
                      <span
                        className="inline-flex items-center justify-center rounded-full border border-greige/60 px-5 py-2 text-xs text-carbon/40 cursor-default whitespace-nowrap"
                        title="Próximamente"
                      >
                        Agregar evidencia
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-greige/50 bg-greige/20 p-6 flex flex-wrap items-center gap-4">
          <span className="relative h-10 w-10 shrink-0">
            <Image src={`${ICONS}/evi-icon-medal.png`} alt="" fill sizes="40px" className="object-contain" unoptimized />
          </span>
          <p className="flex-1 min-w-[220px] text-sm text-carbon/70">
            <strong className="text-carbon">Consejo:</strong> Toma fotografías claras, con buena iluminación y
            muestra los detalles importantes de cada etapa. Esto ayudará a que tus evidencias sean aprobadas más
            rápido.
          </p>
          <Link
            href="/preguntas-frecuentes"
            className="inline-flex items-center gap-2 rounded-full bg-borgona text-marfil px-5 py-2.5 text-sm hover:bg-borgona-dark transition-colors shrink-0"
          >
            Ver guía completa
          </Link>
          <span className="relative h-8 w-16 shrink-0 opacity-70 hidden sm:block">
            <Image src={`${ICONS}/evi-rama.png`} alt="" fill sizes="64px" className="object-contain" unoptimized />
          </span>
        </div>
      </section>
    </>
  );
}

export default function EvidenciasPage() {
  return (
    <ProveedorShell activeHref="/proveedor/evidencias">
      <ContenidoEvidencias />
    </ProveedorShell>
  );
}
