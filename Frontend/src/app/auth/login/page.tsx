"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { IconHeart } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <span className="h-px w-16 bg-dorado-suave/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-dorado-suave" />
      <span className="h-px w-16 bg-dorado-suave/50" />
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(true);
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
    <div className="min-h-screen bg-marfil flex flex-col">
      <header className="border-b border-greige/60 px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/">
          <Logo tagline="Recuerdos que perduran" />
        </Link>
        <div className="flex items-center gap-5 text-sm text-carbon/70">
          <Link href="/" className="hover:text-borgona transition-colors">Volver al inicio</Link>
          <Link href="/preguntas-frecuentes" className="hover:text-borgona transition-colors">¿Necesitas ayuda?</Link>
          <span className="h-5 w-px bg-greige/60" />
          <span className="relative h-6 w-6 shrink-0">
            <Image src="/images/auth/hourglass-icon.png" alt="" fill sizes="24px" className="object-contain" unoptimized />
          </span>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-2">
        <div className="relative hidden lg:block overflow-hidden">
          <Image src="/images/auth/hero.png" alt="" fill sizes="50vw" className="object-cover" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10" />
          <div className="absolute inset-x-0 top-20 flex flex-col items-center text-center px-12">
            <div className="rounded-[2rem] bg-marfil/75 backdrop-blur-md px-10 py-8 shadow-sm">
              <span className="relative h-16 w-16 shrink-0 mx-auto block">
                <Image src="/images/auth/hourglass-icon.png" alt="" fill sizes="64px" className="object-contain" unoptimized />
              </span>
              <Divider />
              <h1 className="font-display text-4xl text-borgona-dark leading-tight">Bienvenida a Reviive</h1>
              <p className="mt-2 font-display text-lg text-[#8a6432] font-medium">
                Donde tus recuerdos encuentran un lugar para perdurar.
              </p>
              <Divider />
              <p className="mt-1 text-sm text-carbon/80 max-w-xs mx-auto">
                Conserva, honra y comparte las historias que dan sentido a tu vida.
                <br />
                Porque lo que recordamos, nos transforma.
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-72 w-56 opacity-90">
            <Image src="/images/auth/rama-esquina.png" alt="" fill sizes="224px" className="object-contain object-left-bottom" unoptimized />
          </div>
        </div>

        <div className="relative flex items-center justify-center px-6 py-16 overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -right-8 h-64 w-56 opacity-60">
            <Image src="/images/auth/rama-superior.png" alt="" fill sizes="224px" className="object-contain object-right-top" unoptimized />
          </div>
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-80 opacity-50">
            <Image src="/images/auth/hourglass-silueta.png" alt="" fill sizes="320px" className="object-contain object-right-bottom" unoptimized />
          </div>

          <div className="relative w-full max-w-sm rounded-3xl bg-marfil shadow-xl border border-greige/40 p-8 sm:p-10">
            <div className="flex justify-center">
              <span className="relative h-8 w-10 shrink-0">
                <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="40px" className="object-contain" />
              </span>
            </div>
            <h2 className="mt-2 text-center font-display text-3xl text-borgona">Iniciar sesión</h2>
            <Divider />

            <form className="mt-2 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="block text-sm text-carbon/70 mb-1.5">Correo electrónico</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                    <Image src="/images/auth/icon-envelope.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm text-carbon/70 mb-1.5">Contraseña</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                    <Image src="/images/auth/icon-lock.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </span>
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    required
                    className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 pr-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword((v) => !v)}
                    aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  >
                    <Image src="/images/auth/icon-eye.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </button>
                </div>
              </label>

              {error && <p className="text-sm text-borgona">{error}</p>}

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setRecordarme((v) => !v)}
                  className="flex items-center gap-2 text-carbon/70"
                >
                  {recordarme ? (
                    <span className="relative h-4 w-4 shrink-0">
                      <Image src="/images/auth/icon-check.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                    </span>
                  ) : (
                    <span className="h-4 w-4 shrink-0 rounded border border-greige/70" />
                  )}
                  Recordarme
                </button>
                <Link href="/auth/recuperar" className="text-borgona hover:text-borgona-dark transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" variant="primary" className="w-full justify-center inline-flex items-center gap-2">
                {enviando ? "Entrando…" : "Iniciar sesión"}
                {!enviando && <span aria-hidden="true">→</span>}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-carbon/70">
              ¿No tienes una cuenta?{" "}
              <Link href="/auth/seleccionar-rol" className="text-borgona hover:text-borgona-dark underline">
                Crear cuenta
              </Link>
            </p>
            <p className="mt-4 text-center text-xs text-carbon/45">
              Al continuar, aceptas nuestros{" "}
              <Link href="/terminos" className="text-borgona underline">Términos y condiciones</Link>
              {" "}y{" "}
              <Link href="/politica-privacidad" className="text-borgona underline">Política de privacidad.</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-greige/50 py-6 text-center">
        <span className="relative mx-auto mb-3 h-4 w-8 block">
          <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
        </span>
        <p className="inline-flex items-center gap-1.5 text-sm text-carbon/60">
          En Reviive, cada recuerdo cuenta. Gracias por confiar en nosotros para preservarlos.
          <IconHeart className="h-3.5 w-3.5 text-dorado-suave" />
        </p>
        <p className="mt-1 text-xs text-carbon/40">© 2026 Reviive. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
