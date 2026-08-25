"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconAlertTriangle, IconClockAlert, IconCheckCircle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ReclamacionApi {
  id: number;
  cliente_nombre: string;
  pedido_codigo: string;
  tipo: string;
  descripcion: string;
  estado: "abierta" | "en_proceso" | "resuelta";
  prioridad: "baja" | "media" | "alta";
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  abierta: "pending",
  en_proceso: "progress",
  resuelta: "success",
};

const labelByEstado: Record<string, string> = {
  abierta: "Abierta",
  en_proceso: "En proceso",
  resuelta: "Resuelta",
};

const labelByTipo: Record<string, string> = {
  producto: "Producto",
  servicio: "Servicio",
  envio: "Envío",
  otro: "Otro",
};

export default function ReclamacionesAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [reclamaciones, setReclamaciones] = useState<ReclamacionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/claims/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setReclamaciones(data.results ?? data))
      .catch(() => setError("No se pudieron cargar las reclamaciones."));
  }

  useEffect(() => {
    if (cargandoSesion) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  async function actualizarEstado(id: number, estado: string) {
    if (!accessToken) return;
    await fetch(`${API_URL}/claims/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ estado }),
    });
    cargar();
  }

  const abiertas = reclamaciones?.filter((r) => r.estado === "abierta").length ?? 0;
  const enProceso = reclamaciones?.filter((r) => r.estado === "en_proceso").length ?? 0;
  const resueltas = reclamaciones?.filter((r) => r.estado === "resuelta").length ?? 0;

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Reclamaciones"]}>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-carbon">Reclamaciones e incidencias</h1>
        <p className="text-sm text-carbon/55">Gestiona quejas y problemas reales reportados por clientes.</p>
      </div>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value={String(abiertas)} label="Abiertas" tone="borgona" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value={String(enProceso)} label="En proceso" tone="dorado" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(resueltas)} label="Resueltas" tone="verde" />
      </div>

      {!reclamaciones && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {reclamaciones && reclamaciones.length === 0 && <p className="text-sm text-carbon/50">No hay reclamaciones registradas.</p>}

      {reclamaciones && reclamaciones.length > 0 && (
        <SimpleTable
          columns={["Pedido", "Tipo", "Cliente", "Descripción", "Prioridad", "Estado"]}
          rows={reclamaciones.map((r) => [
            r.pedido_codigo || "—",
            labelByTipo[r.tipo] ?? r.tipo,
            r.cliente_nombre,
            <span key="d" className="line-clamp-2 max-w-xs text-xs text-carbon/70">{r.descripcion}</span>,
            r.prioridad,
            <div key="e" className="flex items-center gap-2">
              <Badge tone={toneByEstado[r.estado]}>{labelByEstado[r.estado]}</Badge>
              <select
                value={r.estado}
                onChange={(e) => actualizarEstado(r.id, e.target.value)}
                className="rounded-lg border border-greige/60 bg-white px-2 py-1 text-xs outline-none"
              >
                {Object.entries(labelByEstado).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
