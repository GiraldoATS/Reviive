"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconBox, IconWallet, IconWallet as IconTicket, IconStar } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface DashboardApi {
  pedidos_totales: number;
  ingresos_totales: number;
  ticket_promedio: number;
  tendencia_pedidos: { dia: string; total: number }[];
}

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

export default function ReportesAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [datos, setDatos] = useState<DashboardApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el reporte.");
        return res.json();
      })
      .then(setDatos)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const maxTendencia = Math.max(1, ...(datos?.tendencia_pedidos.map((t) => t.total) ?? [1]));
  const puntos =
    datos?.tendencia_pedidos
      .map((t, i, arr) => `${(i / Math.max(1, arr.length - 1)) * 100},${100 - (t.total / maxTendencia) * 100}`)
      .join(" ") ?? "";

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Reportes"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Reportes y analítica</h1>
          <p className="text-sm text-carbon/55">Visualiza métricas clave del negocio.</p>
        </div>
        <span className="rounded-full border border-greige/70 px-4 py-1.5 text-xs text-carbon/60">Últimos 7 días</span>
      </div>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!datos && !error && <p className="text-sm text-carbon/50 mb-6">Cargando reporte…</p>}

      {datos && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard icon={<IconBox className="h-5 w-5" />} value={String(datos.pedidos_totales)} label="Pedidos totales" tone="rosa" />
            <StatCard icon={<IconWallet className="h-5 w-5" />} value={formatoCOP(datos.ingresos_totales)} label="Ingresos totales" tone="dorado" />
            <StatCard icon={<IconTicket className="h-5 w-5" />} value={formatoCOP(datos.ticket_promedio)} label="Ticket promedio" tone="verde" />
            <StatCard icon={<IconStar className="h-5 w-5" />} value="—" label="Índice de satisfacción (aún sin reseñas)" tone="greige" />
          </div>

          <Card>
            <h2 className="font-display text-lg text-carbon mb-4">Pedidos por día (7 días)</h2>
            {datos.tendencia_pedidos.length === 0 ? (
              <p className="text-sm text-carbon/50">Sin pedidos nuevos en los últimos 7 días.</p>
            ) : (
              <>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
                  <polyline points={puntos} fill="none" stroke="var(--color-borgona)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="flex justify-between text-[10px] text-carbon/40 mt-2">
                  {datos.tendencia_pedidos.map((t) => (
                    <span key={t.dia}>{t.dia.slice(5)}</span>
                  ))}
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </RolePortalShell>
  );
}
