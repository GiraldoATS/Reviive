"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconUsers, IconCheckCircle, IconClockAlert } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ProveedorApi {
  id: number;
  nombre_taller: string;
  ciudad: string;
  estado_validacion: string;
  calificacion: string;
  capacidades: { producto_nombre: string }[];
}

const labelByEstado: Record<string, string> = {
  pendiente: "Pendiente",
  validado: "Validado",
  suspendido: "Suspendido",
};

export default function ProveedoresAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [proveedores, setProveedores] = useState<ProveedorApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/providers/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la red de proveedores.");
        return res.json();
      })
      .then((data) => setProveedores(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const total = proveedores?.length ?? 0;
  const validados = proveedores?.filter((p) => p.estado_validacion === "validado").length ?? 0;
  const pendientes = proveedores?.filter((p) => p.estado_validacion === "pendiente").length ?? 0;

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Proveedores"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de proveedores</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra la red de talleres y artesanos validados.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconUsers className="h-5 w-5" />} value={String(total)} label="Proveedores registrados" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(validados)} label="Validados" tone="verde" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value={String(pendientes)} label="Pendientes de validación" tone="dorado" />
      </div>

      {!proveedores && !error && <p className="text-sm text-carbon/50">Cargando proveedores…</p>}
      {proveedores && proveedores.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay proveedores registrados.</p>}

      {proveedores && proveedores.length > 0 && (
        <SimpleTable
          columns={["Taller", "Ciudad", "Especialidades", "Calificación", "Estado", ""]}
          rows={proveedores.map((p) => [
            p.nombre_taller,
            p.ciudad,
            p.capacidades.map((c) => c.producto_nombre).join(", ") || "—",
            `★ ${Number(p.calificacion).toFixed(1)}`,
            <Badge key={`${p.id}-e`} tone={p.estado_validacion === "validado" ? "success" : p.estado_validacion === "suspendido" ? "pending" : "pending"}>
              {labelByEstado[p.estado_validacion] ?? p.estado_validacion}
            </Badge>,
            <a key={`${p.id}-a`} href={`/admin/proveedores/validacion?proveedor=${p.id}`} className="text-borgona text-xs">Ver →</a>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
