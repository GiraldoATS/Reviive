"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface EventoApi {
  tipo: "pedido" | "agente";
  actor: string;
  evento: string;
  fecha: string;
  referencia: string;
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AuditoriaSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [eventos, setEventos] = useState<EventoApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/supervision/auditoria`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar la auditoría.");
        return r.json();
      })
      .then(setEventos)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Auditoría y trazabilidad"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Auditoría y trazabilidad</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Los últimos 50 eventos reales de negocio (cambios de estado de pedidos) y ejecuciones de agentes completadas.
      </p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!eventos && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {eventos && eventos.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay eventos registrados.</p>}

      {eventos && eventos.length > 0 && (
        <SimpleTable
          columns={["Fecha", "Actor", "Evento", "Referencia"]}
          rows={eventos.map((e, i) => [
            fechaCorta(e.fecha),
            e.actor,
            e.evento,
            <code key={i} className="text-xs text-carbon/50">{e.referencia.slice(0, 8)}…</code>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
