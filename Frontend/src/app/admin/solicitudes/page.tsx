"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconBox, IconEye, IconClockAlert, IconFlag } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ObjetoApi {
  tipo: string;
  categoria: string;
}

interface SolicitudApi {
  id: string;
  cliente_nombre: string;
  historia: string;
  objetos: ObjetoApi[];
  recomendaciones_resumen: { total: number; requiere_revision_humana: boolean };
  creado_en: string;
}

export default function SolicitudesAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [solicitudes, setSolicitudes] = useState<SolicitudApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/memories/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las solicitudes.");
        return res.json();
      })
      .then((data) => setSolicitudes(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const total = solicitudes?.length ?? 0;
  const conRecomendacion = solicitudes?.filter((s) => s.recomendaciones_resumen.total > 0).length ?? 0;
  const pendientes = total - conRecomendacion;
  const requierenRevision = solicitudes?.filter((s) => s.recomendaciones_resumen.requiere_revision_humana).length ?? 0;

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Solicitudes"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de solicitudes</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Solicitudes de evaluación enviadas por clientes desde /recuerdos/nuevo.
      </p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value={String(total)} label="Solicitudes totales" tone="rosa" />
        <StatCard icon={<IconEye className="h-5 w-5" />} value={String(conRecomendacion)} label="Con recomendación IA" tone="verde" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value={String(pendientes)} label="Recomendación pendiente" tone="dorado" />
        <StatCard icon={<IconFlag className="h-5 w-5" />} value={String(requierenRevision)} label="Requieren revisión humana" tone="borgona" />
      </div>

      {!solicitudes && !error && <p className="text-sm text-carbon/50">Cargando solicitudes…</p>}
      {solicitudes && solicitudes.length === 0 && (
        <p className="text-sm text-carbon/50">Todavía no hay solicitudes de clientes.</p>
      )}

      {solicitudes && solicitudes.length > 0 && (
        <SimpleTable
          columns={["Cliente", "Objeto", "Historia", "Recomendación IA", "Fecha", ""]}
          rows={solicitudes.map((s) => {
            const objeto = s.objetos[0];
            const resumen = s.recomendaciones_resumen;
            return [
              s.cliente_nombre,
              objeto ? `${objeto.tipo}${objeto.categoria ? ` · ${objeto.categoria}` : ""}` : "—",
              <span key="h" className="block max-w-[220px] truncate" title={s.historia}>
                {s.historia || "—"}
              </span>,
              resumen.total > 0 ? (
                <span key="r" className="flex items-center gap-1.5">
                  <Badge tone="success">{resumen.total} sugerida{resumen.total > 1 ? "s" : ""}</Badge>
                  {resumen.requiere_revision_humana && <Badge tone="pending">Revisar</Badge>}
                </span>
              ) : (
                <Badge key="r" tone="pending">Pendiente</Badge>
              ),
              new Date(s.creado_en).toLocaleDateString("es-CO"),
              <span key="a" className="flex items-center gap-3">
                <a href={`/recomendaciones?recuerdo=${s.id}`} className="text-borgona text-xs">
                  Ver →
                </a>
                <a href={`/admin/cotizaciones/nueva?recuerdo=${s.id}`} className="text-borgona text-xs">
                  Cotizar →
                </a>
              </span>,
            ];
          })}
        />
      )}
    </RolePortalShell>
  );
}
