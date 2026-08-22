"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconInfo, IconClockAlert, IconRefresh } from "@/components/icons";

const ICONS = "/images/auth";
const ESPERA_REENVIO = 60;

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <span className="h-px w-16 bg-dorado-suave/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-dorado-suave" />
      <span className="h-px w-16 bg-dorado-suave/50" />
    </div>
  );
}

function enmascararCorreo(correo: string) {
  const [local, dominio] = correo.split("@");
  if (!dominio) return correo;
  const visible = local.slice(0, 3);
  return `${visible}***@${dominio}`;
}

function Logo() {
  return (
    <>
      <span className="relative h-20 w-24 shrink-0 block mx-auto">
        <Image src={`${ICONS}/icon-hourglass-wreath.png`} alt="" fill sizes="96px" className="object-contain" unoptimized />
      </span>
      <h1 className="mt-2 text-center font-display text-3xl tracking-wide text-borgona-dark">REVIIVE</h1>
      <p className="mt-1 text-center text-xs tracking-[0.25em] text-dorado-suave font-medium">
        RECUERDA. RENACE. REVIIVE.
      </p>
    </>
  );
}

function RamaEsquina({ src, className, opacity = 60 }: { src: string; className: string; opacity?: number }) {
  return (
    <div className={`pointer-events-none absolute h-56 w-56 ${className}`} style={{ opacity: opacity / 100 }}>
      <Image src={src} alt="" fill sizes="224px" className="object-contain" unoptimized />
    </div>
  );
}

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado">("idle");
  const [segundos, setSegundos] = useState(ESPERA_REENVIO);

  useEffect(() => {
    if (estado !== "enviado" || segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [estado, segundos]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || estado === "enviando") return;
    setEstado("enviando");
    setTimeout(() => {
      setEstado("enviado");
      setSegundos(ESPERA_REENVIO);
    }, 700);
  }

  function reenviar() {
    if (segundos > 0) return;
    setSegundos(ESPERA_REENVIO);
  }

  if (estado === "enviado") {
    return (
      <div className="relative min-h-screen bg-rosa/15 flex items-center justify-center p-6 overflow-hidden">
        <RamaEsquina src={`${ICONS}/rama-rosa-grande.png`} className="-left-10 -top-10 -scale-x-100" opacity={70} />
        <RamaEsquina src={`${ICONS}/rama-rosa-chica.png`} className="-right-6 -top-6" opacity={70} />
        <RamaEsquina src={`${ICONS}/rama-rosa-chica.png`} className="-left-6 -bottom-6 -scale-x-100 -scale-y-100" opacity={70} />
        <RamaEsquina src={`${ICONS}/rama-rosa-grande.png`} className="-right-10 -bottom-10 -scale-y-100" opacity={70} />

        <div className="relative w-full max-w-md rounded-[2.5rem] bg-marfil shadow-xl p-10 text-center">
          <Logo />

          <span className="relative h-32 w-32 shrink-0 block mx-auto mt-6">
            <Image src={`${ICONS}/icon-envelope-check.png`} alt="" fill sizes="128px" className="object-contain" unoptimized />
          </span>

          <h2 className="mt-4 font-display text-3xl text-borgona">Revisa tu correo</h2>
          <Divider />

          <p className="text-sm text-carbon/70">
            Si encontramos una cuenta asociada a{" "}
            <span className="font-medium text-carbon">{enmascararCorreo(email || "tu***@correo.com")}</span>,
            recibirás un enlace para restablecer tu contraseña.
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-greige/20 border border-greige/50 p-4 text-left">
            <IconInfo className="h-5 w-5 shrink-0 text-dorado-suave mt-0.5" />
            <p className="text-sm text-carbon/70">Hemos enviado las instrucciones de recuperación a tu correo.</p>
          </div>

          <hr className="my-6 border-greige/50" />

          <div className="text-left">
            <p className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-4 w-4 shrink-0">
                <Image src={`${ICONS}/icon-envelope-v2.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
              </span>
              ¿No recibiste el correo?
            </p>
            <p className="mt-1 text-sm text-carbon/60">Revisa tu carpeta de spam o correo no deseado.</p>

            <p className="mt-4 inline-flex items-center gap-2 text-sm text-carbon/60">
              <IconClockAlert className="h-4 w-4 text-dorado-suave" />
              {segundos > 0 ? (
                <>Puedes reenviar el enlace en <span className="font-medium text-carbon">{segundos}</span> segundos.</>
              ) : (
                "Ya puedes reenviar el enlace."
              )}
            </p>
          </div>

          <Link
            href="/auth/login"
            className="mt-6 w-full rounded-full bg-borgona text-marfil px-6 py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-borgona-dark transition-colors"
          >
            ← Volver a iniciar sesión
          </Link>

          <button
            type="button"
            onClick={reenviar}
            disabled={segundos > 0}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-borgona underline underline-offset-2 disabled:text-carbon/35 disabled:no-underline disabled:cursor-not-allowed"
          >
            <IconRefresh className="h-3.5 w-3.5" />
            Reenviar enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-marfil flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-xl grid lg:grid-cols-2 bg-marfil">
        <div className="relative hidden lg:block overflow-hidden">
          <Image src={`${ICONS}/recuperar-hero.png`} alt="" fill sizes="50vw" className="object-cover" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-10">
            <Logo />
            <Divider />
            <h2 className="text-center font-display text-3xl text-borgona-dark leading-tight">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-center text-sm text-carbon/70 max-w-xs mx-auto">
              Estamos aquí para ayudarte a volver a tu cuenta de forma segura.
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center px-6 py-14 sm:px-12 overflow-hidden">
          <div className="pointer-events-none absolute -top-6 -right-6 h-56 w-56 opacity-70">
            <Image src={`${ICONS}/rama-rosa-chica.png`} alt="" fill sizes="224px" className="object-contain object-right-top" unoptimized />
          </div>
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-64 w-64 opacity-60">
            <Image src={`${ICONS}/rama-rosa-grande.png`} alt="" fill sizes="256px" className="object-contain object-right-bottom" unoptimized />
          </div>

          <div className="relative w-full max-w-sm">
            <span className="relative h-8 w-9 shrink-0 block">
              <Image src={`${ICONS}/icon-leaf-sprig-recuperar.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
            </span>

            <h2 className="mt-3 font-display text-3xl text-borgona">Ingresa tu correo electrónico</h2>
            <p className="mt-3 text-sm text-carbon/70">
              Te enviaremos un enlace para que puedas crear una nueva contraseña y volver a acceder.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="block text-sm text-carbon/80 mb-1.5">Correo electrónico</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4">
                    <Image src={`${ICONS}/icon-envelope-v2.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 pl-10 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={estado === "enviando"}
                className="w-full rounded-full bg-borgona text-marfil px-6 py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-borgona-dark transition-colors disabled:opacity-60"
              >
                {estado === "enviando" ? "Enviando…" : "Enviar enlace de recuperación"}
                {estado !== "enviando" && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <Divider />

            <p className="text-center text-sm">
              <Link href="/auth/login" className="text-borgona hover:text-borgona-dark transition-colors">
                ← Volver a iniciar sesión
              </Link>
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-greige/20 border border-greige/50 p-4">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70">
                <Image src={`${ICONS}/icon-lock-v2.png`} alt="" fill sizes="40px" className="object-contain p-2" unoptimized />
              </span>
              <p className="text-sm text-carbon/70">
                <span className="block text-carbon">Tu información está protegida.</span>
                Usamos canales seguros para cuidar tus datos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
