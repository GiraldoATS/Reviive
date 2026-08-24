"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconMessage, IconCheck } from "@/components/icons";

const ICONS = "/images/proveedor";
const ICONS_PROCESOS = "/images/mis-procesos";

interface CotizacionApi {
  id: string;
  recuerdo: string;
  proveedor_nombre: string;
  producto_nombre: string;
  generada_por_ia: boolean;
  total: string;
  vigencia: string;
  estado: "enviada" | "aceptada" | "rechazada" | "vencida";
  creado_en: string;
}

const ESTADO_INFO: Record<string, { label: string; clase: string }> = {
  enviada: { label: "Esperando tu respuesta", clase: "bg-dorado-suave/20 text-borgona-dark" },
  aceptada: { label: "Aceptada", clase: "bg-emerald-50 text-emerald-700" },
  rechazada: { label: "Rechazada", clase: "bg-carbon/10 text-carbon/50" },
  vencida: { label: "Vencida", clase: "bg-greige/50 text-carbon/45" },
};

const filtros = [
  { id: "todas", label: "Todas" },
  { id: "enviada", label: "Por responder" },
  { id: "aceptada", label: "Aceptadas" },
  { id: "rechazada", label: "Rechazadas" },
  { id: "vencida", label: "Vencidas" },
] as const;

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function diasRestantes(vigenciaIso: string): number {
  const hoy = new Date();
  const vigencia = new Date(vigenciaIso);
  return Math.ceil((vigencia.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

function ContenidoCotizaciones() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [cotizaciones, setCotizaciones] = useState<CotizacionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todas");
  const [procesando, setProcesando] = useState<string | null>(null);
  const [avisoPorId, setAvisoPorId] = useState<Record<string, string>>({});

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/quotations/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setCotizaciones(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError("No se pudieron cargar tus cotizaciones."));
  }

  useEffect(cargar, [accessToken]);

  async function aceptar(c: CotizacionApi) {
    if (!accessToken) return;
    setProcesando(c.id);
    setAvisoPorId((prev) => ({ ...prev, [c.id]: "" }));
    try {
      const resEstado = await fetch(`${API_URL}/quotations/${c.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ estado: "aceptada" }),
      });
      if (!resEstado.ok) {
        const data = await resEstado.json().catch(() => null);
        throw new Error(data?.error?.mensaje || "No se pudo aceptar la cotización.");
      }
      const resPedido = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ cotizacion: c.id }),
      });
      const pedido = await resPedido.json().catch(() => null);
      if (!resPedido.ok) {
        throw new Error(pedido?.error?.mensaje || "La cotización quedó aceptada, pero no se pudo iniciar el pedido.");
      }
      router.push(`/pedido/${pedido.id}`);
    } catch (err) {
      setAvisoPorId((prev) => ({ ...prev, [c.id]: err instanceof Error ? err.message : "Ocurrió un error inesperado." }));
      cargar();
    } finally {
      setProcesando(null);
    }
  }

  async function rechazar(c: CotizacionApi) {
    if (!accessToken) return;
    setProcesando(c.id);
    try {
      const res = await fetch(`${API_URL}/quotations/${c.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ estado: "rechazada" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.mensaje || "No se pudo rechazar la cotización.");
      }
      cargar();
    } catch (err) {
      setAvisoPorId((prev) => ({ ...prev, [c.id]: err instanceof Error ? err.message : "Ocurrió un error inesperado." }));
    } finally {
      setProcesando(null);
    }
  }

  if (!cotizaciones && !error) {
    return <div className="min-h-[60vh]" />;
  }

  const tiene = (cotizaciones?.length ?? 0) > 0;
  const visibles = filtro === "todas" ? cotizaciones ?? [] : (cotizaciones ?? []).filter((c) => c.estado === filtro);
  const pendientes = (cotizaciones ?? []).filter((c) => c.estado === "enviada").length;
  const aceptadas = (cotizaciones ?? []).filter((c) => c.estado === "aceptada").length;

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS_PROCESOS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>
        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-carbon">Mis cotizaciones</h1>
            <p className="mt-1 text-dorado-suave max-w-sm">
              Las propuestas de valor que los talleres preparan para tus recuerdos.
            </p>
            <p className="mt-3 text-sm text-carbon/70 max-w-md">
              Cuando un taller prepara una propuesta para tu objeto, la verás aquí con su valor y vigencia. Acéptala
              para iniciar el proceso, o recházala si prefieres esperar otra opción.
            </p>
          </div>
          <div className="relative hidden lg:block min-h-[240px]">
            <Image src={`${ICONS}/cot-hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {error && <p className="mx-auto max-w-6xl px-6 pt-6 text-sm text-borgona">{error}</p>}

      {tiene && (
        <section className="mx-auto max-w-6xl w-full px-6 pt-10 grid sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 block">
              <Image src={`${ICONS}/cot-icon-hourglass.png`} alt="" fill sizes="48px" className="object-contain" unoptimized />
            </span>
            <div>
              <p className="font-display text-2xl text-carbon leading-tight">{pendientes}</p>
              <p className="mt-0.5 text-xs text-carbon/60">Esperando tu respuesta</p>
            </div>
          </div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 block">
              <Image src={`${ICONS}/cot-icon-check-circle.png`} alt="" fill sizes="48px" className="object-contain" unoptimized />
            </span>
            <div>
              <p className="font-display text-2xl text-carbon leading-tight">{aceptadas}</p>
              <p className="mt-0.5 text-xs text-carbon/60">Aceptadas</p>
            </div>
          </div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 block">
              <Image src={`${ICONS}/cot-icon-document-check.png`} alt="" fill sizes="48px" className="object-contain" unoptimized />
            </span>
            <div>
              <p className="font-display text-2xl text-carbon leading-tight">{cotizaciones?.length ?? 0}</p>
              <p className="mt-0.5 text-xs text-carbon/60">Total recibidas</p>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div>
          {tiene && (
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3 flex flex-wrap gap-2">
              {filtros.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFiltro(f.id)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    filtro === f.id ? "bg-borgona text-marfil" : "bg-white/60 text-carbon/70 hover:bg-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {!tiene ? (
            <div className="relative overflow-hidden rounded-2xl border border-greige/50 bg-greige/20 p-10 text-center">
              <span className="relative h-40 w-56 mx-auto block">
                <Image src={`${ICONS}/cot-icon-centerpiece.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
              </span>
              <h2 className="mt-4 font-display text-2xl text-carbon">Aún no tienes cotizaciones</h2>
              <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
                Cuando un taller prepare una propuesta para tu recuerdo, aparecerá aquí para que la revises y decidas.
              </p>
              <Button href="/recuerdos/nuevo" variant="primary" className="mt-5 inline-flex items-center gap-2">
                Solicitar una evaluación
              </Button>
            </div>
          ) : visibles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-8 text-center text-sm text-carbon/60">
              No hay cotizaciones que coincidan con este filtro.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {visibles.map((c) => {
                const info = ESTADO_INFO[c.estado] ?? { label: c.estado, clase: "bg-greige/40 text-carbon/60" };
                const dias = diasRestantes(c.vigencia);
                return (
                  <div key={c.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                    <div className="flex flex-wrap items-start gap-4">
                      <span className="relative h-16 w-16 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                        <span className="relative h-8 w-8 block">
                          <Image src={`${ICONS}/cot-icon-document-check.png`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                        </span>
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-lg text-carbon">{c.producto_nombre || "Servicio de restauración"}</p>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${info.clase}`}>{info.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-carbon/60">Taller: {c.proveedor_nombre}</p>
                        <p className="mt-2 text-sm text-carbon/70">
                          Valor propuesto <strong className="ml-1 font-display text-base text-dorado-suave">{formatoCOP(Number(c.total))}</strong>
                        </p>
                        {c.estado === "enviada" && (
                          <p className={`mt-1 text-xs ${dias <= 3 ? "text-borgona" : "text-carbon/50"}`}>
                            {dias > 0 ? `Vigente ${dias} día${dias === 1 ? "" : "s"} más (hasta ${fechaCorta(c.vigencia)})` : "Vigencia vencida"}
                          </p>
                        )}
                        {avisoPorId[c.id] && <p className="mt-2 text-xs text-borgona">{avisoPorId[c.id]}</p>}
                      </div>

                      <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                        {c.estado === "enviada" && (
                          <>
                            <Button
                              onClick={() => aceptar(c)}
                              disabled={procesando === c.id}
                              className="text-xs whitespace-nowrap inline-flex items-center justify-center gap-1.5"
                            >
                              <IconCheck className="h-3.5 w-3.5" />
                              {procesando === c.id ? "Procesando…" : "Aceptar cotización"}
                            </Button>
                            <button
                              type="button"
                              onClick={() => rechazar(c)}
                              disabled={procesando === c.id}
                              className="rounded-full border border-greige/60 px-6 py-2.5 text-xs text-carbon/60 hover:border-borgona/40 hover:text-borgona transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                        {c.estado === "aceptada" && (
                          <Link href="/mis-procesos" className="rounded-full border border-borgona text-borgona px-6 py-2.5 text-xs hover:bg-borgona/5 transition-colors whitespace-nowrap text-center">
                            Ver mi proceso →
                          </Link>
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
              <span className="relative h-8 w-8 shrink-0">
                <Image src={`${ICONS}/cot-icon-info.png`} alt="" fill sizes="32px" className="object-contain" unoptimized />
              </span>
              ¿Cómo funciona?
            </h3>
            <p className="mt-2 text-sm text-carbon/70">
              Un taller compatible con tu recuerdo prepara una propuesta con el valor del servicio. Al aceptarla,
              Reviive crea tu pedido y podrás seguir cada etapa en &ldquo;Mis procesos&rdquo;.
            </p>
          </div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-8 w-8 shrink-0">
                <Image src={`${ICONS}/cot-icon-hourglass.png`} alt="" fill sizes="32px" className="object-contain" unoptimized />
              </span>
              Sobre la vigencia
            </h3>
            <p className="mt-2 text-sm text-carbon/70">
              Cada propuesta tiene una fecha límite. Si vence sin respuesta, el taller podrá enviarte una nueva.
            </p>
          </div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Habla con Alma</h3>
            <p className="mt-2 text-sm text-carbon/70">Si tienes dudas sobre una propuesta, Alma puede ayudarte.</p>
            <Link href="/chat" className="mt-3 inline-flex items-center gap-1.5 text-sm text-borgona hover:text-borgona-dark transition-colors">
              <IconMessage className="h-4 w-4" />
              Iniciar conversación →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function MisCotizacionesPage() {
  return (
    <ClienteShell activeHref="/mis-cotizaciones">
      <ContenidoCotizaciones />
    </ClienteShell>
  );
}
