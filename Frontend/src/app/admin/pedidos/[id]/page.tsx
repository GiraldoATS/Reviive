"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { IconReloj } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface EventoApi {
  id: number;
  estado: string;
  fecha: string;
  descripcion: string;
  responsable: number | null;
}

interface PedidoApi {
  id: string;
  codigo: string;
  estado: string;
  total: string;
  resumen: { objeto: string; cliente_nombre: string; proveedor: string; historia: string };
  eventos: EventoApi[];
}

const labelByEstado: Record<string, string> = {
  recibido: "Recibido",
  en_evaluacion: "En evaluación",
  en_proceso: "En proceso",
  control_de_calidad: "Control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  en_proceso: "progress",
  en_camino: "progress",
  control_de_calidad: "progress",
  entregado: "success",
  cancelado: "pending",
};

export default function DetalleAdminPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [pedido, setPedido] = useState<PedidoApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/orders/${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar este pedido.");
        return res.json();
      })
      .then(setPedido)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion, id]);

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Pedidos", pedido?.codigo ?? String(id)]}>
      {error && <p className="text-sm text-borgona">{error}</p>}
      {!pedido && !error && <p className="text-sm text-carbon/50">Cargando pedido…</p>}

      {pedido && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl text-carbon">Cadena de custodia</h1>
              <p className="text-sm text-carbon/55">Pedido #{pedido.codigo}</p>
            </div>
            <Badge tone={toneByEstado[pedido.estado] ?? "neutral"}>{labelByEstado[pedido.estado] ?? pedido.estado}</Badge>
          </div>

          <div className="grid md:grid-cols-[1fr_320px] gap-6">
            <Card>
              <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-4">Historial de eventos</h2>
              {pedido.eventos.length === 0 ? (
                <p className="text-sm text-carbon/50">Todavía no hay eventos registrados para este pedido.</p>
              ) : (
                <ol className="space-y-4">
                  {pedido.eventos.map((e, i) => (
                    <li key={e.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-borgona" />
                        {i < pedido.eventos.length - 1 && <span className="w-px flex-1 bg-greige/70 mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-carbon">{labelByEstado[e.estado] ?? e.estado}</p>
                        <p className="text-xs text-carbon/50">
                          {new Date(e.fecha).toLocaleString("es-CO")}
                          {e.descripcion ? ` · ${e.descripcion}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            <Card className="h-fit">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-marfil border border-greige/70 flex items-center justify-center">
                  <IconReloj className="h-6 w-6 text-borgona" />
                </div>
                <div>
                  <p className="text-sm font-medium text-carbon">{pedido.resumen.objeto || "Objeto sin especificar"}</p>
                  <p className="text-xs text-carbon/50">Cliente: {pedido.resumen.cliente_nombre}</p>
                </div>
              </div>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between"><dt className="text-carbon/50">Proveedor</dt><dd>{pedido.resumen.proveedor}</dd></div>
                <div className="flex justify-between"><dt className="text-carbon/50">Total</dt><dd>${Number(pedido.total).toLocaleString("es-CO")}</dd></div>
                <div className="flex justify-between"><dt className="text-carbon/50">Estado actual</dt><dd>{labelByEstado[pedido.estado] ?? pedido.estado}</dd></div>
              </dl>
            </Card>
          </div>
        </>
      )}
    </RolePortalShell>
  );
}
