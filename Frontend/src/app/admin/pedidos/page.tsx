"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconBox, IconTruck, IconCheckCircle, IconAlertTriangle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface PedidoApi {
  id: string;
  codigo: string;
  estado: string;
  total: string;
  resumen: { objeto: string; cliente_nombre: string; proveedor: string };
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  en_proceso: "progress",
  en_camino: "progress",
  control_de_calidad: "progress",
  entregado: "success",
  cancelado: "pending",
};

const labelByEstado: Record<string, string> = {
  recibido: "Recibido",
  en_evaluacion: "En evaluación",
  en_proceso: "En proceso",
  control_de_calidad: "Control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default function PedidosAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los pedidos.");
        return res.json();
      })
      .then((data) => setPedidos(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const total = pedidos?.length ?? 0;
  const enProceso = pedidos?.filter((p) => p.estado === "en_proceso").length ?? 0;
  const entregados = pedidos?.filter((p) => p.estado === "entregado").length ?? 0;
  const cancelados = pedidos?.filter((p) => p.estado === "cancelado").length ?? 0;

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Pedidos"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de pedidos</h1>
      <p className="text-sm text-carbon/55 mb-6">Supervisa el ciclo completo de cada pedido confirmado.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value={String(total)} label="Pedidos totales" tone="rosa" />
        <StatCard icon={<IconTruck className="h-5 w-5" />} value={String(enProceso)} label="En proceso" tone="dorado" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(entregados)} label="Entregados" tone="verde" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value={String(cancelados)} label="Cancelados" tone="borgona" />
      </div>

      {!pedidos && !error && <p className="text-sm text-carbon/50">Cargando pedidos…</p>}
      {pedidos && pedidos.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay pedidos confirmados.</p>}

      {pedidos && pedidos.length > 0 && (
        <SimpleTable
          columns={["Pedido", "Cliente", "Objeto", "Proveedor", "Total", "Estado", ""]}
          rows={pedidos.map((p) => [
            p.codigo,
            p.resumen.cliente_nombre,
            p.resumen.objeto || "—",
            p.resumen.proveedor,
            `$${Number(p.total).toLocaleString("es-CO")}`,
            <Badge key="e" tone={toneByEstado[p.estado] ?? "neutral"}>{labelByEstado[p.estado] ?? p.estado}</Badge>,
            <a key="a" href={`/admin/pedidos/${p.id}`} className="text-borgona text-xs">Ver →</a>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
