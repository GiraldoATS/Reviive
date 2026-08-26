"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconUsers, IconUser, IconBox } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ClienteApi {
  id: number;
  nombre: string;
  ciudad: string;
  email: string;
  num_pedidos: number;
  estado: string;
}

interface ClientesResponse {
  resumen: { total: number; activos: number; nuevos_mes: number; recurrentes: number };
  clientes: ClienteApi[];
}

export default function ClientesAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [datos, setDatos] = useState<ClientesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/analytics/clientes`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar la lista de clientes.");
        return r.json();
      })
      .then(setDatos)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Clientes"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de clientes</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra y da seguimiento a todos tus clientes desde un solo lugar.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!datos && !error && <p className="text-sm text-carbon/50 mb-6">Cargando clientes…</p>}

      {datos && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatCard icon={<IconUsers className="h-5 w-5" />} value={String(datos.resumen.activos)} label="Clientes activos" tone="rosa" />
            <StatCard icon={<IconUser className="h-5 w-5" />} value={String(datos.resumen.nuevos_mes)} label="Nuevos este mes" tone="dorado" />
            <StatCard icon={<IconBox className="h-5 w-5" />} value={String(datos.resumen.recurrentes)} label="Clientes recurrentes (2+ pedidos)" tone="verde" />
          </div>

          {datos.clientes.length === 0 ? (
            <p className="text-sm text-carbon/50">Todavía no hay clientes registrados.</p>
          ) : (
            <SimpleTable
              columns={["Cliente", "Ciudad", "Pedidos", "Estado"]}
              rows={datos.clientes.map((c) => [
                c.nombre,
                c.ciudad || "—",
                String(c.num_pedidos),
                <Badge key={`${c.id}-e`} tone={c.estado === "activo" ? "success" : "pending"}>{c.estado}</Badge>,
              ])}
            />
          )}
        </>
      )}
    </RolePortalShell>
  );
}
