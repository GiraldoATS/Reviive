"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { API_URL, getProductos } from "@/lib/api";
import type { Producto } from "@/types";

interface CapacidadApi {
  id: number;
  producto_nombre: string;
  material: string;
  ciudad: string;
  tiempo_estimado_dias: number;
}

interface ProveedorApi {
  id: number;
  nombre_taller: string;
  ciudad: string;
  calificacion: string;
  capacidades: CapacidadApi[];
}

export default function MatchingAdminPage() {
  const { accessToken } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoId, setProductoId] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [candidatos, setCandidatos] = useState<ProveedorApi[] | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductos().then(setProductos).catch(() => setProductos([]));
  }, []);

  async function buscar(e: FormEvent) {
    e.preventDefault();
    if (!productoId || !accessToken) return;
    setBuscando(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/providers/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ producto_id: Number(productoId), ciudad: ciudad || undefined }),
      });
      if (!res.ok) throw new Error("No se pudo buscar proveedores compatibles.");
      setCandidatos(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Matching"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Matching de proveedores</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Elige un producto del catálogo y una ciudad para encontrar talleres compatibles y validados.
      </p>

      <Card className="mb-6">
        <form onSubmit={buscar} className="flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Producto</span>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50 min-w-[220px]"
            >
              <option value="">Selecciona un producto…</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Ciudad (opcional)</span>
            <input
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Ej: Medellín"
              className="rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50"
            />
          </label>
          <Button type="submit" variant="primary" disabled={!productoId || buscando}>
            {buscando ? "Buscando…" : "Buscar coincidencias"}
          </Button>
        </form>
      </Card>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}

      {candidatos && candidatos.length === 0 && (
        <p className="text-sm text-carbon/50">No hay proveedores validados con capacidad para este producto{ciudad ? ` en ${ciudad}` : ""}.</p>
      )}

      {candidatos && candidatos.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {candidatos.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-carbon">{c.nombre_taller}</h3>
                <Badge tone="progress">★ {Number(c.calificacion).toFixed(1)}</Badge>
              </div>
              <p className="mt-1 text-sm text-carbon/60">
                {c.ciudad} · {c.capacidades.map((cap) => cap.producto_nombre).join(", ") || "Sin especialidad registrada"}
              </p>
              {c.capacidades[0] && (
                <p className="mt-2 text-xs text-carbon/50">Tiempo estimado: {c.capacidades[0].tiempo_estimado_dias} días</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </RolePortalShell>
  );
}
