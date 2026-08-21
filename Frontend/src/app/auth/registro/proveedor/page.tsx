"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { sugerirUsername } from "@/lib/auth";

export default function RegistroProveedorPage() {
  const router = useRouter();
  const { registrar } = useAuth();
  const [nombreTaller, setNombreTaller] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError("Debes aceptar los Términos y la Política de Privacidad para continuar.");
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      await registrar({
        username: sugerirUsername(email),
        email,
        password,
        nombre: nombreTaller,
        ciudad,
        consentimiento_datos: aceptaTerminos,
        rol: "proveedor",
        nombre_taller: nombreTaller,
      });
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Registro de proveedor"
      title="Únete como taller o artesano"
      subtitle="Postúlate para ofrecer tus servicios de restauración en Reviive."
      footer={
        <p className="text-carbon/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-borgona underline">Inicia sesión</Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Nombre del taller</span>
          <input
            className="input"
            placeholder="Artesanía El Recuerdo"
            required
            value={nombreTaller}
            onChange={(e) => setNombreTaller(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Ciudad</span>
          <input
            className="input"
            placeholder="Oaxaca, Oaxaca"
            required
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
          <input
            type="email"
            required
            className="input"
            placeholder="taller@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Contraseña</span>
          <input
            type="password"
            required
            minLength={8}
            className="input"
            placeholder="Crea tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="flex items-start gap-2 text-xs text-carbon/60">
          <input
            type="checkbox"
            className="accent-borgona mt-0.5"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
          />
          Acepto los Términos y Condiciones y la Política de Privacidad.
        </label>
        {error && <p className="text-sm text-borgona">{error}</p>}
        <Button type="submit" variant="primary" className="w-full justify-center">
          {enviando ? "Enviando…" : "Enviar solicitud de registro"}
        </Button>
        <p className="text-xs text-carbon/50 text-center">
          Tu solicitud quedará en revisión y no recibirás pedidos automáticamente.
        </p>
      </form>
    </AuthShell>
  );
}
