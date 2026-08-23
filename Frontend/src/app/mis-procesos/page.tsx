"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconMessage, IconCheck, IconTruck, IconDots, IconChevronDown } from "@/components/icons";

const ICONS = "/images/mis-procesos";

// Estados reales de Pedido.Estado, en el orden en que ocurren. No existe un
// paso "aprobado" separado en el backend.
const PASOS_PEDIDO = [
  { estado: "recibido", label: "Recibido" },
  { estado: "en_evaluacion", label: "Evaluado" },
  { estado: "en_proceso", label: "Restauración" },
  { estado: "control_de_calidad", label: "Calidad" },
  { estado: "en_camino", label: "En camino" },
  { estado: "entregado", label: "Entrega" },
] as const;

const ESTADO_LABEL: Record<string, string> = {
  recibido: "Recibido",
  en_evaluacion: "En evaluación",
  en_proceso: "En restauración",
  control_de_calidad: "En control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const filtros = [
  { id: "todos", label: "Todos", icono: "icon-box-open.png" },
  { id: "recibidos", label: "Recibidos", icono: "icon-box-closed.png" },
  { id: "intervencion", label: "En intervención", icono: "icon-wrench.png" },
  { id: "calidad", label: "Control de calidad", icono: "icon-shield-check.png" },
  { id: "listos", label: "Listos para entrega", icono: null },
  { id: "finalizados", label: "Finalizados", icono: "icon-clipboard-check.png" },
] as const;

function categoriaFiltro(estado: string): (typeof filtros)[number]["id"] | null {
  switch (estado) {
    case "recibido":
      return "recibidos";
    case "en_proceso":
      return "intervencion";
    case "control_de_calidad":
      return "calidad";
    case "en_camino":
      return "listos";
    case "entregado":
      return "finalizados";
    default:
      return null;
  }
}

