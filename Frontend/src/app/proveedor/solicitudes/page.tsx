"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const ICONS = "/images/proveedor";

interface CotizacionApi {
  id: string;
  recuerdo: string;
  cliente_nombre: string;
  producto_nombre: string;
  generada_por_ia: boolean;
  total: string;
  vigencia: string;
  estado: string;
  creado_en: string;
}

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function ContenidoSolicitudes() {
  const { accessToken } = useAuth();
  const [solicitudes, setSolicitudes] = useState<CotizacionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState<string | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/quotations/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => {
        const todas: CotizacionApi[] = Array.isArray(data) ? data : data.results ?? [];
        setSolicitudes(todas.filter((c) => c.estado === "borrador"));
      })
      .catch(() => setError("No se pudieron cargar las solicitudes."));
  }

  useEffect(cargar, [accessToken]);

  async function guardarMonto(id: string) {
    if (!accessToken) return;
    const nuevoTotal = editando[id];
    if (!nuevoTotal) return;
    await fetch(`${API_URL}/quotations/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ total: nuevoTotal }),
    });
    setEditando((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    cargar();
  }

  async function enviar(id: string) {
    if (!accessToken) return;
    setEnviando(id);
    try {
      await fetch(`${API_URL}/quotations/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ estado: "enviada" }),
      });
      cargar();
    } finally {
      setEnviando(null);
    }
  }

  if (!solicitudes && !error) {
    return <div className="min-h-[60vh]" />;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 hidden h-[1050px] w-40 opacity-20 lg:block">
        <Image src={`${ICONS}/sol-rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-top" unoptimized />
      </div>

      <section className="relative overflow-hidden bg-greige/15">
        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Solicitudes</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Estas son las cotizaciones que nuestro sistema preparó para ti — algunas con un borrador generado
              automáticamente. Revísalas, ajusta el valor si lo necesitas, y envíalas al cliente.
            </p>
          </div>
          <div className="relative hidden lg:block min-h-[240px]">
            <Image src={`${ICONS}/sol-hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8">
        {error && <p className="text-sm text-borgona mb-4">{error}</p>}

        {solicitudes && solicitudes.length === 0 ? (
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-10 text-center">
            <h2 className="font-display text-xl text-carbon">No tienes solicitudes pendientes</h2>
            <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
              Cuando el sistema te asigne un recuerdo compatible con tu taller, aparecerá aquí con un borrador de
              cotización listo para tu revisión.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes?.map((s) => (
              <div key={s.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="relative h-16 w-16 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                    <span className="relative h-9 w-9 block">
                      <Image src={`${ICONS}/sol-icon-documento.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
                    </span>
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg text-carbon">{s.producto_nombre || "Servicio a definir"}</p>
                      {s.generada_por_ia && (
                        <span className="rounded-full px-3 py-1 text-[11px] font-medium bg-dorado-suave/20 text-borgona-dark">
                          Borrador generado por IA
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-carbon/65">
                      <span>Cliente: {s.cliente_nombre}</span>
                      <span>Recibida: {fechaCorta(s.creado_en)}</span>
                      <span>Vigencia: hasta {fechaCorta(s.vigencia)}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2 w-full sm:w-auto">
                    <label className="text-xs text-carbon/60">
                      Valor propuesto
                      <input
                        type="number"
                        min="0"
                        defaultValue={s.total}
                        onChange={(e) => setEditando((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        className="mt-1 block w-40 rounded-lg border border-greige/70 bg-white px-3 py-1.5 text-sm text-right outline-none focus:border-borgona/50"
                      />
                    </label>
                    <p className="text-xs text-carbon/45">{formatoCOP(Number(editando[s.id] ?? s.total))}</p>
                    <div className="flex gap-2">
                      {editando[s.id] !== undefined && (
                        <button
                          type="button"
                          onClick={() => guardarMonto(s.id)}
                          className="rounded-full border border-borgona text-borgona px-4 py-1.5 text-xs hover:bg-borgona/5 transition-colors"
                        >
                          Guardar valor
                        </button>
                      )}
                      <Button
                        onClick={() => enviar(s.id)}
                        disabled={enviando === s.id}
                        className="text-xs whitespace-nowrap"
                      >
                        {enviando === s.id ? "Enviando…" : "Enviar cotización"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function SolicitudesPage() {
  return (
    <ProveedorShell activeHref="/proveedor/solicitudes">
      <ContenidoSolicitudes />
    </ProveedorShell>
  );
}
