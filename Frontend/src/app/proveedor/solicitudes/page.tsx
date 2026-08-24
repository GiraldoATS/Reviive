"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ProveedorShell from "@/components/ProveedorShell";

const ICONS = "/images/proveedor";

// El backend no tiene ningún concepto de "solicitud" asignada a un
// proveedor específico (no existe una tabla ni un campo que derive una
// evaluación/recomendación hacia un taller): solo existe Cotizacion, que
// el propio proveedor crea manualmente. Mientras esa funcionalidad no
// exista, esta vista muestra el diseño del prototipo con datos de
// ejemplo, para validar la visual antes de conectarla a datos reales.

const stats = [
  { icono: "sol-icon-documento.png", numero: 12, label: "Solicitudes nuevas" },
  { icono: "sol-icon-magnifier.png", numero: 5, label: "En revisión" },
  { icono: "sol-icon-star.png", numero: 4, label: "Priorizadas" },
  { icono: "sol-icon-documento-check.png", numero: 7, label: "Aceptadas para cotizar" },
];

const filtros = [
  { id: "todas", label: "Todas" },
  { id: "nueva", label: "Nuevas" },
  { id: "en_revision", label: "En revisión" },
  { id: "priorizada", label: "Priorizadas" },
  { id: "aceptada", label: "Aceptadas para cotizar" },
  { id: "descartada", label: "Descartadas" },
] as const;

const ESTADO_INFO: Record<string, { label: string; clase: string }> = {
  nueva: { label: "Nueva", clase: "bg-rosa/50 text-borgona-dark" },
  en_revision: { label: "En revisión", clase: "bg-dorado-suave/20 text-borgona-dark" },
  priorizada: { label: "Priorizada", clase: "bg-borgona/10 text-borgona-dark" },
  aceptada: { label: "Aceptada para cotizar", clase: "bg-emerald-50 text-emerald-700" },
  descartada: { label: "Descartada", clase: "bg-carbon/10 text-carbon/50" },
};

const URGENCIA_COLOR: Record<string, string> = {
  Alta: "text-borgona",
  Media: "text-dorado-suave",
  Baja: "text-emerald-700",
};

interface SolicitudEjemplo {
  id: string;
  titulo: string;
  icono: string;
  estado: keyof typeof ESTADO_INFO;
  cliente: string;
  ciudad: string;
  fecha: string;
  servicio: string;
  categoria: string;
  urgencia: "Alta" | "Media" | "Baja";
  nota: string;
  accion: string;
}

const SOLICITUDES: SolicitudEjemplo[] = [
  {
    id: "1",
    titulo: "Reloj de bolsillo familiar",
    icono: "sol-icon-clock.png",
    estado: "nueva",
    cliente: "Familia Ramírez",
    ciudad: "Medellín",
    fecha: "15 may 2026",
    servicio: "Restauración",
    categoria: "Relojes",
    urgencia: "Alta",
    nota: "El reloj dejó de funcionar y la tapa está suelta. Tiene gran valor sentimental.",
    accion: "Analizar solicitud",
  },
  {
    id: "2",
    titulo: "Álbum de fotos antiguo",
    icono: "icon-evidencias.png",
    estado: "en_revision",
    cliente: "Lucía Torres",
    ciudad: "Bogotá",
    fecha: "14 may 2026",
    servicio: "Preservación",
    categoria: "Papel y fotografía",
    urgencia: "Media",
    nota: "Las páginas están frágiles y algunas fotos se están despegando.",
    accion: "Continuar análisis",
  },
  {
    id: "3",
    titulo: "Baúl de madera heredado",
    icono: "sol-icon-caja.png",
    estado: "priorizada",
    cliente: "Andrés Pineda",
    ciudad: "Cali",
    fecha: "13 may 2026",
    servicio: "Transformación",
    categoria: "Muebles",
    urgencia: "Alta",
    nota: "La madera está dañada por la humedad y quiero darle una nueva vida.",
    accion: "Preparar cotización",
  },
  {
    id: "4",
    titulo: "Canasta artesanal",
    icono: "sol-icon-caja.png",
    estado: "aceptada",
    cliente: "Natalia Gómez",
    ciudad: "Bucaramanga",
    fecha: "12 may 2026",
    servicio: "Restauración",
    categoria: "Artesanías",
    urgencia: "Baja",
    nota: "Algunas fibras están rotas y necesita limpieza y refuerzo.",
    accion: "Crear cotización",
  },
];

