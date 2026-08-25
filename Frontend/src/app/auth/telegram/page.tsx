"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface CodigoApi {
  codigo: string;
  expira_en: string;
  bot_username: string;
}

function segundosRestantes(expiraIso: string): number {
  return Math.max(0, Math.round((new Date(expiraIso).getTime() - Date.now()) / 1000));
}

export default function VinculacionTelegramPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [datos, setDatos] = useState<CodigoApi | null>(null);
  const [restantes, setRestantes] = useState(0);
  const [vinculado, setVinculado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generarCodigo() {
    if (!accessToken) return;
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/telegram/link/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("No se pudo generar el código.");
      const data: CodigoApi = await res.json();
      setDatos(data);
      setRestantes(segundosRestantes(data.expira_en));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- genera el codigo real una sola vez al cargar, con sesion ya lista
    generarCodigo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion]);

  // Cuenta regresiva real del código.
  useEffect(() => {
    if (!datos) return;
    const intervalo = setInterval(() => setRestantes(segundosRestantes(datos.expira_en)), 1000);
    return () => clearInterval(intervalo);
  }, [datos]);

  // Poll real: detecta cuándo el usuario ya envió el código al bot.
  useEffect(() => {
    if (!accessToken || vinculado) return;
    const intervalo = setInterval(() => {
      fetch(`${API_URL}/auth/telegram/link/status`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.vinculado) setVinculado(true);
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(intervalo);
  }, [accessToken, vinculado]);

  if (!cargandoSesion && !accessToken) {
    return (
      <SiteShell hideFloatingAlma>
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="text-carbon/70 mb-4">Inicia sesión para vincular tu cuenta con Telegram.</p>
          <Link href="/auth/login" className="text-borgona underline text-sm">Iniciar sesión →</Link>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell hideFloatingAlma>
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <Card>
          <div className="h-14 w-14 rounded-full bg-[#e8f4fb] flex items-center justify-center mx-auto text-2xl">
            ✈️
          </div>

          {vinculado ? (
            <>
              <h1 className="mt-5 font-display text-2xl text-carbon">¡Cuenta vinculada!</h1>
              <p className="mt-2 text-sm text-carbon/60">
                Ya puedes hablar con Alma desde Telegram y desde la web con la misma cuenta.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 font-display text-2xl text-carbon">Vincula tu cuenta con Telegram</h1>
              <p className="mt-2 text-sm text-carbon/60">
                Envía el siguiente código al bot de Reviive en Telegram para continuar tu conversación desde ahí,
                con la misma cuenta.
              </p>

              {error && <p className="mt-4 text-sm text-borgona">{error}</p>}

              {datos && (
                <>
                  <p className="mt-5 font-display text-3xl tracking-widest text-borgona">{datos.codigo}</p>
                  <p className="mt-1 text-xs text-carbon/45">
                    {restantes > 0 ? `Expira en ${Math.floor(restantes / 60)}:${String(restantes % 60).padStart(2, "0")}` : "Este código expiró."}
                  </p>
                  {restantes > 0 ? (
                    <Button href={`https://t.me/${datos.bot_username}`} variant="primary" className="w-full justify-center mt-6">
                      Abrir bot de Telegram
                    </Button>
                  ) : (
                    <Button variant="primary" className="w-full justify-center mt-6" onClick={generarCodigo}>
                      Generar un nuevo código
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </Card>
      </div>
    </SiteShell>
  );
}
