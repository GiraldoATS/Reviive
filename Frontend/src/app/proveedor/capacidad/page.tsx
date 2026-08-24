"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { useProveedor } from "@/lib/ProveedorContext";
import { API_URL } from "@/lib/api";

const ICONS = "/images/proveedor";

// El modelo Proveedor no tiene hoy campos para "capacidad máxima",
// disponibilidad general ni fechas bloqueadas: no existe dónde
// guardarlos. Por eso el formulario de configuración y el calendario
// son visuales (permiten escribir/interactuar) pero no se guardan
// todavía. Sí son reales: los pedidos activos y proveedor.capacidades.

interface ResumenPedidoAPI {
  objeto?: string;
  historia?: string;
}
interface PedidoAPI {
  id: string;
  codigo: string;
  resumen: ResumenPedidoAPI | string | null;
  estado: string;
  creado_en: string;
}

function tituloPedido(p: PedidoAPI): string {
  if (typeof p.resumen === "string" && p.resumen) return p.resumen;
  if (p.resumen && typeof p.resumen === "object") {
    if (p.resumen.objeto) return p.resumen.objeto;
    if (p.resumen.historia) return p.resumen.historia;
  }
  return p.codigo;
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function ContenidoCapacidad() {
  const { accessToken } = useAuth();
  const { proveedor, cargandoProveedor } = useProveedor();
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  const [capacidadMaxima, setCapacidadMaxima] = useState(8);
  const [tiempoInicio, setTiempoInicio] = useState(3);
  const [tiempoEjecucion, setTiempoEjecucion] = useState("3 - 5");
  const [disponible, setDisponible] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPedidos(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => setPedidos([]))
      .finally(() => setCargandoPedidos(false));
  }, [accessToken]);

  const pedidosActivos = useMemo(
    () => pedidos.filter((p) => p.estado !== "entregado" && p.estado !== "cancelado"),
    [pedidos]
  );
  const cuposDisponibles = Math.max(0, capacidadMaxima - pedidosActivos.length);
  const ocupacionPct = capacidadMaxima > 0 ? Math.round((pedidosActivos.length / capacidadMaxima) * 100) : 0;
  const capacidadAlta = ocupacionPct >= 75;

  const hoy = useMemo(() => new Date(), []);
  const diasDelMes = useMemo(() => {
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth();
    const primerDia = new Date(anio, mes, 1);
    const inicioOffset = (primerDia.getDay() + 6) % 7; // lunes=0
    const totalDias = new Date(anio, mes + 1, 0).getDate();
    const celdas: (number | null)[] = Array(inicioOffset).fill(null);
    for (let d = 1; d <= totalDias; d++) celdas.push(d);
    while (celdas.length % 7 !== 0) celdas.push(null);
    return celdas;
  }, [hoy]);
  const nombreMes = hoy.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
  const diasBloqueados = [hoy.getDate() + 1, hoy.getDate() + 2].filter((d) => d <= diasDelMes.filter(Boolean).length);

  if (cargandoProveedor || cargandoPedidos) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-4">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Capacidad del taller</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Define cuántos trabajos puedes atender y mantén actualizada tu disponibilidad para recibir nuevas
              solicitudes.
            </p>
          </div>
          <div
            className="relative hidden lg:block h-48"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
            }}
          >
            <Image src={`${ICONS}/cap-hero.png`} alt="" fill sizes="26vw" className="object-contain" unoptimized />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 block">
            <Image src={`${ICONS}/cap-icon-hourglass.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <div className="min-w-0">
            <p className="font-display text-2xl text-carbon leading-tight">{capacidadMaxima}</p>
            <p className="mt-0.5 text-xs text-carbon/60">Capacidad máxima</p>
            <p className="text-[11px] text-carbon/45">pedidos simultáneos</p>
          </div>
        </div>
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 block">
            <Image src={`${ICONS}/cap-icon-pedidos-activos.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <div className="min-w-0">
            <p className="font-display text-2xl text-carbon leading-tight">{pedidosActivos.length}</p>
            <p className="mt-0.5 text-xs text-carbon/60">Pedidos activos</p>
            <p className="text-[11px] text-carbon/45">en proceso</p>
          </div>
        </div>
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 block">
            <Image src={`${ICONS}/cap-icon-cupos.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <div className="min-w-0">
            <p className="font-display text-2xl text-carbon leading-tight">{cuposDisponibles}</p>
            <p className="mt-0.5 text-xs text-carbon/60">Cupos disponibles</p>
            <p className="text-[11px] text-carbon/45">para nuevos pedidos</p>
          </div>
        </div>
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 block">
            <Image src={`${ICONS}/cap-icon-ocupacion.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <div className="min-w-0">
            <p className="font-display text-2xl text-carbon leading-tight">{ocupacionPct}%</p>
            <p className="mt-0.5 text-xs text-carbon/60">Ocupación actual</p>
            <p className="text-[11px] text-carbon/45">de tu capacidad</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid lg:grid-cols-[1fr_0.9fr] gap-5">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex items-center gap-6">
          <div
            className="relative h-28 w-28 shrink-0 rounded-full flex items-center justify-center"
            style={{ background: `conic-gradient(#c7a063 0% ${ocupacionPct}%, #e5ddd0 ${ocupacionPct}% 100%)` }}
          >
            <span className="absolute inset-2 rounded-full bg-greige/20 flex flex-col items-center justify-center">
              <span className="font-display text-xl text-carbon">{ocupacionPct}%</span>
              <span className="text-[10px] text-carbon/50">ocupado</span>
            </span>
          </div>
          <div>
            <p className="font-display text-lg text-carbon">
              {capacidadAlta ? "Tu capacidad está casi al límite." : "Tu capacidad está en buen nivel."}
            </p>
            <p className="mt-1 text-sm text-carbon/60">
              {cuposDisponibles > 0
                ? `Aún puedes aceptar ${cuposDisponibles} pedido${cuposDisponibles === 1 ? "" : "s"} adicional${cuposDisponibles === 1 ? "" : "es"}.`
                : "No tienes cupos disponibles por ahora."}
            </p>
            <span className="relative h-8 w-40 block mt-3">
              <Image src={`${ICONS}/cap-rama-horizontal.png`} alt="" fill sizes="160px" className="object-contain object-left" unoptimized />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
            <span className="relative h-12 w-12 shrink-0">
              <Image src={`${ICONS}/ped-icon-bulb.png`} alt="" fill sizes="48px" className="object-contain" unoptimized />
            </span>
            Consejo
          </h3>
          <p className="mt-2 text-sm text-carbon/70">
            Mantén tu capacidad actualizada para que podamos asignarte solicitudes acordes a tu disponibilidad.
          </p>
          <Link href="/preguntas-frecuentes" className="mt-2 inline-block text-sm text-borgona hover:text-borgona-dark transition-colors">
            Ver cómo funciona →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_0.9fr] gap-5 items-start">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-11 w-11 shrink-0">
                <Image src={`${ICONS}/cap-icon-configuracion.png`} alt="" fill sizes="44px" className="object-contain" unoptimized />
              </span>
              Configuración de capacidad
            </h3>
            <span className="text-[11px] text-carbon/40 italic">Próximamente: guardar cambios</span>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs text-carbon/60 mb-1.5">Máximo de pedidos simultáneos</span>
              <div className="flex items-center gap-2 rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5">
                <input
                  type="number"
                  min={1}
                  value={capacidadMaxima}
                  onChange={(e) => setCapacidadMaxima(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <span className="text-xs text-carbon/45 shrink-0">pedidos</span>
              </div>
            </label>
            <label className="block">
              <span className="block text-xs text-carbon/60 mb-1.5">Tiempo promedio para iniciar un nuevo trabajo</span>
              <div className="flex items-center gap-2 rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5">
                <input
                  type="number"
                  min={0}
                  value={tiempoInicio}
                  onChange={(e) => setTiempoInicio(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <span className="text-xs text-carbon/45 shrink-0">días</span>
              </div>
            </label>
            <label className="block">
              <span className="block text-xs text-carbon/60 mb-1.5">Tiempo promedio de ejecución</span>
              <div className="flex items-center gap-2 rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5">
                <input
                  type="text"
                  value={tiempoEjecucion}
                  onChange={(e) => setTiempoEjecucion(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <span className="text-xs text-carbon/45 shrink-0">semanas</span>
              </div>
            </label>
            <div>
              <span className="block text-xs text-carbon/60 mb-1.5">¿Actualmente recibes nuevas solicitudes?</span>
              <button
                type="button"
                onClick={() => setDisponible((v) => !v)}
                className="flex items-center gap-3 rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5 w-full"
              >
                <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${disponible ? "bg-emerald-500" : "bg-greige/60"}`}>
                  <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${disponible ? "translate-x-4" : "translate-x-0"}`} />
                </span>
                <span className="text-sm text-carbon/70 text-left truncate">
                  {disponible ? "Sí, estoy disponible" : "No, no estoy disponible"}
                </span>
              </button>
              <p className="mt-1.5 text-[11px] text-carbon/45">
                {disponible ? "Los clientes podrán enviarte solicitudes." : "No recibirás nuevas solicitudes."}
              </p>
            </div>
          </div>

          <h4 className="mt-6 text-sm font-medium text-carbon">Disponibilidad por tipo de servicio</h4>
          {proveedor && proveedor.capacidades.length > 0 ? (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-carbon/50">
                    <th className="pb-2 pr-4">Material</th>
                    <th className="pb-2 pr-4">Ciudad</th>
                    <th className="pb-2">Tiempo estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedor.capacidades.map((c) => (
                    <tr key={c.id} className="border-t border-greige/40">
                      <td className="py-2 pr-4 text-carbon/80">{c.material}</td>
                      <td className="py-2 pr-4 text-carbon/70">{c.ciudad}</td>
                      <td className="py-2 text-carbon/70">{c.tiempo_estimado_dias} días</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-sm text-carbon/50">Aún no has configurado combinaciones de producto y material.</p>
          )}

          <p className="mt-4 inline-flex items-start gap-2 text-xs text-carbon/50">
            <span className="relative h-4 w-4 shrink-0 mt-0.5">
              <Image src={`${ICONS}/cap-icon-servicios.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
            </span>
            Los pedidos activos consumen capacidad hasta que el estado del pedido cambie a &ldquo;Entregado&rdquo;.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-7 w-7 shrink-0">
                <Image src={`${ICONS}/cap-icon-calendario.png`} alt="" fill sizes="28px" className="object-contain" unoptimized />
              </span>
              Calendario de disponibilidad
            </h3>
            <p className="mt-2 text-sm text-carbon capitalize">{nombreMes}</p>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
              {DIAS_SEMANA.map((d) => (
                <span key={d} className="text-carbon/40 pb-1">{d}</span>
              ))}
              {diasDelMes.map((d, i) => {
                const esHoy = d === hoy.getDate();
                const bloqueado = d !== null && diasBloqueados.includes(d);
                return (
                  <span
                    key={i}
                    className={`h-7 flex items-center justify-center rounded-full ${
                      d === null
                        ? ""
                        : esHoy
                          ? "bg-borgona text-marfil"
                          : bloqueado
                            ? "bg-rosa/40 text-borgona-dark"
                            : "text-carbon/70"
                    }`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
            {diasBloqueados.length > 0 && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/60 p-3 text-xs text-carbon/60">
                <span className="relative h-5 w-5 shrink-0">
                  <Image src={`${ICONS}/cap-icon-no-disponible-taller.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
                </span>
                Ejemplo: periodo marcado como no disponible.
              </div>
            )}
            <span
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-greige/60 px-4 py-2 text-xs text-carbon/40 cursor-default"
              title="Próximamente"
            >
              + Agregar periodo no disponible
            </span>
          </div>

          {capacidadAlta && (
            <div className="rounded-2xl border border-dorado-suave/40 bg-dorado-suave/10 p-5">
              <h3 className="inline-flex items-center gap-2 font-display text-base text-borgona-dark">
                <span className="relative h-6 w-6 shrink-0">
                  <Image src={`${ICONS}/cap-icon-alerta.png`} alt="" fill sizes="24px" className="object-contain" unoptimized />
                </span>
                Capacidad alta
              </h3>
              <p className="mt-2 text-sm text-carbon/70">
                Tienes {pedidosActivos.length} de {capacidadMaxima} cupos ocupados. Considera ajustar tu
                disponibilidad antes de aceptar nuevas solicitudes.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pb-16">
        <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
          <span className="relative h-7 w-7 shrink-0">
            <Image src={`${ICONS}/cap-icon-pedidos.png`} alt="" fill sizes="28px" className="object-contain" unoptimized />
          </span>
          Ocupación actual
        </h3>
        {pedidosActivos.length === 0 ? (
          <p className="mt-3 text-sm text-carbon/60">No tienes pedidos activos en este momento.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {pedidosActivos.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-greige/20 border border-greige/50 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-carbon">#{p.codigo} · {tituloPedido(p)}</p>
                </div>
                <span className="shrink-0 text-xs text-carbon/45">Registrado: {fechaCorta(p.creado_en)}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/proveedor/pedidos" className="mt-3 inline-block text-sm text-borgona hover:text-borgona-dark transition-colors">
          Ver todos mis pedidos →
        </Link>
      </section>
    </>
  );
}

export default function CapacidadPage() {
  return (
    <ProveedorShell activeHref="/proveedor/capacidad">
      <ContenidoCapacidad />
    </ProveedorShell>
  );
}
