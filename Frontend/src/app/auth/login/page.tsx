"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await login(email, password);
      router.push(searchParams.get("next") || "/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Bienvenida de vuelta"
      title="Iniciar sesión"
      footer={
        <p className="text-carbon/60">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/seleccionar-rol" className="text-borgona underline">
            Crear cuenta
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
          <input
            type="email"
            required
            className="input"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Contraseña</span>
          <input
            type="password"
            required
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-borgona">{error}</p>}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-carbon/60">
            <input type="checkbox" className="accent-borgona" /> Recordarme
          </label>
          <Link href="/auth/recuperar" className="text-borgona">¿Olvidaste tu contraseña?</Link>
        </div>
        <Button type="submit" variant="primary" className="w-full justify-center">
          {enviando ? "Entrando…" : "Iniciar sesión →"}
        </Button>
        <div className="flex items-center gap-3 text-xs text-carbon/40">
          <span className="flex-1 h-px bg-greige/70" /> o continuar con <span className="flex-1 h-px bg-greige/70" />
        </div>
        <Button href="/auth/telegram" variant="secondary" className="w-full justify-center">
          Continuar con Telegram
        </Button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
