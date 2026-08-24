"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface PedidoApi {
  id: string;
  codigo: string;
  resumen: {
    proveedor: string;
    ultimo_evento: { estado: string; fecha: string; responsable: string } | null;
  };
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

export default function CustodiaAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la cadena de custodia.");
        return res.json();
      })
      .then((data) => setPedidos(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Cadena de custodia"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Cadena de custodia</h1>
      <p className="text-sm text-carbon/55 mb-6">Rastrea cada pedido desde la recepción hasta la entrega final.</p>

      {error && <p className="text-sm text-borgona">{error}</p>}
      {!pedidos && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {pedidos && pedidos.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay pedidos con eventos registrados.</p>}

      {pedidos && pedidos.length > 0 && (
        <SimpleTable
          columns={["Pedido", "Estado de custodia", "Responsable actual", "Último evento", ""]}
          rows={pedidos.map((p) => [
            p.codigo,
            <Badge key="e" tone="progress">
              {p.resumen.ultimo_evento ? labelByEstado[p.resumen.ultimo_evento.estado] ?? p.resumen.ultimo_evento.estado : "Sin eventos"}
            </Badge>,
            p.resumen.ultimo_evento?.responsable || p.resumen.proveedor,
            p.resumen.ultimo_evento ? new Date(p.resumen.ultimo_evento.fecha).toLocaleString("es-CO") : "—",
            <a key="a" href={`/admin/pedidos/${p.id}`} className="text-borgona text-xs">Ver trazabilidad →</a>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
