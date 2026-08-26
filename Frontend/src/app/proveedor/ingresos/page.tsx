"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const ICONS = "/images/proveedor";

interface PagoApi {
  id: number;
  pedido_codigo: string;
  monto_bruto: string;
  comision_pct: string;
  monto_neto: string;
  estado: "pendiente" | "pagado";
  fecha_estimada: string | null;
  fecha_pago: string | null;
  creado_en: string;
}

const ESTADO_FIN: Record<string, { label: string; clase: string }> = {
  pendiente: { label: "Pendiente de pago", clase: "bg-dorado-suave/20 text-borgona-dark" },
  pagado: { label: "Pagado", clase: "bg-emerald-50 text-emerald-700" },
};

const pasos = [
  { icono: "ing-icon-atm.png", titulo: "Cliente paga", texto: "El cliente realiza el pago por el servicio." },
  { icono: "ped-icon-shield.png", titulo: "Pago confirmado", texto: "Reviive confirma el pago y asegura los recursos." },
  { icono: "ped-icon-wrench.png", titulo: "Trabajo realizado", texto: "Completas el trabajo según lo acordado." },
  { icono: "ped-icon-box.png", titulo: "Entrega confirmada", texto: "Reviive verifica que el cliente recibió su objeto." },
  { icono: "ing-icon-coin.png", titulo: "Ingreso disponible", texto: "El valor queda disponible para desembolso." },
  { icono: "ing-icon-bank.png", titulo: "Pago al proveedor", texto: "Reviive realiza el desembolso, menos la comisión del taller." },
];

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function ContenidoIngresos() {
  const { accessToken } = useAuth();
  const [pagos, setPagos] = useState<PagoApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API_URL}/payments/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setPagos(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError("No se pudieron cargar los ingresos."));
  }, [accessToken]);

  const generado = useMemo(() => (pagos ?? []).reduce((acc, p) => acc + Number(p.monto_neto), 0), [pagos]);
  const pendiente = useMemo(
    () => (pagos ?? []).filter((p) => p.estado === "pendiente").reduce((acc, p) => acc + Number(p.monto_neto), 0),
    [pagos]
  );
  const pagado = useMemo(
    () => (pagos ?? []).filter((p) => p.estado === "pagado").reduce((acc, p) => acc + Number(p.monto_neto), 0),
    [pagos]
  );

  const ingresosPorMes = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const p of pagos ?? []) {
      const clave = p.creado_en.slice(0, 7);
      mapa.set(clave, (mapa.get(clave) ?? 0) + Number(p.monto_neto));
    }
    return Array.from(mapa.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, valor]) => ({ mes, valor }));
  }, [pagos]);
  const maxIngreso = Math.max(1, ...ingresosPorMes.map((m) => m.valor));

  if (!pagos && !error) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:pl-16">
          <h1 className="font-display text-4xl text-borgona">Ingresos</h1>
          <p className="mt-1 text-sm text-carbon/70 max-w-md">
            Consulta los valores generados por tus trabajos, pagos pendientes y desembolsos realizados por Reviive.
          </p>
        </div>
      </section>

      {error && <p className="mx-auto max-w-6xl px-6 pt-6 text-sm text-borgona">{error}</p>}

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
          <span className="relative h-11 w-11 block">
            <Image src={`${ICONS}/ing-icon-coin.png`} alt="" fill sizes="44px" className="object-contain" unoptimized />
          </span>
          <p className="mt-2 font-display text-xl text-carbon">{formatoCOP(generado)}</p>
          <p className="mt-0.5 text-xs text-carbon/60">Ingresos generados (neto, tras comisión)</p>
        </div>
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
          <span className="relative h-11 w-11 block">
            <Image src={`${ICONS}/ing-icon-download-circle.png`} alt="" fill sizes="44px" className="object-contain" unoptimized />
          </span>
          <p className="mt-2 font-display text-xl text-carbon">{formatoCOP(pendiente)}</p>
          <p className="mt-0.5 text-xs text-carbon/60">Pendiente de pago</p>
        </div>
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
          <span className="relative h-11 w-11 block">
            <Image src={`${ICONS}/ing-icon-wallet.png`} alt="" fill sizes="44px" className="object-contain" unoptimized />
          </span>
          <p className="mt-2 font-display text-xl text-carbon">{formatoCOP(pagado)}</p>
          <p className="mt-0.5 text-xs text-carbon/60">Ya pagado</p>
        </div>
      </section>

      {ingresosPorMes.length > 0 && (
        <section className="mx-auto max-w-6xl w-full px-6 py-8">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Ingresos por mes</h3>
            <div className="mt-6 flex items-end gap-2 h-40">
              {ingresosPorMes.map((m) => (
                <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative h-32 w-full flex items-end">
                    <div className="w-full rounded-t bg-borgona" style={{ height: `${(m.valor / maxIngreso) * 100}%` }} title={formatoCOP(m.valor)} />
                  </div>
                  <span className="text-[10px] text-carbon/50">{m.mes}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl w-full px-6 py-8">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-borgona">Movimientos</h3>
          {!pagos || pagos.length === 0 ? (
            <p className="mt-6 text-center text-sm text-carbon/50">Todavía no tienes movimientos registrados.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-carbon/50">
                    <th className="pb-2 pr-3">Pedido</th>
                    <th className="pb-2 pr-3">Bruto</th>
                    <th className="pb-2 pr-3">Comisión</th>
                    <th className="pb-2 pr-3">Neto</th>
                    <th className="pb-2 pr-3">Estado</th>
                    <th className="pb-2 pr-3">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((p) => {
                    const info = ESTADO_FIN[p.estado];
                    return (
                      <tr key={p.id} className="border-t border-greige/40">
                        <td className="py-3 pr-3 text-carbon/80">{p.pedido_codigo}</td>
                        <td className="py-3 pr-3 text-carbon/60">{formatoCOP(Number(p.monto_bruto))}</td>
                        <td className="py-3 pr-3 text-carbon/50">{p.comision_pct}%</td>
                        <td className="py-3 pr-3 text-carbon/80 font-medium">{formatoCOP(Number(p.monto_neto))}</td>
                        <td className="py-3 pr-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs whitespace-nowrap ${info.clase}`}>{info.label}</span>
                        </td>
                        <td className="py-3 pr-3 text-carbon/50 whitespace-nowrap">
                          {p.fecha_pago ? fechaCorta(p.fecha_pago) : p.fecha_estimada ? `Estimado: ${fechaCorta(p.fecha_estimada)}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
              <p className="text-sm font-medium text-carbon">{i + 1}. {p.titulo}</p>
              <p className="text-xs text-carbon/55">{p.texto}</p>
            </div>
          ))}
        </div>
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