const proximasAcciones = [
  "Completa tu perfil y portafolio para generar confianza.",
  "Mantén tu disponibilidad actualizada.",
  "Revisa esta sección diariamente para no perder oportunidades.",
  "Responde y cotiza a tiempo para mejorar tu posicionamiento.",
];

function ContenidoSolicitudes() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todas");
  const [busqueda, setBusqueda] = useState("");

  const visibles = useMemo(() => {
    return SOLICITUDES.filter((s) => {
      if (filtro !== "todas" && s.estado !== filtro) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        return (
          s.titulo.toLowerCase().includes(q) ||
          s.cliente.toLowerCase().includes(q) ||
          s.ciudad.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filtro, busqueda]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 hidden h-[1050px] w-40 opacity-20 lg:block">
        <Image src={`${ICONS}/sol-rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-top" unoptimized />
      </div>

      <section className="relative overflow-hidden bg-greige/15">
        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Solicitudes</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Aquí revisas las oportunidades recibidas y decides cuáles analizar, cotizar o descartar.
            </p>
          </div>
          <div className="relative hidden lg:block min-h-[240px]">
            <Image src={`${ICONS}/sol-hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
            <div className="flex items-center gap-3">
              <span className="relative h-11 w-11 shrink-0 block">
                <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="44px" className="object-contain" unoptimized />
              </span>
              <p className="font-display text-2xl text-carbon">{s.numero}</p>
            </div>
            <p className="mt-2 text-xs text-carbon/60">{s.label}</p>
            <span className="mt-1 inline-block text-xs text-borgona">Ver detalle →</span>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3 flex flex-wrap items-center gap-2">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  filtro === f.id ? "bg-borgona text-marfil" : "bg-white/60 text-carbon/60 hover:bg-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por objeto, cliente o ciudad..."
              className="flex-1 min-w-[220px] rounded-xl border border-greige/70 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-borgona/50"
            />
          </div>

          {visibles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-8 text-center text-sm text-carbon/60">
              No hay solicitudes que coincidan con este filtro.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {visibles.map((s) => {
                const info = ESTADO_INFO[s.estado];
                return (
                  <div key={s.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                    <div className="flex flex-wrap items-start gap-4">
                      <span className="relative h-16 w-16 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                        <span className="relative h-9 w-9 block">
                          <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="36px" className="object-contain" unoptimized />
                        </span>
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-lg text-carbon">{s.titulo}</p>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${info.clase}`}>{info.label}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-carbon/65">
                          <span>Cliente: {s.cliente}</span>
                          <span>{s.fecha}</span>
                          <span>Ciudad: {s.ciudad}</span>
                          <span>Servicio sugerido: {s.servicio}</span>
                        </div>
                        <p className="mt-2 text-sm text-carbon/60 italic">&ldquo;{s.nota}&rdquo;</p>
                      </div>

                      <div className="shrink-0 text-xs text-carbon/60 space-y-1">
                        <p>
                          Urgencia <span className={`font-medium ${URGENCIA_COLOR[s.urgencia]}`}>{s.urgencia}</span>
                        </p>
                        <p>
                          Categoría <span className="text-carbon/80">{s.categoria}</span>
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                        {s.estado === "aceptada" ? (
                          <Button href="/proveedor/cotizaciones" variant="primary" className="text-xs whitespace-nowrap">
                            {s.accion}
                          </Button>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center rounded-full bg-borgona/90 px-6 py-2.5 text-xs text-marfil cursor-default whitespace-nowrap"
                            title="Próximamente"
                          >
                            {s.accion}
                          </span>
                        )}
                        {s.estado === "nueva" && (
                          <span
                            className="inline-flex items-center justify-center rounded-full border border-greige/60 px-6 py-2.5 text-xs text-carbon/40 cursor-default whitespace-nowrap"
                            title="Próximamente"
                          >
                            Descartar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS}/sol-icon-hourglass.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              Regla del proceso
            </h3>
            <p className="mt-2 text-sm text-carbon/70">
              El trabajo no inicia en Solicitudes. Primero analizas la oportunidad, luego preparas la cotización.
              El pedido solo comienza cuando el cliente aprueba, el pago es confirmado y el objeto es recibido por
              el taller.
            </p>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS}/sol-icon-clipboard-checklist.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              Próximos pasos
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-carbon/70">
              {proximasAcciones.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-dorado-suave shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
            <Link href="/proveedor/cotizaciones" className="mt-4 inline-block text-sm text-borgona hover:text-borgona-dark transition-colors">
              Conocer cómo funciona →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SolicitudesPage() {
  return (
    <ProveedorShell activeHref="/proveedor/solicitudes">
      <ContenidoSolicitudes />
    </ProveedorShell>
  );
}
