"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const ICONS = "/images/proveedor";

interface ResenaApi {
  puntaje: number;
  comentario: string;
  creado_en: string;
}

interface PedidoApi {
  id: string;
  codigo: string;
  estado: string;
  resumen: { objeto: string; cliente_nombre: string };
  resena: ResenaApi | null;
}

function Estrellas({ valor }: { valor: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${valor >= i + 1 ? "text-dorado-suave" : "text-greige/60"}`}>★</span>
      ))}
    </span>
  );
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function ContenidoCalificaciones() {
  const { accessToken } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setPedidos(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError("No se pudieron cargar las calificaciones."));
  }, [accessToken]);

  const resenas = useMemo(
    () => (pedidos ?? []).filter((p) => p.resena).map((p) => ({ pedido: p, resena: p.resena as ResenaApi })),
    [pedidos]
  );
  const pendientes = useMemo(
    () => (pedidos ?? []).filter((p) => p.estado === "entregado" && !p.resena),
    [pedidos]
  );

  const promedio = resenas.length
    ? resenas.reduce((acc, r) => acc + r.resena.puntaje, 0) / resenas.length
    : 0;

  const distribucion = [5, 4, 3, 2, 1].map((estrellas) => {
    const cantidad = resenas.filter((r) => r.resena.puntaje === estrellas).length;
    return { estrellas, cantidad, pct: resenas.length ? Math.round((cantidad / resenas.length) * 100) : 0 };
  });

  if (!pedidos && !error) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:pl-16">
          <h1 className="font-display text-4xl text-borgona">Calificaciones</h1>
          <p className="mt-1 text-sm text-carbon/70 max-w-md">
            Consulta cómo valoran tus clientes la calidad de tu trabajo, con base en reseñas reales de tus pedidos
            entregados.
          </p>
        </div>
      </section>

      {error && <p className="mx-auto max-w-6xl px-6 pt-6 text-sm text-borgona">{error}</p>}

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 block">
            <Image src={`${ICONS}/cal-icon-star.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <div>
            <p className="font-display text-2xl text-carbon leading-tight">
              {resenas.length ? promedio.toFixed(1) : "—"} <span className="text-sm text-carbon/50">/ 5</span>
            </p>
            <p className="mt-0.5 text-xs text-carbon/60">Calificación promedio</p>
          </div>
        </div>
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 block">
            <Image src={`${ICONS}/cal-icon-people.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <div>
            <p className="font-display text-2xl text-carbon leading-tight">{resenas.length}</p>
            <p className="mt-0.5 text-xs text-carbon/60">Total de calificaciones</p>
          </div>
        </div>
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 block">
            <Image src={`${ICONS}/cal-icon-chat-dots.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <div>
            <p className="font-display text-2xl text-carbon leading-tight">{pendientes.length}</p>
            <p className="mt-0.5 text-xs text-carbon/60">Pedidos entregados sin calificar</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-borgona">Distribución de calificaciones</h3>
          <ul className="mt-4 space-y-2.5">
            {distribucion.map((d) => (
              <li key={d.estrellas} className="flex items-center gap-3 text-sm">
                <span className="w-20 shrink-0 whitespace-nowrap text-carbon/70">{d.estrellas} estrellas</span>
                <div className="flex-1 h-2 rounded-full bg-greige/40 overflow-hidden">
                  <div className="h-full rounded-full bg-dorado-suave" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right text-carbon/50 text-xs">{d.cantidad} ({d.pct}%)</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8">
        <h3 className="font-display text-lg text-borgona mb-4">Reseñas de clientes</h3>
        {resenas.length === 0 ? (
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-8 text-center text-sm text-carbon/60">
            Todavía no tienes reseñas. Aparecerán aquí cuando tus clientes califiquen un pedido entregado.
          </div>
        ) : (
          <div className="space-y-4">
            {resenas.map(({ pedido, resena }) => (
              <div key={pedido.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg text-carbon">Pedido #{pedido.codigo}</p>
                      <p className="text-sm text-carbon/70">{pedido.resumen.objeto}</p>
                    </div>
                    <p className="mt-1 text-xs text-carbon/60">Cliente: {pedido.resumen.cliente_nombre}</p>
                    {resena.comentario && (
                      <p className="mt-2 text-sm text-carbon/70 italic">&ldquo;{resena.comentario}&rdquo;</p>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <Estrellas valor={resena.puntaje} />
                      <span className="text-sm text-carbon font-medium">{resena.puntaje.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-carbon/40">{fechaCorta(resena.creado_en)}</span>
                    <Link href="/proveedor/pedidos" className="rounded-full border border-borgona text-borgona px-3 py-1.5 text-xs hover:bg-borgona/5 transition-colors">
                      Ver pedido
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function CalificacionesPage() {
  return (
    <ProveedorShell activeHref="/proveedor/calificaciones">
      <ContenidoCalificaciones />
    </ProveedorShell>
  );
}
