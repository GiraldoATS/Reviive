"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface PendienteApi {
  ejecucion: string;
  agente_display: string;
  reply: string;
  puntaje: string;
}

const CATEGORIAS = [
  { value: "informacion_incorrecta", label: "Información incorrecta" },
  { value: "tono_inadecuado", label: "Tono inadecuado" },
  { value: "regla_de_negocio", label: "Violación de regla de negocio" },
  { value: "fuera_de_alcance", label: "Fuera de alcance" },
  { value: "otro", label: "Otro" },
];

function ContenidoRevision() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [pendientes, setPendientes] = useState<PendienteApi[] | null>(null);
  const [seleccionada, setSeleccionada] = useState<PendienteApi | null>(null);
  const [respuestaEsperada, setRespuestaEsperada] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0].value);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/corrections/pendientes`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: PendienteApi[]) => {
        setPendientes(data);
        setSeleccionada((actual) => actual ?? data[0] ?? null);
      });
  }

  useEffect(() => {
    if (cargandoSesion) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  async function decidir(decision: "aprobar_para_dataset" | "descartar") {
    if (!accessToken || !seleccionada) return;
    setGuardando(true);
    setMensaje(null);
    try {
      await fetch(`${API_URL}/corrections/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          ejecucion: seleccionada.ejecucion,
          categoria_error: categoria,
          respuesta_esperada: respuestaEsperada,
          decision,
        }),
      });
      setMensaje(decision === "aprobar_para_dataset" ? "Corrección aprobada para el dataset." : "Marcada como descartada.");
      setRespuestaEsperada("");
      setSeleccionada(null);
      cargar();
    } finally {
      setGuardando(false);
    }
  }

  if (!pendientes) {
    return <p className="text-sm text-carbon/50">Cargando…</p>;
  }

  if (pendientes.length === 0 && !seleccionada) {
    return <p className="text-sm text-carbon/50">No hay respuestas pendientes de revisión en este momento.</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Corregir y clasificar una respuesta</h1>
          <p className="text-sm text-carbon/55">
            {seleccionada ? `${seleccionada.agente_display} · puntaje ${(Number(seleccionada.puntaje) * 100).toFixed(0)}%` : ""}
          </p>
        </div>
        <Badge tone="pending">{pendientes.length} pendiente{pendientes.length === 1 ? "" : "s"}</Badge>
      </div>

      {mensaje && <p className="mb-4 text-sm text-emerald-700">{mensaje}</p>}

      {seleccionada && (
        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Respuesta original del agente</h2>
            <p className="text-sm text-carbon/75 bg-marfil border border-greige/70 rounded-xl p-4">{seleccionada.reply || "(sin respuesta)"}</p>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mt-6 mb-2">Respuesta esperada</h2>
            <textarea
              className="input resize-none"
              rows={4}
              value={respuestaEsperada}
              onChange={(e) => setRespuestaEsperada(e.target.value)}
              placeholder="Escribe la respuesta correcta que el agente debió dar..."
            />
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mt-6 mb-2">Categoría del error</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategoria(c.value)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    categoria === c.value ? "bg-borgona text-marfil" : "border border-greige/70 text-carbon/60"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="h-fit space-y-3">
            <h2 className="text-xs uppercase tracking-wide text-carbon/50">Decisión</h2>
            <Button variant="primary" className="w-full justify-center" onClick={() => decidir("aprobar_para_dataset")} disabled={guardando || !respuestaEsperada}>
              Aprobar corrección
            </Button>
            <Button variant="ghost" className="w-full justify-center text-[#a64b4b]" onClick={() => decidir("descartar")} disabled={guardando}>
              Descartar
            </Button>
          </Card>
        </div>
      )}
    </>
  );
}

export default function RevisionSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Revisión y corrección"]}>
      <ContenidoRevision />
    </RolePortalShell>
  );
}
