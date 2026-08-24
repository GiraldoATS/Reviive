"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";

const ICONS = "/images/proveedor";

// No existe ningún modelo real de pagos/desembolsos en el backend (no
// hay Pago, Transaccion, CuentaBancaria, ni un estado financiero por
// pedido más allá de Pedido.total y Pedido.estado). Por eso, igual que
// Calificaciones, Solicitudes y Evidencias, esta vista muestra el
// diseño del prototipo con datos de ejemplo, para validar la visual.

const stats = [
  { icono: "ing-icon-coin.png", numero: "$4.850.000", label: "Ingresos generados", nota: "Valor total asociado a trabajos realizados." },
  { icono: "ing-icon-download-circle.png", numero: "$1.200.000", label: "Pendiente de liberar", nota: "Pedidos que aún no cumplen las condiciones para pago." },
  { icono: "ing-icon-coins-stack.png", numero: "$850.000", label: "Disponible para pago", nota: "Valor que ya puede ser desembolsado." },
  { icono: "ing-icon-wallet.png", numero: "$2.800.000", label: "Pagado", nota: "Dinero ya transferido a tu cuenta." },
  { icono: "cal-icon-clipboard.png", numero: "3", label: "Movimientos pendientes", nota: "Transacciones que requieren cierre." },
];

const PERIODOS = ["Este mes", "Últimos 3 meses", "Este año", "Personalizado"] as const;

const ingresosPorMes = [
  { mes: "Ene", valor: 750000 },
  { mes: "Feb", valor: 780000 },
  { mes: "Mar", valor: 920000 },
  { mes: "Abr", valor: 980000 },
  { mes: "May", valor: 1000000 },
  { mes: "Jun", valor: 1600000 },
  { mes: "Jul", valor: 850000 },
  { mes: "Ago", valor: 1450000 },
];

const ESTADO_FIN: Record<string, { label: string; clase: string }> = {
  disponible: { label: "Disponible para pago", clase: "bg-emerald-50 text-emerald-700" },
  pendiente_cierre: { label: "Pendiente de cierre", clase: "bg-dorado-suave/20 text-borgona-dark" },
  pagado: { label: "Pagado", clase: "bg-greige/50 text-carbon/70" },
  programado: { label: "Pago programado", clase: "bg-rosa/40 text-borgona-dark" },
  con_novedad: { label: "Con novedad", clase: "bg-red-50 text-red-700" },
};

const filtrosEstado = ["Todos los estados", "Disponible para pago", "Pendiente de cierre", "Pagado", "Pago programado", "Con novedad"];

interface MovimientoEjemplo {
  id: string;
  codigo: string;
  objeto: string;
  icono: string;
  valor: number;
  estado: keyof typeof ESTADO_FIN;
  fecha: string;
}

const MOVIMIENTOS: MovimientoEjemplo[] = [
  { id: "1", codigo: "PED-00128", objeto: "Reloj de bolsillo familiar", icono: "sol-icon-clock.png", valor: 850000, estado: "disponible", fecha: "23 ago 2026" },
  { id: "2", codigo: "PED-00127", objeto: "Álbum de fotos antiguo", icono: "icon-evidencias.png", valor: 620000, estado: "pendiente_cierre", fecha: "21 ago 2026" },
  { id: "3", codigo: "PED-00126", objeto: "Baúl de madera heredado", icono: "sol-icon-caja.png", valor: 1200000, estado: "pagado", fecha: "18 ago 2026" },
  { id: "4", codigo: "PED-00123", objeto: "Cuadro al óleo antiguo", icono: "cal-icon-heart.png", valor: 980000, estado: "programado", fecha: "16 ago 2026" },
  { id: "5", codigo: "PED-00119", objeto: "Escultura de bronce", icono: "ped-icon-shield.png", valor: 750000, estado: "con_novedad", fecha: "12 ago 2026" },
];

const historialPagos = [
  { fecha: "28 jul 2026", valor: 1250000 },
  { fecha: "15 jul 2026", valor: 850000 },
  { fecha: "30 jun 2026", valor: 620000 },
];

const pasos = [
  { icono: "ing-icon-atm.png", titulo: "Cliente paga", texto: "El cliente realiza el pago por el servicio." },
  { icono: "ped-icon-shield.png", titulo: "Pago confirmado", texto: "Reviive confirma el pago y asegura los recursos." },
  { icono: "ped-icon-wrench.png", titulo: "Trabajo realizado", texto: "Completas el trabajo según lo acordado." },
  { icono: "ped-icon-box.png", titulo: "Entrega confirmada", texto: "Reviive verifica que el cliente recibió su objeto." },
  { icono: "ing-icon-coin.png", titulo: "Ingreso disponible", texto: "El valor queda disponible para desembolso." },
  { icono: "ing-icon-bank.png", titulo: "Pago al proveedor", texto: "Reviive realiza el desembolso a tu cuenta." },
];

