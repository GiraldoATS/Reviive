"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClienteShell from "@/components/ClienteShell";
import CuentaSidebar from "@/components/CuentaSidebar";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconLock, IconBell, IconAlertTriangle, IconSeguro, IconGlobe, IconCorreo } from "@/components/icons";

function enmascarar(correo: string) {
  const [local, dominio] = correo.split("@");
  if (!dominio) return correo;
  return `${local.slice(0, 3)}${"•".repeat(Math.max(local.length - 3, 3))}@${dominio}`;
}

function ContenidoSeguridad() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  async function cambiarContrasena() {
    if (!usuario?.email || enviando) return;
    setEnviando(true);
    setResultado(null);
    try {
      const res = await fetch(`${API_URL}/auth/password-reset/solicitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: usuario.email }),
      });
      if (res.ok) {
        setResultado(`Te enviamos un enlace para cambiar tu contraseña a ${enmascarar(usuario.email)}.`);
      } else {
        setResultado("No pudimos enviar el enlace en este momento. Intenta de nuevo en unos minutos.");
      }
    } catch {
      setResultado("No pudimos conectarnos. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  function cerrarSesion() {
    logout();
    router.push("/");
  }

  return (
    <section className="mx-auto max-w-6xl w-full px-6 py-10 grid lg:grid-cols-[240px_1fr] gap-6 items-start">
      <CuentaSidebar activo="/mi-cuenta/seguridad" />

      <div>
        <h1 className="font-display text-3xl text-carbon">Seguridad de tu cuenta</h1>
        <p className="mt-1 text-sm text-carbon/60">Protege tu cuenta y controla cómo accedes a Reviive.</p>

        <div className="mt-6 grid lg:grid-cols-2 gap-5 items-start">
          <div className="space-y-5">
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
                <IconCorreo className="h-4 w-4 text-borgona" />
                Correo de acceso
                <IconLock className="h-3.5 w-3.5 text-carbon/40" />
              </h3>
              <p className="mt-1 text-sm text-carbon/80">{usuario?.email}</p>
              <p className="mt-1 text-xs text-carbon/50">Este correo identifica tu cuenta y no puede modificarse desde Reviive.</p>
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-base text-carbon">Cambiar contraseña</h3>
              <p className="mt-1 text-sm text-carbon/60">
                Te enviaremos un enlace seguro a tu correo para crear una nueva contraseña.
              </p>
              <Button type="button" onClick={cambiarContrasena} variant="secondary" className="mt-3">
                {enviando ? "Enviando..." : "Cambiar contraseña →"}
              </Button>
              {resultado && <p className="mt-2 text-xs text-carbon/60">{resultado}</p>}
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-base text-carbon">Sesión activa</h3>
              <p className="mt-1 text-sm text-carbon/60">
                Por ahora solo podemos mostrarte la sesión de este dispositivo.
              </p>
              <div className="mt-3 rounded-xl bg-white/60 p-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm text-carbon/75">
                  <IconGlobe className="h-4 w-4 text-borgona" />
                  Este dispositivo
                </span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1">Sesión actual</span>
              </div>
              <Button type="button" onClick={cerrarSesion} variant="secondary" className="mt-3">
                Cerrar sesión en este dispositivo
              </Button>
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5 opacity-60">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-carbon">Actividad reciente</h3>
                <span className="text-xs rounded-full bg-greige/50 px-2.5 py-1 text-carbon/60">Próximamente</span>
              </div>
              <p className="mt-1 text-sm text-carbon/60">
                Aún no registramos un historial de eventos de seguridad de tu cuenta.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5 opacity-60">
              <div className="flex items-start justify-between gap-3">
                <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
                  <IconBell className="h-4 w-4 text-borgona" />
                  Alertas de seguridad
                </h3>
                <span className="text-xs rounded-full bg-greige/50 px-2.5 py-1 text-carbon/60 shrink-0">Próximamente</span>
              </div>
              <p className="mt-1 text-sm text-carbon/60">
                Recibir notificaciones por correo cuando detectemos un nuevo inicio de sesión.
              </p>
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
                <IconCorreo className="h-4 w-4 text-borgona" />
                Recuperación de cuenta
              </h3>
              <p className="mt-1 text-sm text-carbon/60">Si olvidas tu contraseña, te enviaremos un enlace seguro a tu correo de acceso.</p>
              <p className="mt-2 text-sm text-carbon/80">{usuario?.email ? enmascarar(usuario.email) : ""}</p>
              <Button href="/auth/recuperar" variant="secondary" className="mt-3">
                ¿Cómo funciona la recuperación? →
              </Button>
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5 opacity-60">
              <div className="flex items-start justify-between gap-3">
                <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
                  <IconSeguro className="h-4 w-4 text-borgona" />
                  Verificación en dos pasos
                </h3>
                <span className="text-xs rounded-full bg-greige/50 px-2.5 py-1 text-carbon/60 shrink-0">Próximamente</span>
              </div>
              <p className="mt-1 text-sm text-carbon/60">Añade una capa adicional de protección a tu cuenta.</p>
              <p className="mt-2 text-xs text-carbon/45">No configurada</p>
            </div>

            <div className="rounded-2xl border border-rosa/40 bg-rosa/10 p-5">
              <h3 className="inline-flex items-center gap-2 font-display text-base text-borgona">
                <IconAlertTriangle className="h-4 w-4" />
                Administración de la cuenta
              </h3>
              <div className="mt-3 space-y-3">
                <button type="button" onClick={cerrarSesion} className="flex w-full items-center justify-between text-left text-sm text-carbon/75 hover:text-borgona transition-colors">
                  <span>
                    <span className="block font-medium text-borgona">Cerrar todas las sesiones</span>
                    Finaliza el acceso en otros dispositivos.
                  </span>
                  <span>→</span>
                </button>
                <a href="mailto:reviivemed@gmail.com?subject=Eliminar%20mi%20cuenta" className="flex w-full items-center justify-between text-left text-sm text-carbon/75 hover:text-borgona transition-colors">
                  <span>
                    <span className="block font-medium text-borgona">Eliminar mi cuenta</span>
                    Escríbenos y con gusto gestionamos tu solicitud.
                  </span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SeguridadPage() {
  return (
    <ClienteShell activeHref="/mi-cuenta/seguridad">
      <ContenidoSeguridad />
    </ClienteShell>
  );
}
