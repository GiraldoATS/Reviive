"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { sugerirUsername } from "@/lib/auth";

export default function RegistroClientePage() {
  const router = useRouter();
  const { registrar } = useAuth();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
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
        nombre: `${nombres} ${apellidos}`.trim(),
        consentimiento_datos: aceptaTerminos,
        rol: "cliente",
      });
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Registro de cliente"
      title="Bienvenido a Reviive"
      subtitle="Crea tu cuenta y comienza a preservar lo que más importa."
      footer={
        <p className="text-carbon/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-borgona underline">Inicia sesión</Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Nombres</span>
            <input
              className="input"
              placeholder="Ingresa tus nombres"
              required
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Apellidos</span>
            <input
              className="input"
              placeholder="Ingresa tus apellidos"
              required
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </label>
        </div>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
          <input
            type="email"
            required
            className="input"
            placeholder="ejemplo@correo.com"
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
          {enviando ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>
    </AuthShell>
  );
}
