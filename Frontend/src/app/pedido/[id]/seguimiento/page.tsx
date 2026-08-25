"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { IconReloj } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const MEMORIAL_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_MEMORIAL_WEBHOOK_URL ??
  "http://127.0.0.1:5678/webhook/reviive/memorials/memorial-creado";

function generarSlug(base: string): string {
  const limpio = base
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const sufijo = Math.random().toString(36).slice(2, 8);
  return `${limpio || "memorial"}-${sufijo}`;
}

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
  evidencias_base64: string[];
}

interface ResenaApi {
  puntaje: number;
  comentario: string;
}

interface PedidoApi {
  id: string;
  codigo: string;
  estado: string;
  resumen: {
    recuerdo_id: string;
    objeto: string;
    proveedor: string;
    memorial_slug: string | null;
  };
  eventos: EventoApi[];
  resena: ResenaApi | null;
}

export default function SeguimientoPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [pedido, setPedido] = useState<PedidoApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creandoMemorial, setCreandoMemorial] = useState(false);
  const [errorMemorial, setErrorMemorial] = useState<string | null>(null);
  const [puntajeSeleccionado, setPuntajeSeleccionado] = useState(0);
  const [comentarioResena, setComentarioResena] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [errorResena, setErrorResena] = useState<string | null>(null);

  async function enviarResena() {
    if (!accessToken || !id || puntajeSeleccionado === 0) return;
    setEnviandoResena(true);
    setErrorResena(null);
    try {
      const res = await fetch(`${API_URL}/orders/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ puntaje: puntajeSeleccionado, comentario: comentarioResena }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.mensaje || "No se pudo enviar tu calificación.");
      }
      setPedido((prev) => (prev ? { ...prev, resena: { puntaje: puntajeSeleccionado, comentario: comentarioResena } } : prev));
    } catch (err) {
      setErrorResena(err instanceof Error ? err.message : "No se pudo enviar tu calificación.");
    } finally {
      setEnviandoResena(false);
    }
  }

  async function crearMemorial() {
    if (!pedido || !accessToken) return;
    setCreandoMemorial(true);
    setErrorMemorial(null);
    try {
      const slug = generarSlug(pedido.resumen.objeto || pedido.codigo);
      const res = await fetch(`${API_URL}/memorials/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          recuerdo: pedido.resumen.recuerdo_id,
          slug,
          visibilidad: "con_enlace",
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear el memorial.");
      const memorial = await res.json();

      try {
        await fetch(MEMORIAL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken, memorial_id: memorial.id }),
        });
      } catch {
        // si el agente no responde, el memorial ya existe; se puede ver igual
      }

      router.push(`/memorial/${slug}`);
    } catch (err) {
      setErrorMemorial(err instanceof Error ? err.message : "No se pudo crear el memorial.");
      setCreandoMemorial(false);
    }
  }

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

        {pedido.eventos.some((e) => e.evidencias_base64.length > 0) && (
          <Card className="mt-6">
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">
              Evidencia del proceso
            </h2>
            <div className="space-y-4">
              {pedido.eventos
                .filter((e) => e.evidencias_base64.length > 0)
                .map((e) => (
                  <div key={e.id}>
                    <p className="text-xs text-carbon/55 mb-1.5">
                      {etiquetas[e.estado] ?? e.estado} · {new Date(e.fecha).toLocaleDateString("es-CO")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {e.evidencias_base64.map((foto, i) => (
                        <span key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-greige/60 block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={foto} alt="Evidencia del taller" className="h-full w-full object-cover" />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {pedido.estado === "entregado" && (
          <Card className="mt-6">
            <h2 className="font-display text-lg text-borgona">Tu opinión</h2>
            {pedido.resena ? (
              <>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-lg ${pedido.resena!.puntaje >= i + 1 ? "text-dorado-suave" : "text-greige/60"}`}>★</span>
                  ))}
                </div>
                {pedido.resena.comentario && <p className="mt-2 text-sm text-carbon/65 italic">&ldquo;{pedido.resena.comentario}&rdquo;</p>}
                <p className="mt-2 text-xs text-carbon/45">Gracias por calificar tu experiencia.</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-carbon/65">Tu pedido fue entregado. ¿Cómo fue tu experiencia con el taller?</p>
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPuntajeSeleccionado(i + 1)}
                      className={`text-2xl transition-colors ${puntajeSeleccionado >= i + 1 ? "text-dorado-suave" : "text-greige/60 hover:text-dorado-suave/60"}`}
                      aria-label={`${i + 1} estrellas`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={comentarioResena}
                  onChange={(e) => setComentarioResena(e.target.value)}
                  rows={2}
                  placeholder="Cuéntanos cómo te fue (opcional)…"
                  className="mt-3 w-full rounded-xl border border-greige/70 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50"
                />
                {errorResena && <p className="mt-2 text-sm text-borgona">{errorResena}</p>}
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={enviarResena}
                  disabled={enviandoResena || puntajeSeleccionado === 0}
                >
                  {enviandoResena ? "Enviando…" : "Enviar calificación"}
                </Button>
              </>
            )}
          </Card>
        )}

        {pedido.estado === "entregado" && (
          <Card className="mt-6 bg-gradient-to-br from-rosa/30 to-marfil">
            <h2 className="font-display text-lg text-borgona">Memorial digital</h2>
            {pedido.resumen.memorial_slug ? (
              <>
                <p className="mt-2 text-sm text-carbon/65">
                  Ya tienes un memorial digital para este recuerdo.
                </p>
                <Link
                  href={`/memorial/${pedido.resumen.memorial_slug}`}
                  className="mt-3 inline-block text-xs text-borgona underline"
                >
                  Ver memorial →
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-carbon/65">
                  Tu pedido fue entregado. Si quieres, Alma puede redactar un memorial digital
                  con la historia de este recuerdo para conservarlo o compartirlo.
                </p>
                {errorMemorial && <p className="mt-2 text-sm text-borgona">{errorMemorial}</p>}
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={crearMemorial}
                >
                  {creandoMemorial ? "Creando memorial…" : "Crear memorial digital"}
                </Button>
              </>
            )}
          </Card>
        )}
      </div>
    </SiteShell>
  );
}
