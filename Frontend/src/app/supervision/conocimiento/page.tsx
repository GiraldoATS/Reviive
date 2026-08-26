"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface FuenteApi {
  id: number;
  nombre: string;
  tipo: string;
  version: string;
  estado: "activa" | "desactualizada" | "archivada";
  url_o_referencia: string;
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  activa: "success",
  desactualizada: "pending",
  archivada: "pending",
};

export default function ConocimientoSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [fuentes, setFuentes] = useState<FuenteApi[] | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [referencia, setReferencia] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/knowledge-sources/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setFuentes(data.results ?? data));
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
      await fetch(`${API_URL}/knowledge-sources/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ nombre, tipo, url_o_referencia: referencia }),
      });
      setModalAbierto(false);
      setNombre("");
      setTipo("");
      setReferencia("");
      cargar();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Base de conocimiento"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Base de conocimiento</h1>
          <p className="text-sm text-carbon/55">Fuentes reales que consultan los agentes para responder con precisión.</p>
        </div>
        <Button variant="primary" className="text-xs" onClick={() => setModalAbierto(true)}>+ Nueva fuente</Button>
      </div>

      {!fuentes && <p className="text-sm text-carbon/50">Cargando…</p>}
      {fuentes && fuentes.length === 0 && (
        <p className="text-sm text-carbon/50">Todavía no has registrado fuentes de conocimiento.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {fuentes?.map((f) => (
          <Card key={f.id}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-carbon">{f.nombre}</h3>
              <Badge tone={toneByEstado[f.estado]}>{f.estado}</Badge>
            </div>
            <p className="mt-2 text-sm text-carbon/55">Versión {f.version}{f.tipo ? ` · ${f.tipo}` : ""}</p>
            {f.url_o_referencia && <p className="mt-1 text-xs text-carbon/45 truncate">{f.url_o_referencia}</p>}
          </Card>
        ))}
      </div>

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} className="max-w-md">
        <form onSubmit={crear} className="p-6 sm:p-8">
          <h3 className="font-display text-xl text-borgona">Nueva fuente de conocimiento</h3>
          <label className="block mt-4">
            <span className="block text-sm text-carbon/75 mb-1.5">Nombre</span>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Tipo (opcional)</span>
            <input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Catálogo, política, FAQ…" className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Referencia / URL (opcional)</span>
            <input value={referencia} onChange={(e) => setReferencia(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{guardando ? "Guardando…" : "Guardar fuente"}</Button>
          </div>
        </form>
      </Modal>
    </RolePortalShell>
  );
}
