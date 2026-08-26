"use client";

import { use, useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import SimpleTable from "@/components/SimpleTable";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface AgenteApi {
  agente: string;
  agente_display: string;
  total_ejecuciones: number;
  puntaje_promedio: number | null;
  latencia_promedio_ms: number | null;
}

interface EjecucionApi {
  run_id: string;
  estado: string;
  reply: string;
  agent_version: string;
  latencia_ms: number | null;
  evaluation_score: string | null;
  creado_en: string;
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  completado: "success",
  en_progreso: "progress",
  fallido: "pending",
};

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function DetalleAgenteSupervisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [agente, setAgente] = useState<AgenteApi | null>(null);
  const [ejecuciones, setEjecuciones] = useState<EjecucionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/supervision/agentes`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/agent-runs/?agente=${id}`, { headers }).then((r) => (r.ok ? r.json() : { results: [] })),
    ])
      .then(([agentes, runs]) => {
        setAgente((agentes as AgenteApi[]).find((a) => a.agente === id) ?? null);
        setEjecuciones(runs.results ?? runs);
      })
      .catch(() => setError("No se pudo cargar la información del agente."));
  }, [accessToken, cargandoSesion, id]);

  if (!agente && !error) {
    return (
      <RolePortalShell role="supervision" crumbs={["Supervisión", "Agentes", "Detalle"]}>
        <p className="text-sm text-carbon/50">Cargando…</p>
      </RolePortalShell>
    );
  }

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Agentes", "Detalle"]}>
      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {agente && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl text-carbon">{agente.agente_display}</h1>
              <p className="text-sm text-carbon/55">Código interno: {agente.agente} · agent-runs orquestados por n8n</p>
            </div>
            <Badge tone={agente.total_ejecuciones > 0 ? "success" : "pending"}>
              {agente.total_ejecuciones > 0 ? "Con actividad" : "Sin ejecuciones aún"}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="text-sm">
              <p className="text-xs uppercase tracking-wide text-carbon/50 mb-1">Ejecuciones totales</p>
              <p className="font-display text-2xl text-carbon">{agente.total_ejecuciones}</p>
            </Card>
            <Card className="text-sm">
              <p className="text-xs uppercase tracking-wide text-carbon/50 mb-1">Puntaje promedio</p>
              <p className="font-display text-2xl text-carbon">
                {agente.puntaje_promedio !== null ? `${(agente.puntaje_promedio * 100).toFixed(1)}%` : "—"}
              </p>
            </Card>
            <Card className="text-sm">
              <p className="text-xs uppercase tracking-wide text-carbon/50 mb-1">Latencia promedio</p>
              <p className="font-display text-2xl text-carbon">
                {agente.latencia_promedio_ms !== null ? `${agente.latencia_promedio_ms} ms` : "—"}
              </p>
            </Card>
          </div>

          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Ejecuciones recientes</h2>
          {!ejecuciones || ejecuciones.length === 0 ? (
            <p className="text-sm text-carbon/50">Este agente todavía no tiene ejecuciones registradas.</p>
          ) : (
            <SimpleTable
              columns={["Fecha", "Estado", "Respuesta", "Puntaje", "Latencia"]}
              rows={ejecuciones.slice(0, 20).map((e) => [
                fechaCorta(e.creado_en),
                <Badge key={`${e.run_id}-e`} tone={toneByEstado[e.estado] ?? "pending"}>{e.estado}</Badge>,
                <span key={`${e.run_id}-r`} className="line-clamp-2 max-w-sm text-xs text-carbon/70">{e.reply || "—"}</span>,
                e.evaluation_score ? `${(Number(e.evaluation_score) * 100).toFixed(0)}%` : "—",
                e.latencia_ms !== null ? `${e.latencia_ms} ms` : "—",
              ])}
            />
          )}
        </>
      )}
    </RolePortalShell>
  );
}
