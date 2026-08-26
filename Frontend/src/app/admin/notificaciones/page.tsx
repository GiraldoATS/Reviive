"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { IconPlus } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface PlantillaApi {
  id: number;
  nombre: string;
  canal: "correo" | "telegram";
  asunto: string;
  cuerpo: string;
  activa: boolean;
  actualizado_en: string;
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function NotificacionesAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [plantillas, setPlantillas] = useState<PlantillaApi[] | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [canal, setCanal] = useState<"correo" | "telegram">("correo");
  const [asunto, setAsunto] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/notification-templates/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((data) => setPlantillas(data.results ?? data));
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
      await fetch(`${API_URL}/notification-templates/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ nombre, canal, asunto, cuerpo }),
      });
      setModalAbierto(false);
      setNombre("");
      setAsunto("");
      setCuerpo("");
      cargar();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Notificaciones"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Notificaciones y plantillas</h1>
          <p className="text-sm text-carbon/55">Crea y gestiona plantillas reales de correo y Telegram.</p>
        </div>
        <Button variant="primary" className="text-xs" onClick={() => setModalAbierto(true)}><IconPlus className="h-4 w-4" /> Nueva plantilla</Button>
      </div>

      {!plantillas && <p className="text-sm text-carbon/50">Cargando…</p>}
      {plantillas && plantillas.length === 0 && <p className="text-sm text-carbon/50">Todavía no hay plantillas creadas.</p>}

      {plantillas && plantillas.length > 0 && (
        <SimpleTable
          columns={["Nombre de plantilla", "Canal", "Última edición", "Estado"]}
          rows={plantillas.map((p) => [
            p.nombre,
            p.canal === "correo" ? "Correo" : "Telegram",
            fechaCorta(p.actualizado_en),
            p.activa ? "Activa" : "Inactiva",
          ])}
        />
      )}

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} className="max-w-lg">
        <form onSubmit={crear} className="p-6 sm:p-8">
          <h3 className="font-display text-xl text-borgona">Nueva plantilla</h3>
          <label className="block mt-4">
            <span className="block text-sm text-carbon/75 mb-1.5">Nombre</span>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Canal</span>
            <select value={canal} onChange={(e) => setCanal(e.target.value as typeof canal)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none">
              <option value="correo">Correo</option>
              <option value="telegram">Telegram</option>
            </select>
          </label>
          {canal === "correo" && (
            <label className="block mt-3">
              <span className="block text-sm text-carbon/75 mb-1.5">Asunto</span>
              <input value={asunto} onChange={(e) => setAsunto(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
            </label>
          )}
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Cuerpo</span>
            <textarea rows={5} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none" />
          </label>
          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{guardando ? "Guardando…" : "Guardar plantilla"}</Button>
          </div>
        </form>
      </Modal>
    </RolePortalShell>
  );
}
