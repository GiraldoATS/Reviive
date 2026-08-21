"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import { IconReloj } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const ordenEstados = [
  "recibido",
  "en_evaluacion",
  "en_proceso",
  "control_de_calidad",
  "en_camino",
  "entregado",
];

const etiquetas: Record<string, string> = {
  recibido: "Recibido",
  en_evaluacion: "En evaluación",
  en_proceso: "En proceso",
  control_de_calidad: "Control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

interface EventoApi {
  id: number;
  estado: string;
  fecha: string;
  descripcion: string;
}

interface PedidoApi {
  id: string;
  codigo: string;
  estado: string;
  resumen: { objeto: string; proveedor: string };
  eventos: EventoApi[];
}

export default function SeguimientoPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [pedido, setPedido] = useState<PedidoApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/orders/${id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (res.status === 404 || res.status === 403) throw new Error("No encontramos ese pedido, o no tienes acceso a él.");
        if (!res.ok) throw new Error("No se pudo cargar el seguimiento.");
        return res.json();
      })
      .then(setPedido)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion, id]);

  if (!cargandoSesion && !accessToken) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="text-carbon/70 mb-4">Inicia sesión para ver el seguimiento.</p>
          <Link href="/auth/login" className="text-borgona underline text-sm">Iniciar sesión →</Link>
        </div>
      </SiteShell>
    );
  }

  if (error) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-6 py-14 text-center text-borgona">{error}</div>
      </SiteShell>
    );
  }

  if (!pedido) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-6 py-14 text-center text-carbon/60">Cargando el seguimiento…</div>
      </SiteShell>
    );
  }

  const indiceActual = ordenEstados.indexOf(pedido.estado);
  const eventosPorEstado = new Map(pedido.eventos.map((e) => [e.estado, e]));
  const ultimoEvento = pedido.eventos[pedido.eventos.length - 1];

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-2xl text-carbon">
          Seguimiento de tu pedido
        </h1>
        <p className="text-sm text-carbon/55 mt-1">Pedido #{pedido.codigo}</p>

        <div className="mt-10 flex justify-between relative">
          <div className="absolute top-3 left-3 right-3 h-px bg-greige/70" />
          {ordenEstados.map((estado, i) => {
            const evento = eventosPorEstado.get(estado);
            const estadoRelativo =
              i < indiceActual ? "completado" : i === indiceActual ? "actual" : "pendiente";
            return (
              <div key={estado} className="relative z-10 flex flex-col items-center gap-2 text-center w-24">
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
                    estadoRelativo === "completado"
                      ? "bg-[#e3ead9] border-[#3f5c2b] text-[#3f5c2b]"
                      : estadoRelativo === "actual"
                      ? "bg-borgona border-borgona text-marfil"
                      : "bg-marfil border-greige text-carbon/40"
                  }`}
                >
                  {estadoRelativo === "completado" ? "✓" : i + 1}
                </div>
                <span className="text-xs text-carbon/70">{etiquetas[estado]}</span>
                {evento && (
                  <span className="text-[10px] text-carbon/45">
                    {new Date(evento.fecha).toLocaleDateString("es-CO")}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">
              Estado actual
            </h2>
            <p className="text-sm text-carbon/75">
              {ultimoEvento?.descripcion ||
                "Tu pedido fue recibido; el taller aún no ha registrado avances."}
            </p>
          </Card>
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">
              Tu objeto
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-lg bg-marfil border border-greige/70 flex items-center justify-center">
                <IconReloj className="h-7 w-7 text-borgona" />
              </div>
              <div>
                <p className="text-sm font-medium text-carbon">{pedido.resumen.objeto || "Objeto sin especificar"}</p>
                <p className="text-xs text-carbon/50">{pedido.resumen.proveedor}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
