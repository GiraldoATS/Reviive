"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconMessage, IconClockAlert, IconAlertTriangle, IconCheckCircle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ResumenApi {
  abiertas: number;
  pendientes: number;
  criticas: number;
  corregidas: number;
  ejecuciones_totales: number;
}

export default function SupervisionResumenPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [resumen, setResumen] = useState<ResumenApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/supervision/resumen`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar el resumen.");
        return r.json();
      })
      .then(setResumen)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Resumen"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Bandeja de conversaciones</h1>
      <p className="text-sm text-carbon/55 mb-6">Monitorea, revisa y asegura conversaciones significativas.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!resumen && !error && <p className="text-sm text-carbon/50 mb-6">Cargando…</p>}

      {resumen && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard icon={<IconMessage className="h-5 w-5" />} value={String(resumen.abiertas)} label="Conversaciones activas" tone="rosa" />
          <StatCard icon={<IconClockAlert className="h-5 w-5" />} value={String(resumen.pendientes)} label="Pendientes" tone="dorado" />
          <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value={String(resumen.criticas)} label="Con riesgo emocional" tone="borgona" />
          <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(resumen.corregidas)} label="Ejemplos aprobados (dataset)" tone="verde" />
        </div>
      )}

      <Card>
        <p className="font-display text-lg text-borgona text-center italic">
          &ldquo;Cada conversación es un recuerdo en construcción.&rdquo;
        </p>
      </Card>
    </RolePortalShell>
  );
}
