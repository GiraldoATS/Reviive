"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconMessage, IconChevronDown } from "@/components/icons";

const ICONS = "/images/envios";

// No existe un modelo de envíos dedicado en el backend: se deriva del mismo
// Pedido/EventoPedido ya usado en Mis procesos, agrupando sus 6 estados
// reales en las 4 etapas físicas de un traslado (recolección, taller,
// tránsito, entrega).
const ENVIO_PASOS = [
  { estados: ["recibido"], label: "Preparado", icono: "icon-box.png" },
  { estados: ["en_evaluacion", "en_proceso", "control_de_calidad"], label: "En el taller", icono: "icon-taller.png" },
  { estados: ["en_camino"], label: "En tránsito", icono: "icon-truck2.png" },
  { estados: ["entregado"], label: "Entregado", icono: "icon-home.png" },
] as const;

const ENVIO_ESTADO_LABEL: Record<string, string> = {
  recibido: "Pendiente de recolección",
  en_evaluacion: "En el taller",
  en_proceso: "En el taller",
  control_de_calidad: "En control de calidad",
  en_camino: "En tránsito a tu casa",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const filtros = [
  { id: "todos", label: "Todos", icono: "icon-grid.png" },
  { id: "recoger", label: "Por recoger", icono: "icon-box-small.png" },
  { id: "transito", label: "En tránsito", icono: "icon-truck.png" },
  { id: "taller", label: "Recibidos en taller", icono: "icon-taller.png" },
  { id: "entregados", label: "Entregados", icono: "icon-check-circle.png" },
] as const;

function categoriaFiltro(estado: string): (typeof filtros)[number]["id"] | null {
  if (estado === "recibido") return "recoger";
  if (estado === "en_camino") return "transito";
  if (estado === "en_evaluacion" || estado === "en_proceso" || estado === "control_de_calidad") return "taller";
  if (estado === "entregado") return "entregados";
  return null;
}

function pasoIdx(estado: string): number {
  const i = ENVIO_PASOS.findIndex((p) => (p.estados as readonly string[]).includes(estado));
  return Math.max(0, i);
}

const beneficios = [
  { icono: "icon-shield-check.png", titulo: "Seguimiento claro", texto: "Conoce dónde se encuentra tu recuerdo en cada etapa." },
  { icono: "icon-lock.png", titulo: "Entrega protegida", texto: "Cada traslado se realiza con el máximo cuidado y seguridad." },
  { icono: "icon-calendar-clock.png", titulo: "Fechas visibles", texto: "Consulta recolecciones y entregas estimadas." },
  { icono: "icon-person.png", titulo: "Acompañamiento", texto: "Alma estará disponible si tienes alguna duda." },
];

interface ArchivoAPI {
  id: string;
  url: string;
}
interface ObjetoMemoriaAPI {
  archivos: ArchivoAPI[];
}
interface RecuerdoAPI {
  id: string;
  objetos: ObjetoMemoriaAPI[];
}
interface EventoPedidoAPI {
  id: string;
  estado: string;
  fecha: string;
}
interface ResumenPedidoAPI {
  objeto?: string;
  proveedor?: string;
  recuerdo_id?: string;
}
interface PedidoAPI {
  id: string;
  codigo: string;
  resumen: ResumenPedidoAPI | string | null;
  estado: string;
  eventos: EventoPedidoAPI[];
  creado_en: string;
}

function tituloPedido(pedido: PedidoAPI): string {
  if (typeof pedido.resumen === "string" && pedido.resumen) return pedido.resumen;
  if (pedido.resumen && typeof pedido.resumen === "object" && pedido.resumen.objeto) return pedido.resumen.objeto;
  return pedido.codigo;
}

function tallerDe(pedido: PedidoAPI): string | null {
  if (pedido.resumen && typeof pedido.resumen === "object" && pedido.resumen.proveedor) return pedido.resumen.proveedor;
  return null;
}

function destinoDe(pedido: PedidoAPI, taller: string | null): string {
  const enCaminoOEntregado = pedido.estado === "en_camino" || pedido.estado === "entregado";
  if (enCaminoOEntregado) return "Tu dirección";
  if (!taller) return "Taller asignado";
  return /^taller\b/i.test(taller) ? taller : `Taller ${taller}`;
}

function fotoDe(pedido: PedidoAPI, recuerdos: RecuerdoAPI[]): string | null {
  const recuerdoId = typeof pedido.resumen === "object" ? pedido.resumen?.recuerdo_id : undefined;
  const recuerdo = recuerdoId ? recuerdos.find((r) => r.id === recuerdoId) : undefined;
  for (const objeto of recuerdo?.objetos ?? []) {
    const archivo = objeto.archivos?.[0];
    if (archivo?.url) return archivo.url;
  }
  return null;
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function ContenidoEnvios() {
  const { accessToken } = useAuth();
  const [recuerdos, setRecuerdos] = useState<RecuerdoAPI[]>([]);
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");

  useEffect(() => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/memories/`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/orders/`, { headers }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([r, p]) => {
        setRecuerdos(Array.isArray(r) ? r : (r.results ?? []));
        setPedidos(Array.isArray(p) ? p : (p.results ?? []));
      })
      .catch(() => {
        setRecuerdos([]);
        setPedidos([]);
      })
      .finally(() => setCargandoDatos(false));
  }, [accessToken]);

  if (cargandoDatos) {
    return <div className="min-h-[60vh]" />;
  }

  const envios = pedidos.filter((p) => p.estado !== "cancelado");
  const tieneEnvios = envios.length > 0;
  const visibles = filtro === "todos" ? envios : envios.filter((p) => categoriaFiltro(p.estado) === filtro);

  const stats = [
    { id: "todos" as const, icono: "icon-truck-stat.png", numero: envios.filter((p) => p.estado !== "entregado").length, label: envios.filter((p) => p.estado !== "entregado").length === 1 ? "Envío activo" : "Envíos activos", ver: "Ver todos" },
    { id: "recoger" as const, icono: "icon-calendar.png", numero: envios.filter((p) => p.estado === "recibido").length, label: "Pendientes de recolección", ver: "Ver pendientes" },
    { id: "transito" as const, icono: "icon-pin.png", numero: envios.filter((p) => p.estado === "en_camino").length, label: "En tránsito", ver: "Ver en tránsito" },
    { id: "entregados" as const, icono: "icon-box-circled.png", numero: envios.filter((p) => p.estado === "entregado").length, label: "Entregados", ver: "Ver entregados" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>

        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-carbon">Mis envíos</h1>
            <p className="mt-1 text-dorado-suave max-w-sm">
              Sigue el recorrido de tus recuerdos desde la recolección hasta su entrega final.
            </p>
            <p className="mt-3 text-sm text-carbon/70 max-w-md">
              Aquí podrás consultar el estado, fechas y novedades relacionadas con cada traslado.
            </p>
          </div>
          <div className="relative hidden lg:block min-h-[280px]">
            <Image src={`${ICONS}/hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-start gap-4">
            <span className="relative h-12 w-12 shrink-0 rounded-full bg-rosa/40 flex items-center justify-center">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="48px" className="object-contain p-3" unoptimized />
            </span>
            <div>
              <p className="font-display text-2xl text-carbon leading-none">{s.numero}</p>
              <p className="mt-1 text-sm text-carbon/70">{s.label}</p>
              <button
                type="button"
                onClick={() => setFiltro(s.id)}
                className="mt-1 inline-block text-sm text-borgona hover:text-borgona-dark transition-colors"
              >
                {s.ver} →
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-6">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  filtro === f.id ? "bg-borgona text-marfil" : "bg-white/70 text-carbon/70 hover:bg-white"
                }`}
              >
                <span className="relative h-3.5 w-3.5 shrink-0">
                  <Image src={`${ICONS}/${f.icono}`} alt="" fill sizes="14px" className="object-contain" unoptimized />
                </span>
                {f.label}
              </button>
            ))}
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

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {tieneEnvios ? (
          <div className="space-y-5">
            {visibles.map((pedido) => {
              const foto = fotoDe(pedido, recuerdos);
              const taller = tallerDe(pedido);
              const idx = pasoIdx(pedido.estado);
              const ultimoEvento = pedido.eventos?.[pedido.eventos.length - 1] ?? null;

              return (
                <div key={pedido.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                  <div className="grid md:grid-cols-[80px_1fr] gap-4">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-greige/30 shrink-0">
                      {foto ? (
                        <Image src={foto} alt="" fill sizes="80px" className="object-cover" unoptimized />
                      ) : (
                        <span className="relative h-full w-full block p-5 opacity-40">
                          <Image src={`${ICONS}/icon-box.png`} alt="" fill sizes="50px" className="object-contain" unoptimized />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-lg text-carbon">{tituloPedido(pedido)}</h3>
                        <span className="rounded-full bg-rosa/40 px-3 py-1 text-xs text-borgona-dark">
                          {ENVIO_ESTADO_LABEL[pedido.estado] ?? pedido.estado}
                        </span>
                      </div>
                      <p className="text-xs text-carbon/55">Destino: {destinoDe(pedido, taller)}</p>

                      <div className="relative mt-5 flex justify-between max-w-lg">
                        <div className="absolute left-0 right-0 top-4 h-px bg-greige/60" />
                        {ENVIO_PASOS.map((paso, i) => (
                          <div key={paso.label} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                i <= idx ? "bg-marfil border-borgona" : "bg-marfil border-greige/60"
                              }`}
                            >
                              <span className={`relative h-4 w-4 ${i <= idx ? "opacity-100" : "opacity-35"}`}>
                                <Image src={`${ICONS}/${paso.icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                              </span>
                            </span>
                            <span className={`text-[10px] text-center leading-tight ${i <= idx ? "text-carbon/70" : "text-carbon/40"}`}>
                              {paso.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-carbon/55 border-t border-greige/50 pt-3">
                        <span>Código: {pedido.codigo}</span>
                        {taller && <span>Taller: {taller}</span>}
                        <span>Registrado: {fechaCorta(pedido.creado_en)}</span>
                        {ultimoEvento && <span>Última actualización: {fechaCorta(ultimoEvento.fecha)}</span>}
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Button href={`/pedido/${pedido.id}`} variant="secondary">Ver seguimiento</Button>
                        <Button href="/chat" variant="primary" className="inline-flex items-center gap-2">
                          <IconMessage className="h-4 w-4" />
                          Hablar con Alma
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-greige/50 bg-greige/20 p-10 text-center">
            <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 hidden h-64 w-56 opacity-30 md:block">
              <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
            </div>
            <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 hidden h-64 w-56 opacity-30 md:block -scale-x-100">
              <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
            </div>

            <span className="relative h-24 w-24 mx-auto block rounded-full bg-rosa/40">
              <Image src={`${ICONS}/icon-box-circled.png`} alt="" fill sizes="96px" className="object-contain p-6" unoptimized />
            </span>
            <h2 className="mt-4 font-display text-2xl text-carbon">Aún no tienes envíos registrados</h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-dorado-suave">
              <span className="h-px w-10 bg-dorado-suave/40" />♡<span className="h-px w-10 bg-dorado-suave/40" />
            </div>
            <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
              Cuando inicies un proceso de restauración, preservación o transformación y sea necesario trasladar
              tu recuerdo, podrás seguir aquí todo su recorrido.
            </p>
            <Button href="/mis-procesos" variant="primary" className="mt-5 inline-flex items-center gap-2">
              <span className="relative h-4 w-4 shrink-0">
                <Image src={`${ICONS}/icon-taller.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
              </span>
              Ver mis procesos
            </Button>
            <p className="mt-3 text-sm text-carbon/70">
              ¿Quieres comenzar con un nuevo recuerdo?{" "}
              <Link href="/recuerdos/nuevo" className="text-borgona hover:text-borgona-dark transition-colors">
                Solicitar evaluación →
              </Link>
            </p>
          </div>
        )}

        {tieneEnvios && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-lg text-carbon">Protegemos lo que más importa</h3>
              <ul className="mt-3 space-y-3 text-sm text-carbon/70">
                {[
                  { icono: "icon-shield-check.png", titulo: "Empaque seguro", texto: "Utilizamos materiales especializados para proteger cada detalle." },
                  { icono: "icon-clock-eye.png", titulo: "Seguimiento en tiempo real", texto: "Conoce cada paso del recorrido de tu recuerdo." },
                  { icono: "icon-check-small.png", titulo: "Confirmación de recepción", texto: "Validamos el estado de tu objeto al llegar al taller." },
                  { icono: "icon-lock.png", titulo: "Entrega cuidadosa", texto: "Tu recuerdo regresa a casa con el mismo cuidado." },
                ].map((b) => (
                  <li key={b.titulo} className="flex items-start gap-3">
                    <span className="relative h-8 w-8 shrink-0">
                      <Image src={`${ICONS}/${b.icono}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                    </span>
                    <span>
                      <span className="block text-carbon font-medium">{b.titulo}</span>
                      {b.texto}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-lg text-borgona">¿Necesitas ayuda?</h3>
              <p className="mt-2 text-sm text-carbon/70">Alma está aquí para acompañarte en todo el proceso.</p>
              <Link href="/chat" className="mt-3 inline-block text-sm text-borgona hover:text-borgona-dark transition-colors">
                Hablar con Alma →
              </Link>
            </div>
          </div>
        )}
      </section>

      {!tieneEnvios && (
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
      )}
    </>
  );
}

export default function EnviosPage() {
  return (
    <ClienteShell activeHref="/envios">
      <ContenidoEnvios />
    </ClienteShell>
  );
}
