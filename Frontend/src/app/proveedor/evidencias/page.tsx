"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const ICONS = "/images/proveedor";

const ESTADOS = [
  { value: "recibido", label: "Recibido" },
  { value: "en_evaluacion", label: "En evaluación" },
  { value: "en_proceso", label: "En proceso" },
  { value: "control_de_calidad", label: "Control de calidad" },
  { value: "en_camino", label: "En camino" },
  { value: "entregado", label: "Entregado" },
] as const;

const LABEL_ESTADO: Record<string, string> = Object.fromEntries(ESTADOS.map((e) => [e.value, e.label]));

interface EventoApi {
  id: number;
  estado: string;
  fecha: string;
  descripcion: string;
  evidencias_base64: string[];
}

interface PedidoApi {
  id: string;
  codigo: string;
  resumen: { objeto: string; cliente_nombre: string };
  eventos: EventoApi[];
}

function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result as string);
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ContenidoEvidencias() {
  const { accessToken } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pedidoSel, setPedidoSel] = useState<string>("");
  const [estado, setEstado] = useState<string>("en_proceso");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState<{ nombre: string; base64: string }[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => {
        const lista: PedidoApi[] = Array.isArray(data) ? data : data.results ?? [];
        setPedidos(lista);
        if (!pedidoSel && lista.length) setPedidoSel(lista[0].id);
      })
      .catch(() => setError("No se pudieron cargar los pedidos."));
  }

  useEffect(cargar, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  async function agregarFotos(lista: FileList | null) {
    if (!lista) return;
    const nuevas = await Promise.all(
      Array.from(lista).map(async (archivo) => ({ nombre: archivo.name, base64: await archivoABase64(archivo) }))
    );
    setFotos((prev) => [...prev, ...nuevas]);
  }

  async function registrarEvidencia(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !pedidoSel) return;
    setEnviando(true);
    setMensaje(null);
    try {
      const res = await fetch(`${API_URL}/orders/${pedidoSel}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ estado, descripcion, evidencias_base64: fotos.map((f) => f.base64) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.mensaje || "No se pudo registrar la evidencia.");
      }
      setDescripcion("");
      setFotos([]);
      setMensaje("Evidencia registrada correctamente.");
      cargar();
    } catch (err) {
      setMensaje(err instanceof Error ? err.message : "No se pudo registrar la evidencia.");
    } finally {
      setEnviando(false);
    }
  }

  const pedidoActual = pedidos?.find((p) => p.id === pedidoSel);

  if (!pedidos && !error) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <div className="relative">
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:pl-16">
          <h1 className="font-display text-4xl text-borgona">Evidencias</h1>
          <p className="mt-1 text-sm text-carbon/70 max-w-md">
            Documenta con fotos cada etapa del proceso — el cliente y Reviive pueden ver esta trazabilidad real.
          </p>
        </div>
      </section>

      {error && <p className="mx-auto max-w-6xl px-6 pt-6 text-sm text-borgona">{error}</p>}

      {pedidos && pedidos.length === 0 ? (
        <p className="mx-auto max-w-6xl px-6 py-8 text-sm text-carbon/60">Todavía no tienes pedidos asignados.</p>
      ) : (
        <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div>
            <h3 className="font-display text-base text-borgona mb-3">Historial por pedido</h3>
            <select
              value={pedidoSel}
              onChange={(e) => setPedidoSel(e.target.value)}
              className="w-full rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50 mb-4"
            >
              {pedidos?.map((p) => (
                <option key={p.id} value={p.id}>{p.codigo} — {p.resumen.objeto}</option>
              ))}
            </select>

            {pedidoActual && pedidoActual.eventos.length === 0 && (
              <p className="text-sm text-carbon/50">Este pedido todavía no tiene eventos registrados.</p>
            )}

            {pedidoActual && pedidoActual.eventos.length > 0 && (
              <div className="space-y-4">
                {pedidoActual.eventos.map((ev) => (
                  <div key={ev.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-display text-base text-carbon">{LABEL_ESTADO[ev.estado] ?? ev.estado}</p>
                      <span className="text-xs text-carbon/45">{fechaCorta(ev.fecha)}</span>
                    </div>
                    {ev.descripcion && <p className="mt-1 text-sm text-carbon/70">{ev.descripcion}</p>}
                    {ev.evidencias_base64.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ev.evidencias_base64.map((foto, i) => (
                          <span key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-greige/60 block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={foto} alt="Evidencia" className="h-full w-full object-cover" />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={registrarEvidencia} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Registrar nueva evidencia</h3>
            <label className="block mt-4">
              <span className="block text-sm text-carbon/75 mb-1.5">Etapa</span>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full rounded-xl border border-greige/70 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50"
              >
                {ESTADOS.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </label>
            <label className="block mt-3">
              <span className="block text-sm text-carbon/75 mb-1.5">Descripción</span>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder="Describe el estado del objeto en esta etapa…"
                className="w-full rounded-xl border border-greige/70 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50"
              />
            </label>
            <label className="block mt-3">
              <span className="block text-sm text-carbon/75 mb-1.5">Fotos</span>
              <input type="file" accept="image/*" multiple onChange={(e) => agregarFotos(e.target.files)} className="text-sm" />
            </label>
            {fotos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {fotos.map((f, i) => (
                  <span key={i} className="relative h-14 w-14 rounded-lg overflow-hidden border border-greige/60 block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.base64} alt={f.nombre} className="h-full w-full object-cover" />
                  </span>
                ))}
              </div>
            )}
            {mensaje && <p className="mt-3 text-sm text-borgona">{mensaje}</p>}
            <Button type="submit" disabled={enviando} className="mt-4 w-full">
              {enviando ? "Guardando…" : "Registrar evidencia"}
            </Button>
          </form>
        </section>
      )}

      <section className="mx-auto max-w-6xl w-full px-6 pb-16 flex items-center gap-2">
        <span className="relative h-5 w-5 shrink-0 opacity-70">
          <Image src={`${ICONS}/evi-icon-hourglass.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
        </span>
        <p className="text-xs text-carbon/50">
          La recepción del objeto exige siempre foto y descripción de su condición (regla de negocio RN-06).
        </p>
      </section>
    </div>
  );
}

export default function EvidenciasPage() {
  return (
    <ProveedorShell activeHref="/proveedor/evidencias">
      <ContenidoEvidencias />
    </ProveedorShell>
  );
}
