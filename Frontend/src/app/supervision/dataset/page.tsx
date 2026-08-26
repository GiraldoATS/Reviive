"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconBox, IconCheckCircle, IconClockAlert } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface EjemploApi {
  id: number;
  conversacion: string;
  conversacion_resumen: string;
  etiqueta: string;
  anonimizado: boolean;
  estado_revision: string;
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  aprobado: "success",
  pendiente: "pending",
  rechazado: "pending",
};

const labelByEstado: Record<string, string> = {
  aprobado: "Aprobado",
  pendiente: "Pendiente",
  rechazado: "Rechazado",
};

export default function DatasetSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [ejemplos, setEjemplos] = useState<EjemploApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aprobando, setAprobando] = useState<number | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/dataset-examples/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el dataset de entrenamiento.");
        return res.json();
      })
      .then((data) => setEjemplos(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  async function aprobar(id: number) {
    if (!accessToken) return;
    setAprobando(id);
    try {
      const res = await fetch(`${API_URL}/dataset-examples/${id}/approve/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "No se pudo aprobar este ejemplo.");
      }
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setAprobando(null);
    }
  }

  const total = ejemplos?.length ?? 0;
  const aprobados = ejemplos?.filter((e) => e.estado_revision === "aprobado").length ?? 0;
  const pendientes = ejemplos?.filter((e) => e.estado_revision === "pendiente").length ?? 0;

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Dataset de entrenamiento"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Dataset de entrenamiento</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Ejemplos anonimizados y aprobados que alimentan la mejora continua de los agentes (RN-09 / RN-11).
      </p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value={String(total)} label="Ejemplos totales" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(aprobados)} label="Aprobados" tone="verde" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value={String(pendientes)} label="Pendientes de revisión" tone="dorado" />
      </div>

      {!ejemplos && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {ejemplos && ejemplos.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay ejemplos en el dataset.</p>}

      {ejemplos && ejemplos.length > 0 && (
        <SimpleTable
          columns={["Ejemplo", "Etiqueta", "Anonimizado", "Estado", ""]}
          rows={ejemplos.map((e) => [
            e.conversacion_resumen,
            e.etiqueta || "—",
            e.anonimizado ? "Sí" : "No",
            <Badge key={`${e.id}-s`} tone={toneByEstado[e.estado_revision] ?? "neutral"}>{labelByEstado[e.estado_revision] ?? e.estado_revision}</Badge>,
            e.estado_revision === "pendiente" ? (
              <button
                key={`${e.id}-a`}
                onClick={() => aprobar(e.id)}
                disabled={aprobando === e.id}
                className="text-borgona text-xs disabled:opacity-50"
              >
                {aprobando === e.id ? "Aprobando…" : "Aprobar →"}
              </button>
            ) : (
              <a key={`${e.id}-a`} href={`/supervision/conversaciones/${e.conversacion}`} className="text-borgona text-xs">Ver conversación →</a>
            ),
          ])}
        />
      )}
    </RolePortalShell>
  );
}
