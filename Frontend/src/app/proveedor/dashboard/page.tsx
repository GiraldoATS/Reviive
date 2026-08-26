"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { useProveedor } from "@/lib/ProveedorContext";
import { API_URL } from "@/lib/api";
import { IconChevronRight } from "@/components/icons";

const ICONS = "/images/proveedor";

const ESTADO_LABEL: Record<string, string> = {
  recibido: "Recibido",
  en_evaluacion: "Evaluación",
  en_proceso: "En producción",
  control_de_calidad: "Control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const ESTADO_COLOR: Record<string, string> = {
  recibido: "#c7a063",
  en_evaluacion: "#a8785a",
  en_proceso: "#5b1f2e",
  control_de_calidad: "#8d8f6b",
  en_camino: "#d4af37",
  entregado: "#6b8f71",
  cancelado: "#9a9a9a",
};

const PRIORIDAD_ESTILO: Record<string, string> = {
  Alta: "bg-borgona text-marfil",
  Media: "bg-dorado-suave/25 text-borgona-dark",
};

interface ResumenPedidoAPI {
  objeto?: string;
  historia?: string;
  proveedor?: string;
}
interface EventoPedidoAPI {
  id: string;
  estado: string;
  fecha: string;
  descripcion: string;
}
interface PedidoAPI {
  id: string;
  codigo: string;
  resumen: ResumenPedidoAPI | string | null;
  estado: string;
  total: string;
  eventos: EventoPedidoAPI[];
  creado_en: string;
}
interface CotizacionAPI {
  id: string;
  estado: string;
  total: string;
  creado_en: string;
}

function tituloPedido(pedido: PedidoAPI): string {
  if (typeof pedido.resumen === "string" && pedido.resumen) return pedido.resumen;
  if (pedido.resumen && typeof pedido.resumen === "object" && pedido.resumen.objeto) return pedido.resumen.objeto;
  return pedido.codigo;
}

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function formatoCOPCorto(valor: number) {
  if (valor >= 1000) return `$${Math.round(valor / 1000)}k`;
  return `$${valor}`;
}

function tiempoRelativo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const horas = Math.floor(diffMs / 3600000);
  if (horas < 1) return "Hace unos minutos";
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return "Ayer";
  if (dias < 7) return `Hace ${dias} días`;
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

