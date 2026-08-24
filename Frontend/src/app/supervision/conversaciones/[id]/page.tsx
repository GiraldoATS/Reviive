"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
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

interface MensajeApi {
  id: number;
  rol: "usuario" | "alma" | "agente_humano";
  contenido: string;
  fecha: string;
}

const labelByCanal: Record<string, string> = { web: "Web", telegram: "Telegram", correo: "Correo" };

export default function DetalleConversacionSupervisionPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [conversacion, setConversacion] = useState<ConversacionApi | null>(null);
  const [mensajes, setMensajes] = useState<MensajeApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/conversations/${id}/`, { headers }).then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar esta conversación.");
        return res.json();
      }),
      fetch(`${API_URL}/conversations/${id}/messages`, { headers }).then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los mensajes.");
        return res.json();
      }),
    ])
      .then(([conv, msgs]) => {
        setConversacion(conv);
        setMensajes(msgs);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion, id]);

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Conversaciones", conversacion?.usuario_nombre ?? String(id)]}>
      {error && <p className="text-sm text-borgona">{error}</p>}
      {!conversacion && !error && <p className="text-sm text-carbon/50">Cargando conversación…</p>}

      {conversacion && (
        <>
          <h1 className="font-display text-2xl text-carbon mb-1">Detalle de conversación</h1>
          <p className="text-sm text-carbon/55 mb-6">
            {conversacion.usuario_nombre} · {labelByCanal[conversacion.canal] ?? conversacion.canal} ·{" "}
            {new Date(conversacion.creada_en).toLocaleString("es-CO")}
          </p>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <Card>
              {!mensajes || mensajes.length === 0 ? (
                <p className="text-sm text-carbon/50">Esta conversación todavía no tiene mensajes.</p>
              ) : (
                <div className="space-y-4">
                  {mensajes.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.rol === "usuario" ? "bg-borgona text-marfil ml-auto" : "bg-marfil border border-greige/70"
                      }`}
                    >
                      <p>{m.contenido}</p>
                      <p className={`mt-1 text-[10px] ${m.rol === "usuario" ? "text-marfil/60" : "text-carbon/40"}`}>
                        {new Date(m.fecha).toLocaleTimeString("es-CO")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="space-y-4">
              <Card>
                <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Intención detectada</h2>
                <span className="text-sm text-carbon">{conversacion.intencion || "Sin intención registrada"}</span>
              </Card>
              <Card>
                <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Estado</h2>
                <Badge tone={conversacion.estado === "cerrada" ? "success" : conversacion.estado === "pendiente" ? "pending" : "progress"}>
                  {conversacion.estado === "activa" ? "Activa" : conversacion.estado === "pendiente" ? "Pendiente" : "Cerrada"}
                </Badge>
              </Card>
            </div>
          </div>
        </>
      )}
    </RolePortalShell>
  );
}
