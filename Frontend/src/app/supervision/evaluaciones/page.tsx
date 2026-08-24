"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconBox, IconCheckCircle, IconAlertTriangle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface EvaluacionApi {
  id: number;
  ejecucion: string;
  agente: string;
  agente_display: string;
  reply: string;
  tipo: "automatica" | "supervisor";
  puntaje: string;
  requiere_revision: boolean;
  creado_en: string;
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function EvaluacionesSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/evaluations/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar las evaluaciones.");
        return res.json();
      })
      .then((data) => setEvaluaciones(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const total = evaluaciones?.length ?? 0;
  const promedio = total
    ? evaluaciones!.reduce((acc, e) => acc + Number(e.puntaje), 0) / total
    : 0;
  const requierenRevision = evaluaciones?.filter((e) => e.requiere_revision).length ?? 0;

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Evaluaciones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Evaluaciones de agentes</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Calidad de cada respuesta generada por un agente: empatía, precisión y cumplimiento de las reglas de negocio.
      </p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value={String(total)} label="Evaluaciones totales" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={promedio.toFixed(2)} label="Puntaje promedio (0-1)" tone="verde" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value={String(requierenRevision)} label="Requieren revisión" tone="dorado" />
      </div>

      {!evaluaciones && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {evaluaciones && evaluaciones.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay evaluaciones registradas.</p>}

      {evaluaciones && evaluaciones.length > 0 && (
        <SimpleTable
          columns={["Agente", "Respuesta evaluada", "Tipo", "Puntaje", "Fecha", ""]}
          rows={evaluaciones.map((e) => [
            e.agente_display,
            <span key="r" className="line-clamp-2 max-w-xs text-xs text-carbon/70">{e.reply || "—"}</span>,
            e.tipo === "automatica" ? "Automática" : "Supervisor",
            e.puntaje,
            fechaCorta(e.creado_en),
            e.requiere_revision ? (
              <Badge key="b" tone="pending">Requiere revisión</Badge>
            ) : (
              <Badge key="b" tone="success">OK</Badge>
            ),
          ])}
        />
      )}
    </RolePortalShell>
  );
}