function ContenidoDashboard() {
  const { accessToken, usuario } = useAuth();
  const { proveedor, cargandoProveedor } = useProveedor();
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [cotizaciones, setCotizaciones] = useState<CotizacionAPI[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  const nombre = usuario?.perfil?.nombre?.trim().split(" ")[0] || "";

  useEffect(() => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/orders/`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/quotations/`, { headers }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([p, c]) => {
        setPedidos(Array.isArray(p) ? p : (p.results ?? []));
        setCotizaciones(Array.isArray(c) ? c : (c.results ?? []));
      })
      .catch(() => {
        setPedidos([]);
        setCotizaciones([]);
      })
      .finally(() => setCargandoDatos(false));
  }, [accessToken]);

  const pedidosActivos = pedidos.filter((p) => p.estado !== "entregado" && p.estado !== "cancelado");
  const cotizacionesPendientes = cotizaciones.filter((c) => c.estado === "borrador" || c.estado === "enviada");
  const cotizacionesBorrador = cotizaciones.filter((c) => c.estado === "borrador");

  const totalDelMes = useCallback(
    (offsetMeses: number) => {
      const ahora = new Date();
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - offsetMeses, 1);
      return pedidos
        .filter((p) => {
          const f = new Date(p.creado_en);
          return f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear();
        })
        .reduce((acc, p) => acc + Number(p.total || 0), 0);
    },
    [pedidos]
  );

  const ingresosMes = useMemo(() => totalDelMes(0), [totalDelMes]);
  const ingresosMesPasado = useMemo(() => totalDelMes(1), [totalDelMes]);
  const variacionIngresos =
    ingresosMesPasado > 0 ? Math.round(((ingresosMes - ingresosMesPasado) / ingresosMesPasado) * 100) : null;

  const ingresosPorMes = useMemo(() => {
    const meses: { label: string; total: number }[] = [];
    const ahora = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      meses.push({ label: d.toLocaleDateString("es-CO", { month: "short" }), total: totalDelMes(i) });
    }
    return meses;
  }, [totalDelMes]);
  const maxIngreso = Math.max(1, ...ingresosPorMes.map((m) => m.total));

  const pedidosPorEstado = useMemo(() => {
    const conteo: Record<string, number> = {};
    pedidos.forEach((p) => {
      conteo[p.estado] = (conteo[p.estado] || 0) + 1;
    });
    return Object.entries(conteo).map(([estado, cantidad]) => ({ estado, cantidad }));
  }, [pedidos]);
  const totalPedidos = pedidos.length;

  const donutGradient = useMemo(() => {
    if (totalPedidos === 0) return "conic-gradient(#e5ddd0 0% 100%)";
    let acumulado = 0;
    const partes = pedidosPorEstado.map(({ estado, cantidad }) => {
      const inicio = (acumulado / totalPedidos) * 100;
      acumulado += cantidad;
      const fin = (acumulado / totalPedidos) * 100;
      return `${ESTADO_COLOR[estado] ?? "#9a9a9a"} ${inicio}% ${fin}%`;
    });
    return `conic-gradient(${partes.join(", ")})`;
  }, [pedidosPorEstado, totalPedidos]);

  const proximasEntregas = pedidos.filter((p) => p.estado === "en_camino").slice(0, 3);

  const actividadReciente = useMemo(() => {
    return pedidos
      .flatMap((p) => (p.eventos ?? []).map((e) => ({ ...e, pedido: p })))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 4);
  }, [pedidos]);

  const tareas = [
    cotizacionesBorrador.length > 0 && {
      titulo: `Envía ${cotizacionesBorrador.length} cotización${cotizacionesBorrador.length > 1 ? "es" : ""} en borrador`,
      texto: "Tus clientes están esperando tu propuesta.",
      href: "/proveedor/cotizaciones",
      prioridad: "Alta",
      icono: "icon-cotizaciones.png",
    },
    pedidos.some((p) => p.estado === "en_proceso") && {
      titulo: "Sube evidencias de trabajos en producción",
      texto: "Comparte fotos del avance de tus pedidos activos.",
      href: "/proveedor/evidencias",
      prioridad: "Media",
      icono: "icon-evidencias.png",
    },
    pedidos.some((p) => p.estado === "control_de_calidad" || p.estado === "en_camino") && {
      titulo: "Da seguimiento a tus pedidos en camino",
      texto: "Actualiza el estado cuando avancen de etapa.",
      href: "/proveedor/pedidos",
      prioridad: "Media",
      icono: "icon-truck.png",
    },
  ].filter(Boolean) as { titulo: string; texto: string; href: string; prioridad: string; icono: string }[];

  const ICONO_POR_ESTADO: Record<string, string> = {
    recibido: "icon-solicitudes.png",
    en_evaluacion: "icon-cotizaciones.png",
    en_proceso: "icon-configuracion.png",
    control_de_calidad: "icon-verificado.png",
    en_camino: "icon-truck.png",
    entregado: "icon-caja-ilustracion.png",
    cancelado: "icon-pedidos.png",
  };

  if (cargandoDatos || cargandoProveedor) {
    return <div className="min-h-[60vh]" />;
  }

  const stats = [
    { icono: "icon-solicitudes.png", numero: "0", label: "Solicitudes nuevas", nota: "Ver detalle →", notaColor: "text-borgona", href: "/proveedor/solicitudes" },
    { icono: "icon-cotizaciones.png", numero: String(cotizacionesPendientes.length), label: "Cotizaciones pendientes", nota: "Ver detalle →", notaColor: "text-borgona", href: "/proveedor/cotizaciones" },
    { icono: "icon-pedidos.png", numero: String(pedidosActivos.length), label: "Pedidos activos", nota: "Ver detalle →", notaColor: "text-borgona", href: "/proveedor/pedidos" },
    { icono: "icon-reloj-ilustracion.png", numero: "0", label: "Pedidos atrasados", nota: "Seguimiento de plazos próximamente", notaColor: "text-carbon/40", href: "/proveedor/pedidos" },
    {
      icono: "icon-ingresos.png",
      numero: formatoCOPCorto(ingresosMes),
      numeroCompleto: formatoCOP(ingresosMes),
      label: "Ingresos del mes",
      nota: variacionIngresos === null ? "Ver detalle →" : `${variacionIngresos >= 0 ? "↑" : "↓"} ${Math.abs(variacionIngresos)}% vs. mes pasado`,
      notaColor: variacionIngresos === null ? "text-borgona" : variacionIngresos >= 0 ? "text-emerald-700" : "text-borgona",
      href: "/proveedor/pedidos",
    },
    {
      icono: "icon-calificaciones.png",
      numero: proveedor ? Number(proveedor.calificacion).toFixed(1) : "0.0",
      label: "Calificación promedio",
      nota: "Ver detalle →",
      notaColor: "text-borgona",
      href: "/proveedor/pedidos",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute right-0 top-0 hidden h-32 w-64 md:block md:h-40 md:w-80">
          <Image src={`${ICONS}/dashboard-hero.png`} alt="" fill sizes="320px" className="object-contain object-right-top" unoptimized />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-10">
          <h1 className="inline-block font-display text-3xl text-carbon border-b-2 border-dorado-suave pb-1">
            Bienvenida, {nombre || "de nuevo"}
          </h1>
          <p className="mt-2 text-sm text-carbon/60">Aquí tienes un resumen de tu actividad y pendientes importantes.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div key={`${s.label}-${i}`} className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 block">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="56px" className="object-contain" unoptimized />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="font-display text-2xl text-carbon leading-tight truncate"
                title={"numeroCompleto" in s ? s.numeroCompleto : undefined}
              >
                {s.numero}
              </p>
              <p className="mt-0.5 text-xs text-carbon/60">{s.label}</p>
              {s.nota.includes("→") ? (
                <Link href={s.href} className={`mt-1 inline-block text-xs ${s.notaColor} hover:text-borgona-dark transition-colors`}>
                  {s.nota}
                </Link>
              ) : (
                <p className={`mt-1 text-[11px] ${s.notaColor}`}>{s.nota}</p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-carbon">Pedidos por estado</h3>
          {totalPedidos === 0 ? (
            <div className="mt-4 flex flex-col items-center text-center py-6">
              <span className="relative h-20 w-20 block opacity-70">
                <Image src={`${ICONS}/icon-caja-ilustracion.png`} alt="" fill sizes="80px" className="object-contain" unoptimized />
              </span>
              <p className="mt-3 text-sm text-carbon/60">Aún no tienes pedidos registrados.</p>
              <Link href="/proveedor/pedidos" className="mt-2 text-xs text-borgona hover:text-borgona-dark transition-colors">
                Ver cómo recibir tu primer pedido →
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-4 flex items-center gap-5">
                <div
                  className="relative h-28 w-28 shrink-0 rounded-full flex items-center justify-center"
                  style={{ background: donutGradient }}
                >
                  <span className="absolute inset-2 rounded-full bg-greige/20 flex flex-col items-center justify-center">
                    <span className="font-display text-lg text-carbon">{totalPedidos}</span>
                    <span className="text-[10px] text-carbon/50">Total</span>
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-carbon/75">
                  {pedidosPorEstado.map(({ estado, cantidad }) => (
                    <li key={estado} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: ESTADO_COLOR[estado] }} />
                      {cantidad} {ESTADO_LABEL[estado] ?? estado}
                      <span className="text-carbon/40">({Math.round((cantidad / totalPedidos) * 100)}%)</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/proveedor/pedidos" className="mt-4 inline-block text-xs text-borgona hover:text-borgona-dark transition-colors">
                Ver todos los pedidos →
              </Link>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-carbon">Ingresos mensuales</h3>
          {ingresosMes === 0 && ingresosPorMes.every((m) => m.total === 0) ? (
            <p className="mt-8 text-center text-sm text-carbon/60">Todavía no hay ingresos registrados.</p>
          ) : (
            <>
              <div className="mt-4 flex items-end gap-2">
                <div className="flex flex-col justify-between h-32 pb-4 pr-1 text-[9px] text-carbon/40 text-right">
                  <span>{formatoCOPCorto(maxIngreso)}</span>
                  <span>{formatoCOPCorto(maxIngreso / 2)}</span>
                  <span>$0</span>
                </div>
                {ingresosPorMes.map((m) => (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative h-32 w-full flex items-end">
                      <div
                        className={`w-full rounded-t ${m.total === maxIngreso && m.total > 0 ? "bg-dorado" : "bg-borgona/70"}`}
                        style={{ height: `${Math.max(4, (m.total / maxIngreso) * 100)}%` }}
                        title={formatoCOP(m.total)}
                      />
                    </div>
                    <span className="text-[10px] text-carbon/50">{m.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/proveedor/pedidos" className="mt-3 inline-block text-xs text-borgona hover:text-borgona-dark transition-colors">
                Ver reporte completo →
              </Link>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-carbon">Nivel de capacidad</h3>
          {proveedor && proveedor.capacidades.length > 0 ? (
            <div className="mt-4 flex items-center gap-5">
              <div
                className="relative h-24 w-24 shrink-0 rounded-full flex items-center justify-center"
                style={{ background: "conic-gradient(#5b1f2e 0% 100%)" }}
              >
                <span className="absolute inset-2 rounded-full bg-greige/20 flex flex-col items-center justify-center">
                  <span className="font-display text-xl text-carbon">{proveedor.capacidades.length}</span>
                </span>
              </div>
              <div className="text-sm text-carbon/70">
                <p className="text-carbon font-medium">Capacidad configurada</p>
                <p className="mt-1 text-xs text-carbon/55">
                  {proveedor.capacidades.length} {proveedor.capacidades.length === 1 ? "combinación" : "combinaciones"} de producto y material listas para recibir pedidos.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-5">
              <div
                className="relative h-24 w-24 shrink-0 rounded-full flex items-center justify-center"
                style={{ background: "conic-gradient(#e5ddd0 0% 100%)" }}
              >
                <span className="absolute inset-2 rounded-full bg-greige/20 flex flex-col items-center justify-center">
                  <span className="font-display text-xl text-carbon">0%</span>
                  <span className="text-[10px] text-carbon/50">Disponible</span>
                </span>
              </div>
              <p className="text-xs text-carbon/50">Aún no has configurado tu capacidad.</p>
            </div>
          )}
          <span
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-greige/60 px-3 py-1.5 text-xs text-carbon/40 cursor-default"
            title="Próximamente"
          >
            Administrar capacidad
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-carbon">Tareas prioritarias</h3>
          {tareas.length === 0 ? (
            <p className="mt-4 text-sm text-carbon/60">No tienes tareas pendientes por ahora.</p>
          ) : (
            <ul className="mt-3 space-y-1">
              {tareas.map((t) => (
                <li key={t.titulo}>
                  <Link href={t.href} className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/50 transition-colors">
                    <span className="relative h-9 w-9 shrink-0 block">
                      <Image src={`${ICONS}/${t.icono}`} alt="" fill sizes="36px" className="object-contain" unoptimized />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-carbon">{t.titulo}</p>
                      <p className="text-xs text-carbon/55">{t.texto}</p>
                    </div>
                    <span className="shrink-0 flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${PRIORIDAD_ESTILO[t.prioridad]}`}>
                        {t.prioridad}
                      </span>
                      <IconChevronRight className="h-4 w-4 text-carbon/30" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-carbon">Actividad reciente</h3>
          {actividadReciente.length === 0 ? (
            <div className="mt-4 flex flex-col items-center text-center py-4">
              <span className="relative h-16 w-16 block opacity-70">
                <Image src={`${ICONS}/icon-tareas.png`} alt="" fill sizes="64px" className="object-contain" unoptimized />
              </span>
              <p className="mt-2 text-sm text-carbon/60">Aquí aparecerá tu actividad reciente.</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {actividadReciente.map((e) => (
                <li key={e.id} className="flex items-start gap-2.5">
                  <span className="relative h-8 w-8 shrink-0 block">
                    <Image src={`${ICONS}/${ICONO_POR_ESTADO[e.estado] ?? "icon-pedidos.png"}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-carbon/80 truncate">
                      {tituloPedido(e.pedido)} <span className="text-carbon/40">→</span> {ESTADO_LABEL[e.estado] ?? e.estado}
                    </p>
                    <p className="text-xs text-carbon/40">{tiempoRelativo(e.fecha)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-carbon">Próximas entregas</h3>
          {proximasEntregas.length === 0 ? (
            <div className="mt-4 flex flex-col items-center text-center py-4">
              <span className="relative h-16 w-16 block opacity-70">
                <Image src={`${ICONS}/icon-calendario-ilustracion.png`} alt="" fill sizes="64px" className="object-contain" unoptimized />
              </span>
              <p className="mt-2 text-sm text-carbon/60">No tienes entregas programadas.</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {proximasEntregas.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5">
                  <span className="relative h-9 w-9 shrink-0 block">
                    <Image src={`${ICONS}/icon-truck.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-carbon/80 truncate">{tituloPedido(p)}</p>
                    <p className="text-xs text-carbon/45">{p.codigo}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-dorado-suave/20 px-2.5 py-1 text-[11px] text-borgona-dark">
                    {ESTADO_LABEL[p.estado] ?? p.estado}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

    </>
  );
}

export default function ProveedorDashboardPage() {
  return (
    <ProveedorShell activeHref="/proveedor/dashboard">
      <ContenidoDashboard />
    </ProveedorShell>
  );
}
