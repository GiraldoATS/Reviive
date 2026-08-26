"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { API_URL, getProductos } from "@/lib/api";
import type { Producto } from "@/types";

interface RecuerdoApi {
  id: string;
  cliente_nombre: string;
  historia: string;
  objetos: { tipo: string; categoria: string; estado: string; nivel_transformacion: string }[];
}

interface RecomendacionApi {
  id: number;
  titulo: string;
  justificacion: string;
  puntaje: string;
  producto: { id: number; nombre: string; precio_base: string };
}

interface CapacidadApi {
  producto_nombre: string;
  tiempo_estimado_dias: number;
}

interface ProveedorApi {
  id: number;
  nombre_taller: string;
  ciudad: string;
  calificacion: string;
  capacidades: CapacidadApi[];
}

function hoyMas(dias: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

function NuevaCotizacionForm() {
  const { accessToken } = useAuth();
  const searchParams = useSearchParams();
  const recuerdoId = searchParams.get("recuerdo");

  const [recuerdo, setRecuerdo] = useState<RecuerdoApi | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionApi[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [productoId, setProductoId] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [candidatos, setCandidatos] = useState<ProveedorApi[] | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [proveedorId, setProveedorId] = useState("");
  const [total, setTotal] = useState("");
  const [vigencia, setVigencia] = useState(() => hoyMas(15));
  const [enviando, setEnviando] = useState(false);
  const [creada, setCreada] = useState(false);

  useEffect(() => {
    if (!accessToken || !recuerdoId) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/memories/${recuerdoId}/`, { headers }).then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar esta solicitud.");
        return res.json();
      }),
      fetch(`${API_URL}/recommendations/?recuerdo=${recuerdoId}`, { headers }).then((res) =>
        res.ok ? res.json() : { results: [] }
      ),
      getProductos(),
    ])
      .then(([recuerdoData, recData, productosData]) => {
        setRecuerdo(recuerdoData);
        const recs: RecomendacionApi[] = recData.results ?? recData;
        setRecomendaciones(recs);
        setProductos(productosData);
        if (recs.length > 0) {
          setProductoId(String(recs[0].producto.id));
          setTotal(recs[0].producto.precio_base);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."))
      .finally(() => setCargando(false));
  }, [accessToken, recuerdoId]);

  const productoSeleccionado = useMemo(
    () => productos.find((p) => p.id === productoId),
    [productos, productoId]
  );

  async function buscarProveedores(e: FormEvent) {
    e.preventDefault();
    if (!productoId || !accessToken) return;
    setBuscando(true);
    setError(null);
    setCandidatos(null);
    setProveedorId("");
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

  async function emitirCotizacion(e: FormEvent) {
    e.preventDefault();
    if (!accessToken || !recuerdoId || !proveedorId || !total || !vigencia || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/quotations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          recuerdo: recuerdoId,
          proveedor: Number(proveedorId),
          total,
          vigencia,
          estado: "enviada",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.mensaje || "No se pudo emitir la cotización.");
      }
      setCreada(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  if (!recuerdoId) {
    return (
      <Card>
        <p className="text-sm text-carbon/70">
          Abre esta página desde una solicitud en{" "}
          <Link href="/admin/solicitudes" className="text-borgona underline">Solicitudes</Link> para saber a
          quién cotizarle.
        </p>
      </Card>
    );
  }

  if (cargando) return <p className="text-sm text-carbon/50">Cargando…</p>;

  if (creada) {
    return (
      <Card className="text-center py-10">
        <p className="font-display text-lg text-borgona">¡Cotización emitida!</p>
        <p className="mt-2 text-sm text-carbon/70">
          Quedó registrada con estado &quot;Enviada&quot; para {recuerdo?.cliente_nombre}.
        </p>
        <Link href="/admin/cotizaciones" className="mt-4 inline-block text-borgona underline text-sm">
          Ver todas las cotizaciones →
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-borgona">{error}</p>}

      {recuerdo && (
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Solicitud</h2>
          <p className="text-sm text-carbon">
            <span className="font-medium">{recuerdo.cliente_nombre}</span>
            {recuerdo.objetos[0] && ` · ${recuerdo.objetos[0].tipo}`}
          </p>
          {recuerdo.historia && <p className="mt-1 text-sm text-carbon/60">{recuerdo.historia}</p>}
        </Card>
      )}

      {recomendaciones.length > 0 && (
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Recomendación de la IA</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {recomendaciones.map((r) => (
              <div key={r.id} className="rounded-xl border border-greige/60 bg-greige/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-borgona">{r.producto.nombre}</p>
                  <Badge tone="progress">{Math.round(Number(r.puntaje) * 100)}%</Badge>
                </div>
                <p className="mt-1 text-xs text-carbon/60">{r.justificacion}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">1. Elige producto y busca taller</h2>
        <form onSubmit={buscarProveedores} className="flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Producto</span>
            <select
              value={productoId}
              onChange={(e) => {
                setProductoId(e.target.value);
                const p = productos.find((pr) => pr.id === e.target.value);
                if (p) setTotal(String(p.precioBase));
              }}
              className="rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50 min-w-55"
            >
              <option value="">Selecciona un producto…</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-carbon/50 mb-1.5">Ciudad (opcional)</span>
            <input
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Ej: Medellín"
              className="rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50"
            />
          </label>
          <Button type="submit" variant="secondary" disabled={!productoId || buscando}>
            {buscando ? "Buscando…" : "Buscar talleres"}
          </Button>
        </form>

        {candidatos && candidatos.length === 0 && (
          <p className="mt-4 text-sm text-carbon/50">No hay talleres validados con esta capacidad todavía.</p>
        )}
        {candidatos && candidatos.length > 0 && (
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            {candidatos.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setProveedorId(String(c.id))}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  proveedorId === String(c.id)
                    ? "border-borgona bg-rosa/20"
                    : "border-greige/60 bg-white/70 hover:border-borgona/40"
                }`}
              >
                <p className="text-sm font-medium text-borgona">{c.nombre_taller}</p>
                <p className="text-xs text-carbon/60">{c.ciudad} · ★ {Number(c.calificacion).toFixed(1)}</p>
              </button>
            ))}
          </div>
        )}
      </Card>

      {proveedorId && (
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">2. Define el precio y la vigencia</h2>
          <form onSubmit={emitirCotizacion} className="flex flex-wrap items-end gap-4">
            <label className="block">
              <span className="block text-xs text-carbon/50 mb-1.5">Total (COP)</span>
              <input
                type="number"
                min={0}
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50 w-40"
              />
            </label>
            <label className="block">
              <span className="block text-xs text-carbon/50 mb-1.5">Válida hasta</span>
              <input
                type="date"
                value={vigencia}
                onChange={(e) => setVigencia(e.target.value)}
                className="rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50"
              />
            </label>
            <Button type="submit" variant="primary" disabled={!total || !vigencia || enviando}>
              {enviando ? "Emitiendo…" : "Emitir cotización"}
            </Button>
          </form>
          {productoSeleccionado && (
            <p className="mt-2 text-xs text-carbon/50">
              Precio de referencia del catálogo: {productoSeleccionado.nombre} — $
              {productoSeleccionado.precioBase.toLocaleString("es-CO")}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

export default function NuevaCotizacionPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Cotizaciones", "Nueva"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Emitir cotización</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Convierte una solicitud con recomendación de IA en una cotización real para el cliente.
      </p>
      <Suspense fallback={<p className="text-sm text-carbon/50">Cargando…</p>}>
        <NuevaCotizacionForm />
      </Suspense>
    </RolePortalShell>
  );
}
