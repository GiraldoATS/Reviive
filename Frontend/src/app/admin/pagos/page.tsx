"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconWallet } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface PagoApi {
  id: number;
  pedido_codigo: string;
  proveedor_nombre: string;
  monto_bruto: string;
  comision_pct: string;
  monto_neto: string;
  estado: "pendiente" | "pagado";
  fecha_estimada: string | null;
  fecha_pago: string | null;
}

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PagosAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [pagos, setPagos] = useState<PagoApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [marcando, setMarcando] = useState<number | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/payments/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setPagos(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError("No se pudieron cargar los pagos."));
  }

  useEffect(() => {
    if (cargandoSesion) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  async function marcarPagado(id: number) {
    if (!accessToken) return;
    setMarcando(id);
    try {
      await fetch(`${API_URL}/payments/${id}/marcar-pagado/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      cargar();
    } finally {
      setMarcando(null);
    }
  }

  const pendientes = pagos?.filter((p) => p.estado === "pendiente") ?? [];
  const pagados = pagos?.filter((p) => p.estado === "pagado") ?? [];
  const totalPendiente = pendientes.reduce((acc, p) => acc + Number(p.monto_neto), 0);
  const totalPagado = pagados.reduce((acc, p) => acc + Number(p.monto_neto), 0);

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Pagos y comisiones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Pagos y comisiones</h1>
      <p className="text-sm text-carbon/55 mb-6">Controla pagos a proveedores, comisiones y estados financieros.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconWallet className="h-5 w-5" />} value={String(pagos?.length ?? 0)} label="Pagos totales" tone="rosa" />
        <StatCard icon={<IconWallet className="h-5 w-5" />} value={formatoCOP(totalPendiente)} label="Pendientes de pago" tone="dorado" />
        <StatCard icon={<IconWallet className="h-5 w-5" />} value={formatoCOP(totalPagado)} label="Ya pagado" tone="verde" />
      </div>

      {!pagos && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {pagos && pagos.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay pagos registrados.</p>}

      {pagos && pagos.length > 0 && (
        <SimpleTable
          columns={["Proveedor", "Pedido", "Monto neto", "Estado", "Fecha", ""]}
          rows={pagos.map((p) => [
            p.proveedor_nombre,
            p.pedido_codigo,
            formatoCOP(Number(p.monto_neto)),
            <Badge key="e" tone={p.estado === "pagado" ? "success" : "pending"}>{p.estado === "pagado" ? "Pagado" : "Pendiente"}</Badge>,
            p.fecha_pago ? fechaCorta(p.fecha_pago) : p.fecha_estimada ? fechaCorta(p.fecha_estimada) : "—",
            p.estado === "pendiente" ? (
              <button
                key="a"
                onClick={() => marcarPagado(p.id)}
                disabled={marcando === p.id}
                className="text-borgona text-xs disabled:opacity-50"
              >
                {marcando === p.id ? "Marcando…" : "Marcar pagado →"}
              </button>
            ) : (
              <span key="a" className="text-carbon/40 text-xs">—</span>
            ),
          ])}
        />
      )}
    </RolePortalShell>
  );
}
