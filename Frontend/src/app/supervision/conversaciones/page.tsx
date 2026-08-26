"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ConversacionApi {
  id: string;
  usuario_nombre: string;
  canal: string;
  estado: string;
  intencion: string;
  creada_en: string;
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  activa: "progress",
  pendiente: "pending",
  cerrada: "success",
};

const labelByEstado: Record<string, string> = {
  activa: "Activa",
  pendiente: "Pendiente",
  cerrada: "Cerrada",
};

const labelByCanal: Record<string, string> = {
  web: "Web",
  telegram: "Telegram",
  correo: "Correo",
};

export default function ConversacionesSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [conversaciones, setConversaciones] = useState<ConversacionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/conversations/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las conversaciones.");
        return res.json();
      })
      .then((data) => setConversaciones(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Conversaciones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Todas las conversaciones</h1>
      <p className="text-sm text-carbon/55 mb-6">Revisa canal, intención detectada y estado de cada conversación con Alma.</p>

      {error && <p className="text-sm text-borgona">{error}</p>}
      {!conversaciones && !error && <p className="text-sm text-carbon/50">Cargando conversaciones…</p>}
      {conversaciones && conversaciones.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay conversaciones registradas.</p>}

      {conversaciones && conversaciones.length > 0 && (
        <SimpleTable
          columns={["Usuario", "Canal", "Intención", "Estado", "Fecha", ""]}
          rows={conversaciones.map((c) => [
            c.usuario_nombre,
            labelByCanal[c.canal] ?? c.canal,
            c.intencion || "—",
            <Badge key={`${c.id}-e`} tone={toneByEstado[c.estado] ?? "neutral"}>{labelByEstado[c.estado] ?? c.estado}</Badge>,
            new Date(c.creada_en).toLocaleDateString("es-CO"),
            <a key={`${c.id}-a`} href={`/supervision/conversaciones/${c.id}`} className="text-borgona text-xs">Ver →</a>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
