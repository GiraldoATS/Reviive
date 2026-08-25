"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const AGENTES = [
  "orquestador", "acompanamiento", "extraccion", "creativo", "viabilidad",
  "recomendacion", "proveedores", "cotizacion", "pedidos", "memorial", "seguridad", "evaluador",
] as const;

interface CasoApi {
  id: number;
  agente: string;
  agente_display: string;
  nombre: string;
  entrada: string;
  resultado_esperado: string;
  resultado: "pendiente" | "aprobado" | "requiere_revision";
  notas: string;
}

const toneByResultado: Record<string, "success" | "progress" | "pending"> = {
  pendiente: "progress",
  aprobado: "success",
  requiere_revision: "pending",
};

const labelByResultado: Record<string, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  requiere_revision: "Requiere revisión",
};

export default function PruebasAgentesSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [casos, setCasos] = useState<CasoApi[] | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [agente, setAgente] = useState<(typeof AGENTES)[number]>("acompanamiento");
  const [nombre, setNombre] = useState("");
  const [entrada, setEntrada] = useState("");
  const [resultadoEsperado, setResultadoEsperado] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/test-cases/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setCasos(data.results ?? data));
  }

  useEffect(() => {
    if (cargandoSesion) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setGuardando(true);
    try {
      await fetch(`${API_URL}/test-cases/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ agente, nombre, entrada, resultado_esperado: resultadoEsperado }),
      });
      setModalAbierto(false);
      setNombre("");
      setEntrada("");
      setResultadoEsperado("");
      cargar();
    } finally {
      setGuardando(false);
    }
  }

  async function marcarResultado(id: number, resultado: string) {
    if (!accessToken) return;
    await fetch(`${API_URL}/test-cases/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ resultado }),
    });
    cargar();
  }

  const aprobados = casos?.filter((c) => c.resultado === "aprobado").length ?? 0;
  const requierenRevision = casos?.filter((c) => c.resultado === "requiere_revision").length ?? 0;

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Agentes", "Pruebas"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Pruebas de agentes</h1>
          <p className="text-sm text-carbon/55">Casos de regresión reales (RN-12): registra el caso, revísalo y marca el resultado.</p>
        </div>
        <Button variant="primary" className="text-xs" onClick={() => setModalAbierto(true)}>+ Nuevo caso</Button>
      </div>

      {!casos && <p className="text-sm text-carbon/50">Cargando…</p>}
      {casos && casos.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay casos de prueba registrados.</p>}

      {casos && casos.length > 0 && (
        <>
          <p className="text-sm text-carbon/60 mb-4">{aprobados} aprobados · {requierenRevision} requieren revisión de {casos.length} totales.</p>
          <Card>
            <SimpleTable
              columns={["Caso de prueba", "Agente", "Resultado", ""]}
              rows={casos.map((c) => [
                c.nombre,
                c.agente_display,
                <Badge key="e" tone={toneByResultado[c.resultado]}>{labelByResultado[c.resultado]}</Badge>,
                <select
                  key="a"
                  value={c.resultado}
                  onChange={(e) => marcarResultado(c.id, e.target.value)}
                  className="rounded-lg border border-greige/60 bg-white px-2 py-1 text-xs outline-none"
                >
                  {Object.entries(labelByResultado).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>,
              ])}
            />
          </Card>
        </>
      )}

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} className="max-w-lg">
        <form onSubmit={crear} className="p-6 sm:p-8">
          <h3 className="font-display text-xl text-borgona">Nuevo caso de prueba</h3>
          <label className="block mt-4">
            <span className="block text-sm text-carbon/75 mb-1.5">Agente</span>
            <select value={agente} onChange={(e) => setAgente(e.target.value as typeof agente)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none">
              {AGENTES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Nombre del caso</span>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Entrada / escenario a probar</span>
            <textarea required rows={3} value={entrada} onChange={(e) => setEntrada(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Resultado esperado</span>
            <textarea rows={2} value={resultadoEsperado} onChange={(e) => setResultadoEsperado(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{guardando ? "Guardando…" : "Guardar caso"}</Button>
          </div>
        </form>
      </Modal>
    </RolePortalShell>
  );
}
