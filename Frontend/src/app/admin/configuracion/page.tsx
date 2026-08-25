"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ConfiguracionApi {
  nombre_empresa: string;
  correo_contacto: string;
  telefono_contacto: string;
  zona_horaria: string;
  moneda: string;
  idioma: string;
}

export default function ConfiguracionAdminPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [config, setConfig] = useState<ConfiguracionApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/settings`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar la configuración.");
        return r.json();
      })
      .then(setConfig)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  async function guardar() {
    if (!accessToken || !config) return;
    setGuardando(true);
    setGuardado(false);
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(config),
      });
      if (res.ok) setGuardado(true);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Configuración"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Configuración general</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra parámetros globales de la plataforma.</p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!config && !error && <p className="text-sm text-carbon/50">Cargando…</p>}

      {config && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <h2 className="text-xs uppercase tracking-wide text-carbon/50">Información de la empresa</h2>
              <label className="block">
                <span className="block text-xs text-carbon/50 mb-1.5">Nombre de la empresa</span>
                <input
                  className="input"
                  value={config.nombre_empresa}
                  onChange={(e) => setConfig({ ...config, nombre_empresa: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="block text-xs text-carbon/50 mb-1.5">Correo de contacto</span>
                <input
                  className="input"
                  value={config.correo_contacto}
                  onChange={(e) => setConfig({ ...config, correo_contacto: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="block text-xs text-carbon/50 mb-1.5">Teléfono</span>
                <input
                  className="input"
                  value={config.telefono_contacto}
                  onChange={(e) => setConfig({ ...config, telefono_contacto: e.target.value })}
                />
              </label>
            </Card>
            <Card className="space-y-4">
              <h2 className="text-xs uppercase tracking-wide text-carbon/50">Configuración regional</h2>
              <label className="block">
                <span className="block text-xs text-carbon/50 mb-1.5">Zona horaria</span>
                <input
                  className="input"
                  value={config.zona_horaria}
                  onChange={(e) => setConfig({ ...config, zona_horaria: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="block text-xs text-carbon/50 mb-1.5">Moneda</span>
                <input
                  className="input"
                  value={config.moneda}
                  onChange={(e) => setConfig({ ...config, moneda: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="block text-xs text-carbon/50 mb-1.5">Idioma</span>
                <input
                  className="input"
                  value={config.idioma}
                  onChange={(e) => setConfig({ ...config, idioma: e.target.value })}
                />
              </label>
            </Card>
          </div>
          <Button variant="primary" className="mt-6" onClick={guardar} disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </Button>
          {guardado && <span className="ml-3 text-sm text-emerald-700">Cambios guardados.</span>}
        </>
      )}
    </RolePortalShell>
  );
}
