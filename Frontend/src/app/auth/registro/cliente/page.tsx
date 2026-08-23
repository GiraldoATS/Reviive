"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { sugerirUsername } from "@/lib/auth";

const ICONS = "/images/auth/registro-cliente";

const beneficios = [
  { icono: "icon-shield-check.png", titulo: "Privacidad garantizada", texto: "Tus datos están protegidos con los más altos estándares de seguridad." },
  { icono: "icon-heart.png", titulo: "Cuidado y respeto", texto: "Tratamos tus recuerdos con el amor y la delicadeza que merecen." },
  { icono: "icon-hourglass.png", titulo: "Memorias para siempre", texto: "Creamos piezas artesanales que honran tu historia y trascienden el tiempo." },
];

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <span className="h-px w-16 bg-dorado-suave/50" />
      <span className="relative h-5 w-5 shrink-0">
        <Image src={`${ICONS}/icon-heart.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
      </span>
      <span className="h-px w-16 bg-dorado-suave/50" />
    </div>
  );
}

function CampoTexto({
  label,
  icono,
  ...props
}: { label: string; icono: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm text-carbon/80 mb-1.5">
        {label} <span className="text-borgona">*</span>
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4">
          <Image src={`${ICONS}/${icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
        </span>
        <input
          required
          {...props}
          className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 pl-10 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
        />
      </div>
    </label>
  );
}

function CampoPassword({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <label className="block">
      <span className="block text-sm text-carbon/80 mb-1.5">
        {label} <span className="text-borgona">*</span>
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4">
          <Image src={`${ICONS}/icon-lock.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
        </span>
        <input
          type={mostrar ? "text" : "password"}
          required
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 pl-10 pr-10 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
        />
        <button
          type="button"
          onClick={() => setMostrar((v) => !v)}
          aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
        >
          <Image src={`${ICONS}/icon-eye.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
        </button>
      </div>
    </label>
  );
}

export default function RegistroClientePage() {
  const router = useRouter();
  const { registrar } = useAuth();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError("Debes aceptar los Términos y la Política de Privacidad para continuar.");
      return;
    }
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
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
        ciudad: ciudad || undefined,
        telefono: telefono || undefined,
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
    <div className="min-h-screen bg-marfil flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-xl grid lg:grid-cols-2 bg-marfil">
        <div className="relative hidden lg:block overflow-hidden">
          <Image src={`${ICONS}/hero.png`} alt="" fill sizes="50vw" className="object-cover" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-t from-marfil/25 via-transparent to-marfil/10" />

          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 opacity-70">
            <Image src={`${ICONS}/rama.png`} alt="" fill sizes="64px" className="object-contain object-right" unoptimized />
          </div>

          <div className="relative flex flex-col h-full px-10 py-10">
            <div className="flex items-center gap-3">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS}/icon-hourglass.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl tracking-wide text-borgona-dark">REVIIVE</span>
                <span className="block text-[9px] tracking-[0.2em] text-dorado-suave">MEMORIAS QUE VIVEN PARA SIEMPRE</span>
              </span>
            </div>

            <div className="mt-10 max-w-xs">
              <h1 className="font-display text-4xl leading-tight text-borgona-dark">Tu historia merece ser recordada.</h1>
              <div className="flex items-center gap-3 my-5">
                <span className="h-px w-14 bg-dorado-suave/50" />
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={`${ICONS}/icon-heart.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <span className="h-px w-14 bg-dorado-suave/50" />
              </div>
              <p className="text-base text-carbon font-medium">
                En Reviive cuidamos cada detalle para transformar recuerdos en tesoros que trascienden generaciones.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-10 sm:px-12 sm:py-12">
          <p className="text-center text-xs font-medium tracking-[0.2em] text-borgona">REGISTRO DE CLIENTE</p>
          <Divider />
          <h2 className="text-center font-display text-3xl text-carbon">Bienvenido a Reviive</h2>
          <p className="mt-2 text-center text-sm text-carbon/70">
            Crea tu cuenta y comienza a preservar lo que más importa.
          </p>

          <form className="mt-7 space-y-4" onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <CampoTexto
                label="Nombres"
                icono="icon-persona.png"
                placeholder="Ingresa tus nombres"
                required
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
              />
              <CampoTexto
                label="Apellidos"
                icono="icon-persona.png"
                placeholder="Ingresa tus apellidos"
                required
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
            </div>

            <CampoTexto
              label="Correo electrónico"
              icono="icon-envelope.png"
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <CampoTexto
              label="Teléfono"
              icono="icon-telefono.png"
              type="tel"
              placeholder="+57 300 123 4567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <CampoTexto
              label="Ciudad"
              icono="icon-mappin.png"
              placeholder="Ingresa tu ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />

            <CampoPassword label="Contraseña" value={password} onChange={setPassword} placeholder="Crea tu contraseña" />
            <CampoPassword
              label="Confirmar contraseña"
              value={confirmarPassword}
              onChange={setConfirmarPassword}
              placeholder="Confirma tu contraseña"
            />

            <label className="flex items-start gap-2.5 text-sm text-carbon/70">
              <input
                type="checkbox"
                className="accent-borgona mt-0.5 shrink-0"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <span>
                Acepto los{" "}
                <Link href="/terminos" className="text-borgona underline">Términos y Condiciones</Link> y
                la{" "}
                <Link href="/politica-privacidad" className="text-borgona underline">Política de Privacidad</Link>.
              </span>
            </label>

            {error && <p className="text-sm text-borgona">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-full bg-borgona text-marfil px-6 py-3.5 text-sm inline-flex items-center justify-center gap-2.5 hover:bg-borgona-dark transition-colors disabled:opacity-60"
            >
              <span className="relative h-5 w-5 shrink-0">
                <Image src={`${ICONS}/icon-hourglass.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
              </span>
              {enviando ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>

          <Divider />

          <p className="text-center text-sm">
            <Link href="/auth/login" className="text-borgona hover:text-borgona-dark transition-colors">
              Ya tengo cuenta →
            </Link>
          </p>

          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-5 grid sm:grid-cols-3 gap-5 text-center">
            {beneficios.map((b) => (
              <div key={b.titulo}>
                <span className="relative h-8 w-8 mx-auto block">
                  <Image src={`${ICONS}/${b.icono}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                </span>
                <h3 className="mt-2 font-display text-sm text-borgona">{b.titulo}</h3>
                <p className="mt-1 text-xs text-carbon/60">{b.texto}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-carbon/40">
            © 2026 Reviive. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
