"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { IconReloj } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface PedidoApi {
  id: string;
  codigo: string;
  estado: string;
  total: string;
  resumen: { objeto: string; historia: string; proveedor: string };
  eventos: unknown[];
}

export default function DetallePedidoPage() {
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
        if (!res.ok) throw new Error("No se pudo cargar el pedido.");
        return res.json();
      })
      .then(setPedido)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion, id]);

  if (!cargandoSesion && !accessToken) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-6 py-14 text-center">
          <p className="text-carbon/70 mb-4">Inicia sesión para ver este pedido.</p>
          <Link href="/auth/login" className="text-borgona underline text-sm">Iniciar sesión →</Link>
        </div>
      </SiteShell>
    );
  }

  if (error) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-6 py-14 text-center text-borgona">{error}</div>
      </SiteShell>
    );
  }

  if (!pedido) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-6 py-14 text-center text-carbon/60">Cargando tu pedido…</div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-14">
        <Card>
          <h1 className="font-display text-2xl text-carbon">
            Detalle de tu pedido
          </h1>
          <p className="text-sm text-carbon/55 mt-1">Pedido #{pedido.codigo}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-marfil border border-greige/70 flex items-center justify-center">
              <IconReloj className="h-8 w-8 text-borgona" />
            </div>
            <div>
              <p className="font-medium text-carbon">{pedido.resumen.objeto || "Objeto sin especificar"}</p>
              <p className="text-xs text-carbon/55">Taller: {pedido.resumen.proveedor}</p>
            </div>
          </div>

          {pedido.resumen.historia && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">
                Tu historia
              </h2>
              <p className="text-sm text-carbon/75">{pedido.resumen.historia}</p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-greige/70 pt-4">
            <span className="text-sm text-carbon/60">Total</span>
            <span className="font-display text-xl text-borgona">
              ${Number(pedido.total).toLocaleString("es-CO")}
            </span>
          </div>

          <div className="mt-8 flex gap-3">
            <Button href={`/pedido/${pedido.id}/seguimiento`} variant="primary" className="flex-1 justify-center">
              Ver seguimiento
            </Button>
            <Button href="/recomendaciones" variant="secondary">
              Volver
            </Button>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
