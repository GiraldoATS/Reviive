"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconBox, IconUsers, IconWallet, IconAlertTriangle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface DashboardApi {
  pedidos_totales: number;
  en_proceso: number;
  entregados: number;
  nuevos_clientes: number;
  pedidos_por_estado: { estado: string; total: number }[];
  tendencia_pedidos: { dia: string; total: number }[];
}

const COLOR_POR_ESTADO: Record<string, string> = {
  recibido: "var(--color-greige)",
  en_evaluacion: "var(--color-greige)",
  en_proceso: "var(--color-borgona)",
  control_de_calidad: "var(--color-dorado)",
  en_camino: "var(--color-dorado)",
  entregado: "#3f5c2b",
  cancelado: "var(--color-rosa)",
};

const LABEL_POR_ESTADO: Record<string, string> = {
  recibido: "Recibidos",
  en_evaluacion: "En evaluación",
  en_proceso: "En proceso",
  control_de_calidad: "Control de calidad",
  en_camino: "En camino",
  entregado: "Entregados",
  cancelado: "Cancelados",
};

function conicGradient(estados: { estado: string; total: number }[], total: number) {
  if (!total) return "var(--color-greige)";
  let acc = 0;
  const parts = estados.map((e) => {
    const start = (acc / total) * 360;
    acc += e.total;
    const end = (acc / total) * 360;
    return `${COLOR_POR_ESTADO[e.estado] ?? "var(--color-greige)"} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${parts.join(", ")})`;
}

export default function DashboardAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [datos, setDatos] = useState<DashboardApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el resumen.");
        return res.json();
      })
      .then(setDatos)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const totalEstados = datos?.pedidos_por_estado.reduce((acc, e) => acc + e.total, 0) ?? 0;
  const maxTendencia = Math.max(1, ...(datos?.tendencia_pedidos.map((t) => t.total) ?? [1]));
  const puntos =
    datos?.tendencia_pedidos
      .map((t, i, arr) => `${(i / Math.max(1, arr.length - 1)) * 100},${100 - (t.total / maxTendencia) * 100}`)
      .join(" ") ?? "";

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Resumen"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-dorado-suave">Bienvenido de vuelta</p>
          <h1 className="font-display text-2xl text-carbon">Resumen general</h1>
        </div>
        <span className="rounded-full border border-greige/70 px-4 py-1.5 text-xs text-carbon/60">
          Últimos 7 días
        </span>
      </div>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!datos && !error && <p className="text-sm text-carbon/50 mb-6">Cargando resumen…</p>}

      {datos && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<IconBox className="h-5 w-5" />} value={String(datos.pedidos_totales)} label="Pedidos totales" tone="rosa" />
            <StatCard icon={<IconWallet className="h-5 w-5" />} value={String(datos.en_proceso)} label="En proceso" tone="dorado" />
            <StatCard icon={<IconUsers className="h-5 w-5" />} value={String(datos.entregados)} label="Entregados" tone="verde" />
            <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value={String(datos.nuevos_clientes)} label="Nuevos clientes (7 días)" tone="borgona" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h2 className="font-display text-lg text-carbon mb-4">Pedidos por estado</h2>
              {totalEstados === 0 ? (
                <p className="text-sm text-carbon/50">Todavía no hay pedidos registrados.</p>
              ) : (
                <div className="flex items-center gap-8">
                  <div
                    className="relative h-36 w-36 rounded-full shrink-0"
                    style={{ background: conicGradient(datos.pedidos_por_estado, totalEstados) }}
                  >
                    <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="font-display text-xl text-carbon">{totalEstados}</span>
                      <span className="text-[10px] text-carbon/50">Total</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {datos.pedidos_por_estado.map((e) => (
                      <li key={e.estado} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLOR_POR_ESTADO[e.estado] ?? "var(--color-greige)" }} />
                        <span className="text-carbon/70">{LABEL_POR_ESTADO[e.estado] ?? e.estado}</span>
                        <span className="text-carbon/45 text-xs">{e.total}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <Card>
              <h2 className="font-display text-lg text-carbon mb-4">Tendencia de pedidos (7 días)</h2>
              {datos.tendencia_pedidos.length === 0 ? (
                <p className="text-sm text-carbon/50">Sin pedidos nuevos en los últimos 7 días.</p>
              ) : (
                <>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-36 w-full">
                    <polyline
                      points={puntos}
                      fill="none"
                      stroke="var(--color-borgona)"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="flex justify-between text-[10px] text-carbon/40 mt-2">
                    {datos.tendencia_pedidos.map((t) => (
                      <span key={t.dia}>{t.dia.slice(5)}</span>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </RolePortalShell>
  );
}
