"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconSparkle, IconCheckCircle, IconStar } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface AgenteApi {
  agente: string;
  agente_display: string;
  total_ejecuciones: number;
  puntaje_promedio: number | null;
  latencia_promedio_ms: number | null;
}

export default function AgentesSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [agentes, setAgentes] = useState<AgenteApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/supervision/agentes`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudieron cargar los agentes.");
        return r.json();
      })
      .then(setAgentes)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const totalEjecuciones = agentes?.reduce((acc, a) => acc + a.total_ejecuciones, 0) ?? 0;
  const conDatos = agentes?.filter((a) => a.puntaje_promedio !== null) ?? [];
  const promedioGeneral = conDatos.length
    ? conDatos.reduce((acc, a) => acc + (a.puntaje_promedio ?? 0), 0) / conDatos.length
    : null;

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Agentes"]}>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-carbon">Gestión de agentes</h1>
        <p className="text-sm text-carbon/55">Desempeño real de los agentes de IA orquestados en n8n.</p>
      </div>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!agentes && !error && <p className="text-sm text-carbon/50 mb-6">Cargando…</p>}

      {agentes && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatCard icon={<IconSparkle className="h-5 w-5" />} value={String(agentes.length)} label="Agentes definidos" tone="rosa" />
            <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(totalEjecuciones)} label="Ejecuciones totales" tone="verde" />
            <StatCard
              icon={<IconStar className="h-5 w-5" />}
              value={promedioGeneral !== null ? `${(promedioGeneral * 100).toFixed(1)}%` : "—"}
              label="Puntaje promedio (evaluador)"
              tone="dorado"
            />
          </div>

          <SimpleTable
            columns={["Agente", "Ejecuciones", "Puntaje promedio", "Latencia promedio", ""]}
            rows={agentes.map((a) => [
              a.agente_display,
              String(a.total_ejecuciones),
              a.puntaje_promedio !== null ? (
                <Badge key="p" tone={a.puntaje_promedio >= 0.8 ? "success" : a.puntaje_promedio >= 0.6 ? "progress" : "pending"}>
                  {(a.puntaje_promedio * 100).toFixed(1)}%
                </Badge>
              ) : (
                <span key="p" className="text-xs text-carbon/40">Sin evaluar</span>
              ),
              a.latencia_promedio_ms !== null ? `${a.latencia_promedio_ms} ms` : "—",
              <a key="link" href={`/supervision/agentes/${a.agente}`} className="text-borgona text-xs">Ver →</a>,
            ])}
          />
        </>
      )}
    </RolePortalShell>
  );
}