const estadosFinancieros = [
  { icono: "ing-icon-warning.png", titulo: "Pendiente de pago", texto: "Reviive aún no ha confirmado el pago del cliente." },
  { icono: "ped-icon-check.png", titulo: "Pago confirmado", texto: "El cliente ya pagó y Reviive confirmó el recibo." },
  { icono: "ing-icon-calendar-check.png", titulo: "Pendiente de cumplimiento", texto: "Faltan pasos para finalizar el pedido." },
  { icono: "ing-icon-download-circle.png", titulo: "Disponible para pago", texto: "Se cumplieron las condiciones. Listo para desembolso." },
  { icono: "ing-icon-calendar-check.png", titulo: "Pago programado", texto: "Reviive programó el desembolso." },
  { icono: "ing-icon-wallet.png", titulo: "Pagado", texto: "El dinero fue transferido a tu cuenta." },
  { icono: "ing-icon-warning.png", titulo: "Con novedad", texto: "Existe alguna observación financiera por revisar." },
];

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function ContenidoIngresos() {
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]>("Este año");
  const [filtroEstado, setFiltroEstado] = useState(filtrosEstado[0]);

  const visibles = useMemo(() => {
    if (filtroEstado === "Todos los estados") return MOVIMIENTOS;
    return MOVIMIENTOS.filter((m) => ESTADO_FIN[m.estado].label === filtroEstado);
  }, [filtroEstado]);

  const maxIngreso = Math.max(...ingresosPorMes.map((m) => m.valor));

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-4">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Ingresos</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Consulta los valores generados por tus trabajos, pagos pendientes y desembolsos realizados por Reviive.
            </p>
          </div>
          <div
            className="relative hidden lg:block h-48 w-48 mx-auto"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
            }}
          >
            <Image src={`${ICONS}/ing-hero.png`} alt="" fill sizes="192px" className="object-cover" unoptimized />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
            <span className="relative h-11 w-11 block">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="44px" className="object-contain" unoptimized />
            </span>
            <p className="mt-2 font-display text-xl text-carbon">{s.numero}</p>
            <p className="mt-0.5 text-xs text-carbon/60">{s.label}</p>
            <p className="mt-1 text-[11px] text-carbon/40">{s.nota}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-base text-borgona">Ingresos mensuales</h3>
            <div className="flex flex-wrap gap-1.5">
              {PERIODOS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriodo(p)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    periodo === p ? "bg-borgona text-marfil" : "bg-white/60 text-carbon/60 hover:bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-end gap-2">
            <div className="flex flex-col justify-between h-40 pb-4 pr-1 text-[10px] text-carbon/40 text-right">
              <span>$2M</span>
              <span>$1.5M</span>
              <span>$1M</span>
              <span>$500k</span>
              <span>$0</span>
            </div>
            {ingresosPorMes.map((m) => (
              <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative h-40 w-full flex items-end">
                  <div
                    className="w-full rounded-t bg-borgona"
                    style={{ height: `${(m.valor / (maxIngreso * 1.3)) * 100}%` }}
                    title={formatoCOP(m.valor)}
                  />
                </div>
                <span className="text-[10px] text-carbon/50">{m.mes}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-carbon/40">Valores en COP (Pesos colombianos)</p>
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-borgona">Próximo desembolso</h3>
          <p className="mt-3 font-display text-2xl text-carbon">$1.450.000</p>
          <p className="text-xs text-carbon/50">Fecha estimada: 28 agosto 2026</p>
          <p className="mt-3 text-xs text-carbon/60">Incluye:</p>
          <ul className="mt-1 space-y-1 text-xs text-carbon/70">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-dorado-suave shrink-0" /> PED-00128 · $850.000
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-dorado-suave shrink-0" /> PED-00130 · $600.000
            </li>
          </ul>
          <span
            className="mt-4 inline-flex items-center justify-center rounded-full border border-borgona text-borgona px-4 py-2 text-sm w-full cursor-default"
            title="Próximamente"
          >
            Ver detalle
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-base text-borgona">Movimientos</h3>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="rounded-xl border border-greige/70 bg-white/70 px-3 py-1.5 text-xs text-carbon/70 outline-none focus:border-borgona/50"
              >
                {filtrosEstado.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {visibles.length === 0 ? (
              <p className="mt-6 text-center text-sm text-carbon/50">No hay movimientos con este estado.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-carbon/50">
                      <th className="pb-2 pr-3">Pedido</th>
                      <th className="pb-2 pr-3">Objeto</th>
                      <th className="pb-2 pr-3">Valor</th>
                      <th className="pb-2 pr-3">Estado financiero</th>
                      <th className="pb-2 pr-3">Fecha</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibles.map((m) => {
                      const info = ESTADO_FIN[m.estado];
                      return (
                        <tr key={m.id} className="border-t border-greige/40">
                          <td className="py-3 pr-3 text-carbon/80">{m.codigo}</td>
                          <td className="py-3 pr-3">
                            <span className="flex items-center gap-2">
                              <span className="relative h-8 w-8 shrink-0 rounded-lg bg-white/70 flex items-center justify-center overflow-hidden">
                                <span className="relative h-4 w-4 block">
                                  <Image src={`${ICONS}/${m.icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                                </span>
                              </span>
                              <span className="text-carbon/80">{m.objeto}</span>
                            </span>
                          </td>
                          <td className="py-3 pr-3 text-carbon/80">{formatoCOP(m.valor)}</td>
                          <td className="py-3 pr-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs whitespace-nowrap ${info.clase}`}>{info.label}</span>
                          </td>
                          <td className="py-3 pr-3 text-carbon/50 whitespace-nowrap">{m.fecha}</td>
                          <td className="py-3 text-right">
                            <span className="text-xs text-borgona cursor-default" title="Próximamente">Ver detalle →</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <span className="mt-4 inline-block text-sm text-borgona cursor-default" title="Próximamente">
              Ver todos los movimientos →
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-borgona">Historial de pagos</h3>
              <span className="text-xs text-carbon/40 cursor-default" title="Próximamente">Ver todos</span>
            </div>
            <ul className="mt-3 space-y-2.5">
              {historialPagos.map((h) => (
                <li key={h.fecha} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>
                      <span className="block text-carbon/80">{h.fecha}</span>
                      <span className="block text-xs text-carbon/45">{formatoCOP(h.valor)}</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-greige/40 text-carbon/60 px-2.5 py-1 text-xs">Pagado</span>
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-borgona text-borgona cursor-default"
                      title="Próximamente"
                    >
                      ↓
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <span
              className="mt-3 inline-flex items-center justify-center rounded-full border border-borgona text-borgona px-4 py-2 text-sm w-full cursor-default"
              title="Próximamente"
            >
              Ver todos los pagos
            </span>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Cuenta para recibir pagos</h3>
            <div className="mt-3 flex items-start gap-3">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS}/ing-icon-bank.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              <ul className="text-xs text-carbon/70 space-y-1">
                <li>Banco: <span className="text-carbon">Bancolombia</span></li>
                <li>Tipo de cuenta: <span className="text-carbon">Ahorros</span></li>
                <li>Cuenta: <span className="text-carbon">**** 4582</span></li>
                <li>Titular: <span className="text-carbon">Artesanía El Recuerdo</span></li>
              </ul>
            </div>
            <span
              className="mt-3 inline-flex items-center justify-center rounded-full bg-borgona text-marfil px-4 py-2 text-sm w-full cursor-default"
              title="Próximamente"
            >
              Administrar información de pago
            </span>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Reportes de ingresos</h3>
            <p className="mt-2 text-xs text-carbon/60">Genera y descarga reportes de ingresos y movimientos en el periodo que necesites.</p>
            <div className="mt-3 rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5 text-xs text-carbon/70">
              01 ago 2026 – 31 ago 2026
            </div>
            <span
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-borgona text-borgona px-4 py-2 text-sm w-full cursor-default"
              title="Próximamente"
            >
              ↓ Descargar reporte de ingresos
            </span>
            <span
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-borgona text-borgona px-4 py-2 text-sm w-full cursor-default"
              title="Próximamente"
            >
              ↓ Descargar comprobantes de pago
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pb-16">
        <h3 className="font-display text-lg text-borgona">¿Cómo funciona el flujo de pagos?</h3>
        <div className="mt-5 grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {pasos.map((p, i) => (
            <div key={p.titulo} className="flex flex-col items-center text-center gap-2">
              <span className="relative h-14 w-14 shrink-0 rounded-full bg-white/70 flex items-center justify-center">
                <span className="relative h-7 w-7 block">
                  <Image src={`${ICONS}/${p.icono}`} alt="" fill sizes="28px" className="object-contain" unoptimized />
                </span>
              </span>
              <p className="text-sm font-medium text-carbon">
                {i + 1}. {p.titulo}
              </p>
              <p className="text-xs text-carbon/55">{p.texto}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-10 font-display text-lg text-borgona">Estados financieros</h3>
        <div className="mt-5 grid sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {estadosFinancieros.map((e) => (
            <div key={e.titulo} className="flex flex-col items-center text-center gap-2">
              <span className="relative h-12 w-12 shrink-0 rounded-full bg-white/70 flex items-center justify-center">
                <span className="relative h-6 w-6 block">
                  <Image src={`${ICONS}/${e.icono}`} alt="" fill sizes="24px" className="object-contain" unoptimized />
                </span>
              </span>
              <p className="text-xs font-medium text-carbon">{e.titulo}</p>
              <p className="text-[11px] text-carbon/50">{e.texto}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-carbon/45">
          Nota: Los tiempos de desembolso pueden variar según el cumplimiento de los requisitos y los procesos de
          validación.
        </p>
      </section>
    </>
  );
}

export default function IngresosPage() {
  return (
    <ProveedorShell activeHref="/proveedor/ingresos">
      <ContenidoIngresos />
    </ProveedorShell>
  );
}
