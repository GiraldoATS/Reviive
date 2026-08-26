"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface UsuarioApi {
  id: number;
  email: string;
  rol: string;
  estado: "activo" | "inactivo" | "suspendido";
  perfil: { nombre: string } | null;
}

const ROLES = [
  "visitante",
  "cliente",
  "proveedor",
  "curador",
  "operador_logistico",
  "administrador",
  "supervisor_ia",
  "superadministrador",
] as const;

const LABEL_ROL: Record<string, string> = {
  visitante: "Visitante",
  cliente: "Cliente",
  proveedor: "Proveedor",
  curador: "Curador",
  operador_logistico: "Operador logístico",
  administrador: "Administrador",
  supervisor_ia: "Supervisor de IA",
  superadministrador: "Superadministrador",
};

const ESTADOS = ["activo", "inactivo", "suspendido"] as const;

export default function UsuariosAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/users/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar la lista de usuarios.");
        return r.json();
      })
      .then((data) => setUsuarios(data.results ?? data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }

  useEffect(() => {
    if (cargandoSesion) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  async function actualizar(id: number, campo: "rol" | "estado", valor: string) {
    if (!accessToken) return;
    setGuardandoId(id);
    try {
      await fetch(`${API_URL}/users/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ [campo]: valor }),
      });
      cargar();
    } finally {
      setGuardandoId(null);
    }
  }

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Usuarios y roles"]}>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-carbon">Gestión de usuarios y roles</h1>
        <p className="text-sm text-carbon/55">Controla roles y estado de cada cuenta de la plataforma.</p>
      </div>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!usuarios && !error && <p className="text-sm text-carbon/50">Cargando usuarios…</p>}

      {usuarios && (
        <SimpleTable
          columns={["Nombre", "Correo electrónico", "Rol", "Estado"]}
          rows={usuarios.map((u) => [
            u.perfil?.nombre || "—",
            u.email,
            <select
              key={`${u.id}-rol`}
              value={u.rol}
              disabled={guardandoId === u.id}
              onChange={(e) => actualizar(u.id, "rol", e.target.value)}
              className="rounded-lg border border-greige/60 bg-white px-2 py-1 text-xs outline-none focus:border-borgona/50"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{LABEL_ROL[r]}</option>
              ))}
            </select>,
            <div key={`${u.id}-estado`} className="flex items-center gap-2">
              <Badge tone={u.estado === "activo" ? "success" : "pending"}>{u.estado}</Badge>
              <select
                value={u.estado}
                disabled={guardandoId === u.id}
                onChange={(e) => actualizar(u.id, "estado", e.target.value)}
                className="rounded-lg border border-greige/60 bg-white px-2 py-1 text-xs outline-none focus:border-borgona/50"
              >
                {ESTADOS.map((es) => (
                  <option key={es} value={es}>{es}</option>
                ))}
              </select>
            </div>,
          ])}
        />
      )}
    </RolePortalShell>
  );
}
