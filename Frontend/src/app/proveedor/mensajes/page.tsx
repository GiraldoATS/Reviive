"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface PedidoApi {
  id: string;
  codigo: string;
  resumen: { objeto: string; cliente_nombre: string };
}

interface MensajeApi {
  id: number;
  autor: number;
  autor_nombre: string;
  contenido: string;
  creado_en: string;
}

function horaCorta(iso: string) {
  return new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function ContenidoMensajes() {
  const { accessToken, usuario } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoApi[] | null>(null);
  const [pedidoSel, setPedidoSel] = useState<string>("");
  const [mensajes, setMensajes] = useState<MensajeApi[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => {
        const lista: PedidoApi[] = Array.isArray(data) ? data : data.results ?? [];
        setPedidos(lista);
        if (lista.length) setPedidoSel(lista[0].id);
      })
      .catch(() => setError("No se pudieron cargar tus pedidos."));
  }, [accessToken]);

  function cargarMensajes() {
    if (!accessToken || !pedidoSel) return;
    fetch(`${API_URL}/orders/${pedidoSel}/messages`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then(setMensajes)
      .catch(() => setError("No se pudieron cargar los mensajes."));
  }

  useEffect(cargarMensajes, [accessToken, pedidoSel]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !pedidoSel || !texto.trim()) return;
    setEnviando(true);
    try {
      await fetch(`${API_URL}/orders/${pedidoSel}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ contenido: texto }),
      });
      setTexto("");
      cargarMensajes();
    } finally {
      setEnviando(false);
    }
  }

  const pedidoActual = pedidos?.find((p) => p.id === pedidoSel);

  if (!pedidos && !error) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl text-borgona mb-1">Mensajes</h1>
      <p className="text-sm text-carbon/70 mb-6">Conversa directamente con tus clientes sobre cada pedido.</p>

      {error && <p className="text-sm text-borgona mb-4">{error}</p>}

      {pedidos && pedidos.length === 0 ? (
        <p className="text-sm text-carbon/60">Todavía no tienes pedidos con clientes para conversar.</p>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 rounded-2xl border border-greige/50 bg-greige/20 overflow-hidden">
          <div className="border-r border-greige/50 max-h-[520px] overflow-y-auto">
            {pedidos?.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPedidoSel(p.id)}
                className={`block w-full text-left px-4 py-3 text-sm border-b border-greige/40 transition-colors ${
                  pedidoSel === p.id ? "bg-borgona/10" : "hover:bg-white/50"
                }`}
              >
                <p className="font-medium text-carbon">{p.codigo}</p>
                <p className="text-xs text-carbon/60">{p.resumen.cliente_nombre} · {p.resumen.objeto}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col min-h-[420px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mensajes.length === 0 && (
                <p className="text-sm text-carbon/50 text-center mt-8">
                  Todavía no hay mensajes en {pedidoActual?.codigo ?? "este pedido"}. Escribe el primero.
                </p>
              )}
              {mensajes.map((m) => {
                const esMio = m.autor === usuario?.id;
                return (
                  <div key={m.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${esMio ? "bg-borgona text-marfil" : "bg-white border border-greige/60"}`}>
                      {!esMio && <p className="text-xs font-medium mb-0.5 text-carbon/60">{m.autor_nombre}</p>}
                      <p>{m.contenido}</p>
                      <p className={`mt-1 text-[10px] ${esMio ? "text-marfil/70" : "text-carbon/40"}`}>{horaCorta(m.creado_en)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={enviar} className="border-t border-greige/50 p-3 flex gap-2">
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe un mensaje…"
                className="flex-1 rounded-full border border-greige/70 bg-white px-4 py-2.5 text-sm outline-none focus:border-borgona/50"
              />
              <Button type="submit" disabled={enviando || !texto.trim()} className="text-sm">
                Enviar
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MensajesPage() {
  return (
    <ProveedorShell activeHref="/proveedor/mensajes">
      <ContenidoMensajes />
    </ProveedorShell>
  );
}
