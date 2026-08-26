"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IconWallet, IconCheckCircle, IconClockAlert, IconAlertTriangle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface CotizacionApi {
  id: string;
  proveedor_nombre: string;
  cliente_nombre: string;
  total: string;
  vigencia: string;
  estado: string;
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  aceptada: "success",
  enviada: "progress",
  borrador: "progress",
  vencida: "pending",
  rechazada: "pending",
};

const labelByEstado: Record<string, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  aceptada: "Aceptada",
  vencida: "Vencida",
  rechazada: "Rechazada",
};

export default function CotizacionesAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [cotizaciones, setCotizaciones] = useState<CotizacionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/quotations/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las cotizaciones.");
        return res.json();
      })
      .then((data) => setCotizaciones(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const total = cotizaciones?.length ?? 0;
  const aceptadas = cotizaciones?.filter((c) => c.estado === "aceptada").length ?? 0;
  const pendientes = cotizaciones?.filter((c) => c.estado === "enviada" || c.estado === "borrador").length ?? 0;
  const vencidas = cotizaciones?.filter((c) => c.estado === "vencida" || c.estado === "rechazada").length ?? 0;

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Cotizaciones"]}>
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="font-display text-2xl text-carbon">Gestión de cotizaciones</h1>
        <Button href="/admin/solicitudes" variant="primary" className="shrink-0">
          + Nueva cotización
        </Button>
      </div>
      <p className="text-sm text-carbon/55 mb-6">Controla vigencia, aceptación y valor de cada cotización.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconWallet className="h-5 w-5" />} value={String(total)} label="Cotizaciones totales" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(aceptadas)} label="Aceptadas" tone="verde" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value={String(pendientes)} label="Pendientes de respuesta" tone="dorado" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value={String(vencidas)} label="Vencidas / rechazadas" tone="borgona" />
      </div>

      {!cotizaciones && !error && <p className="text-sm text-carbon/50">Cargando cotizaciones…</p>}
      {cotizaciones && cotizaciones.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay cotizaciones registradas.</p>}

      {cotizaciones && cotizaciones.length > 0 && (
        <SimpleTable
          columns={["Cotización", "Cliente", "Proveedor", "Total", "Vigencia", "Estado"]}
          rows={cotizaciones.map((c) => [
            `#${c.id.slice(0, 8)}`,
            c.cliente_nombre,
            c.proveedor_nombre,
            `$${Number(c.total).toLocaleString("es-CO")}`,
            c.vigencia,
            <Badge key={`${c.id}-e`} tone={toneByEstado[c.estado] ?? "neutral"}>{labelByEstado[c.estado] ?? c.estado}</Badge>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
