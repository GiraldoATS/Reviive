"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import { IconTruck, IconBox, IconAlertTriangle, IconCheckCircle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface EnvioApi {
  id: number;
  pedido_codigo: string;
  cliente_nombre: string;
  ciudad_destino: string;
  transportadora: string;
  numero_guia: string;
  estado: "preparando" | "en_transito" | "entregado" | "incidencia";
  fecha_estimada: string | null;
}

const labelByEstado: Record<string, string> = {
  preparando: "Preparando",
  en_transito: "En tránsito",
  entregado: "Entregado",
  incidencia: "Con incidencia",
};

const TRANSPORTADORAS = ["", "Coordinadora", "Interrápidísimo", "Servientrega", "TCC"];

export default function LogisticaAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [envios, setEnvios] = useState<EnvioApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/shipments/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setEnvios(data.results ?? data))
      .catch(() => setError("No se pudieron cargar los envíos."));
  }

  useEffect(() => {
    if (cargandoSesion) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  async function actualizar(id: number, campo: string, valor: string) {
    if (!accessToken) return;
    await fetch(`${API_URL}/shipments/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ [campo]: valor }),
    });
    cargar();
  }

  const enTransito = envios?.filter((e) => e.estado === "en_transito").length ?? 0;
  const incidencias = envios?.filter((e) => e.estado === "incidencia").length ?? 0;
  const entregados = envios?.filter((e) => e.estado === "entregado").length ?? 0;

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Logística"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión logística</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra envíos, transportadoras y tiempos de entrega.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconTruck className="h-5 w-5" />} value={String(enTransito)} label="En tránsito" tone="dorado" />
        <StatCard icon={<IconBox className="h-5 w-5" />} value={String(envios?.length ?? 0)} label="Envíos totales" tone="rosa" />
        <StatCard icon={<IconAlertTriangle className="h-5 w-5" />} value={String(incidencias)} label="Con incidencia" tone="borgona" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value={String(entregados)} label="Entregados" tone="verde" />
      </div>

      {!envios && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {envios && envios.length === 0 && (
        <p className="text-sm text-carbon/50">No hay envíos todavía (aparecen cuando un pedido pasa a &ldquo;en camino&rdquo;).</p>
      )}

      {envios && envios.length > 0 && (
        <SimpleTable
          columns={["Pedido", "Cliente", "Destino", "Transportadora", "Guía", "Estado"]}
          rows={envios.map((e) => [
            e.pedido_codigo,
            e.cliente_nombre,
            e.ciudad_destino || "—",
            <select
              key={`${e.id}-t`}
              value={e.transportadora}
              onChange={(ev) => actualizar(e.id, "transportadora", ev.target.value)}
              className="rounded-lg border border-greige/60 bg-white px-2 py-1 text-xs outline-none"
            >
              {TRANSPORTADORAS.map((t) => (
                <option key={t} value={t}>{t || "Sin asignar"}</option>
              ))}
            </select>,
            <input
              key={`${e.id}-g`}
              defaultValue={e.numero_guia}
              onBlur={(ev) => actualizar(e.id, "numero_guia", ev.target.value)}
              placeholder="N° de guía"
              className="w-28 rounded-lg border border-greige/60 bg-white px-2 py-1 text-xs outline-none"
            />,
            <select
              key={`${e.id}-e`}
              value={e.estado}
              onChange={(ev) => actualizar(e.id, "estado", ev.target.value)}
              className="rounded-lg border-none bg-transparent text-xs outline-none"
            >
              {Object.entries(labelByEstado).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