const beneficios = [
  { icono: "icon-clipboard-check.png", titulo: "Seguimiento claro", texto: "Consulta el estado de tu recuerdo en cada etapa del proceso." },
  { icono: "icon-timeline.png", titulo: "Etapas visibles", texto: "Conoce cada paso del trabajo, desde el inicio hasta la entrega." },
  { icono: "icon-person.png", titulo: "Acompañamiento experto", texto: "Nuestros especialistas te guían y están siempre disponibles." },
  { icono: "icon-shield-check.png", titulo: "Entrega con trazabilidad", texto: "Recibe tu recuerdo con la seguridad de un proceso transparente." },
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

function StatIcon({ src }: { src: string | null }) {
  if (!src) {
    return (
      <span className="relative h-12 w-12 shrink-0 rounded-full bg-rosa/40 flex items-center justify-center">
        <IconTruck className="h-5 w-5 text-dorado-suave" />
      </span>
    );
  }
  return (
    <span className="relative h-12 w-12 shrink-0 rounded-full bg-rosa/40 flex items-center justify-center">
      <Image src={`${ICONS}/${src}`} alt="" fill sizes="48px" className="object-contain p-3" unoptimized />
    </span>
  );
}

function ContenidoMisProcesos() {
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

  const procesos = pedidos.filter((p) => p.estado !== "cancelado");
  const tieneProcesos = procesos.length > 0;
  const visibles = filtro === "todos" ? procesos : procesos.filter((p) => categoriaFiltro(p.estado) === filtro);

  const stats = [
    { id: "todos", icono: "icon-refresh-circle.png", numero: procesos.length, label: "Procesos activos", ver: "Ver todos" },
    { id: "intervencion", icono: "icon-wrench.png", numero: procesos.filter((p) => p.estado === "en_proceso").length, label: "En intervención", ver: "Ver en intervención" },
    { id: "calidad", icono: "icon-shield-check.png", numero: procesos.filter((p) => p.estado === "control_de_calidad").length, label: "En control de calidad", ver: "Ver en control de calidad" },
    { id: "listos", icono: null, numero: procesos.filter((p) => p.estado === "en_camino").length, label: "Próximos a entrega", ver: "Ver próximos a entrega" },
  ] as const;

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>

        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-carbon">Mis procesos</h1>
            <p className="mt-1 text-dorado-suave max-w-sm">
              Sigue cada etapa de los recuerdos que ya están siendo restaurados, preservados o transformados.
            </p>
            <p className="mt-3 text-sm text-carbon/70 max-w-md">
              Desde que aceptas una propuesta, podrás seguir cada etapa del proceso y conocer el estado de tu
              objeto en tiempo real.
            </p>
            <Button href="/recuerdos/nuevo" variant="primary" className="mt-6 inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Solicitar evaluación
            </Button>
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
            <StatIcon src={s.icono} />
            <div>
              <p className="font-display text-2xl text-carbon leading-none">{s.numero}</p>
              <p className="mt-1 text-sm text-carbon/70">{s.label}</p>
              <button
                type="button"
                onClick={() => setFiltro(s.id === "todos" ? "todos" : s.id)}
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
                {f.icono ? (
                  <span className="relative h-3.5 w-3.5 shrink-0">
                    <Image src={`${ICONS}/${f.icono}`} alt="" fill sizes="14px" className="object-contain" unoptimized />
                  </span>
                ) : (
                  <IconTruck className="h-3.5 w-3.5" />
                )}
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
        {tieneProcesos ? (
          <div className="space-y-5">
            {visibles.map((pedido) => {
              const foto = fotoDe(pedido, recuerdos);
              const taller = tallerDe(pedido);
              const pasoActualIdx = Math.max(0, PASOS_PEDIDO.findIndex((p) => p.estado === pedido.estado));
              const avance = Math.round((pasoActualIdx / (PASOS_PEDIDO.length - 1)) * 100);
              const ultimoEvento = pedido.eventos?.[pedido.eventos.length - 1] ?? null;

              return (
                <div key={pedido.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                  <div className="grid md:grid-cols-[96px_1fr_auto] gap-4 items-start">
                    <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-greige/30 shrink-0">
                      {foto ? (
                        <Image src={foto} alt="" fill sizes="96px" className="object-cover" unoptimized />
                      ) : (
                        <span className="relative h-full w-full block p-6 opacity-40">
                          <Image src={`${ICONS}/icon-box-closed.png`} alt="" fill sizes="60px" className="object-contain" unoptimized />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-lg text-carbon truncate">{tituloPedido(pedido)}</h3>
                        <button type="button" className="text-carbon/40 hover:text-carbon/70 shrink-0">
                          <IconDots className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-carbon/55">Código: {pedido.codigo}</p>

                      <div className="relative mt-5 flex justify-between max-w-md">
                        <div className="absolute left-0 right-0 top-2.5 h-px bg-greige/60" />
                        {PASOS_PEDIDO.map((paso, i) => (
                          <div key={paso.estado} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                i < pasoActualIdx
                                  ? "bg-borgona border-borgona text-marfil"
                                  : i === pasoActualIdx
                                    ? "bg-marfil border-borgona"
                                    : "bg-marfil border-greige/60"
                              }`}
                            >
                              {i < pasoActualIdx && <IconCheck className="h-2.5 w-2.5" />}
                            </span>
                            <span className="text-[9px] text-carbon/55 text-center leading-tight">{paso.label}</span>
                          </div>
                        ))}
                      </div>

                      <span className="mt-3 inline-block rounded-full bg-rosa/40 px-3 py-1 text-xs text-borgona-dark">
                        {ESTADO_LABEL[pedido.estado] ?? pedido.estado}
                      </span>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-carbon/55 border-t border-greige/50 pt-3">
                        {taller && <span>Taller asignado: {taller}</span>}
                        <span>Fecha de inicio: {fechaCorta(pedido.creado_en)}</span>
                        {ultimoEvento && <span>Última actualización: {fechaCorta(ultimoEvento.fecha)}</span>}
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-3">
                      <div>
                        <p className="font-display text-2xl text-carbon leading-none">{avance}%</p>
                        <p className="text-xs text-carbon/55">Avance</p>
                        <div className="mt-1.5 h-1.5 w-24 rounded-full bg-greige/50 overflow-hidden">
                          <div className="h-full bg-borgona" style={{ width: `${avance}%` }} />
                        </div>
                      </div>
                      <Button href={`/pedido/${pedido.id}`} variant="secondary">Ver proceso</Button>
                      <Button href="/chat" variant="primary" className="inline-flex items-center gap-2">
                        <IconMessage className="h-4 w-4" />
                        Hablar con Alma
                      </Button>
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

            <span className="relative h-24 w-24 mx-auto block">
              <Image src={`${ICONS}/icon-clipboard-process.png`} alt="" fill sizes="96px" className="object-contain" unoptimized />
            </span>
            <h2 className="mt-4 font-display text-2xl text-carbon">Aún no tienes procesos activos.</h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-dorado-suave">
              <span className="h-px w-10 bg-dorado-suave/40" />♡<span className="h-px w-10 bg-dorado-suave/40" />
            </div>
            <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
              Cuando apruebes una propuesta, aquí podrás seguir cada etapa del trabajo, desde la recepción hasta
              la entrega final.
            </p>
            <Button href="/recuerdos/nuevo" variant="primary" className="mt-5 inline-flex items-center gap-2">
              <span className="relative h-4 w-4 shrink-0">
                <Image src={`${ICONS}/icon-hourglass.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
              </span>
              Solicitar mi primera evaluación
            </Button>
            <p className="mt-3">
              <Link href="/preguntas-frecuentes" className="text-sm text-borgona hover:text-borgona-dark transition-colors">
                ¿Cómo funciona un proceso? →
              </Link>
            </p>
          </div>
        )}

        {tieneProcesos && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-lg text-carbon">¿Qué verás aquí?</h3>
              <div className="mt-1 flex items-center gap-2 text-dorado-suave">
                <span className="h-px w-8 bg-dorado-suave/40" />♡<span className="h-px w-8 bg-dorado-suave/40" />
              </div>
              <ul className="mt-3 space-y-3 text-sm text-carbon/70">
                <li>El avance de cada proceso en tiempo real.</li>
                <li>Actualizaciones del taller y fotografías del progreso.</li>
                <li>Fechas estimadas de entrega.</li>
                <li>Comunicación directa con Alma.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-lg text-borgona">Habla con Alma</h3>
              <p className="mt-2 text-sm text-carbon/70">
                Alma puede ayudarte con cualquier duda sobre el estado de tus procesos.
              </p>
              <Link href="/chat" className="mt-3 inline-block text-sm text-borgona hover:text-borgona-dark transition-colors">
                Iniciar conversación →
              </Link>
            </div>
          </div>
        )}
      </section>

      {!tieneProcesos && (
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

export default function MisProcesosPage() {
  return (
    <ClienteShell activeHref="/mis-procesos">
      <ContenidoMisProcesos />
    </ClienteShell>
  );
}
