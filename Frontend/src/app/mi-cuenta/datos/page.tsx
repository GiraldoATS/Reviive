"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import CuentaSidebar from "@/components/CuentaSidebar";
import { useAuth } from "@/lib/AuthContext";
import { IconInfo, IconLock } from "@/components/icons";

function ContenidoDatos() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState(() => usuario?.perfil?.nombre ?? "");
  const [telefono, setTelefono] = useState(() => usuario?.perfil?.telefono ?? "");
  const [ciudad, setCiudad] = useState(() => usuario?.perfil?.ciudad ?? "");
  const [mensaje, setMensaje] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Todavía no existe un endpoint para que el cliente actualice su propio
    // perfil (nombre/teléfono/ciudad) desde la cuenta; por ahora dirigimos
    // el cambio a soporte en vez de simular un guardado que no ocurre.
    setMensaje("Por ahora no podemos guardar cambios automáticamente. Escríbenos a hola@reviive.com y con gusto actualizamos tus datos.");
  }

  function cancelar() {
    setNombre(usuario?.perfil?.nombre ?? "");
    setTelefono(usuario?.perfil?.telefono ?? "");
    setCiudad(usuario?.perfil?.ciudad ?? "");
    setMensaje(null);
    router.push("/mi-cuenta/perfil");
  }

  return (
    <section className="mx-auto max-w-6xl w-full px-6 py-10 grid lg:grid-cols-[240px_1fr] gap-6 items-start">
      <CuentaSidebar activo="/mi-cuenta/datos" />

      <div>
        <h1 className="font-display text-3xl text-carbon">Mis datos</h1>
        <p className="mt-1 text-sm text-carbon/60 max-w-lg">
          Mantén actualizada tu información personal para que podamos acompañarte durante tus procesos y entregas.
        </p>

        <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <h2 className="font-display text-lg text-carbon">Información personal</h2>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="block text-sm text-carbon/75 mb-1.5">Nombre completo</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="block text-sm text-carbon/75 mb-1.5">Correo electrónico</span>
              <div className="relative">
                <input
                  value={usuario?.email ?? ""}
                  disabled
                  className="w-full rounded-xl border border-greige/70 bg-greige/30 px-3.5 py-2.5 pr-10 text-sm text-carbon/60 outline-none cursor-not-allowed"
                />
                <IconLock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40" />
              </div>
              <p className="mt-1 text-xs text-carbon/50">Este correo corresponde a tu usuario de acceso y no puede modificarse desde tu cuenta.</p>
            </label>

            <label className="block">
              <span className="block text-sm text-carbon/75 mb-1.5">Teléfono</span>
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Sin registrar"
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50"
              />
            </label>

            <label className="block">
              <span className="block text-sm text-carbon/75 mb-1.5">Ciudad</span>
              <input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Sin registrar"
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm text-carbon/80 outline-none focus:border-borgona/50"
              />
            </label>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-rosa/20 border border-rosa/40 p-4">
            <IconInfo className="h-5 w-5 shrink-0 text-borgona mt-0.5" />
            <p className="text-sm text-carbon/70">
              <span className="font-medium text-borgona">Importante:</span> si necesitas actualizar tu correo
              electrónico, comunícate con nuestro equipo de atención a través de{" "}
              <Link href="/ayuda" className="text-borgona underline">Ayuda → Contactar con Reviive</Link>.
            </p>
          </div>

          {mensaje && (
            <div className="mt-4 rounded-xl bg-dorado-suave/15 border border-dorado-suave/40 p-4 text-sm text-borgona-dark">
              {mensaje}
            </div>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" onClick={cancelar} variant="secondary">Cancelar</Button>
            <Button type="submit" variant="primary">Guardar cambios</Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function MisDatosPage() {
  return (
    <ClienteShell activeHref="/mi-cuenta/datos">
      <ContenidoDatos />
    </ClienteShell>
  );
}
