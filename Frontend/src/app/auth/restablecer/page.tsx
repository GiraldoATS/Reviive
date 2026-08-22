"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconCheck } from "@/components/icons";

const ICONS = "/images/auth";

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <span className="h-px w-16 bg-dorado-suave/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-dorado-suave" />
      <span className="h-px w-16 bg-dorado-suave/50" />
    </div>
  );
}

function Requisito({ cumplido, texto }: { cumplido: boolean; texto: string }) {
  return (
    <p className={`flex items-center gap-2 text-xs transition-colors ${cumplido ? "text-green-700" : "text-carbon/45"}`}>
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          cumplido ? "bg-green-600 border-green-600 text-white" : "border-carbon/25 text-transparent"
        }`}
      >
        <IconCheck className="h-2.5 w-2.5" />
      </span>
      {texto}
    </p>
  );
}

function CampoPassword({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <label className="block">
      <span className="block text-sm text-carbon/80 mb-1.5">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4">
          <Image src={`${ICONS}/icon-lock-v2.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
        </span>
        <input
          type={mostrar ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••••"
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

export default function RestablecerContrasenaPage() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [actualizada, setActualizada] = useState(false);

  const tieneOchoCaracteres = password.length >= 8;
  const tieneMayusYMinus = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const tieneNumeroOSimbolo = /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password);
  const requisitosOk = tieneOchoCaracteres && tieneMayusYMinus && tieneNumeroOSimbolo;
  const coinciden = confirmar.length > 0 && password === confirmar;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!requisitosOk || !coinciden || enviando) return;
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setActualizada(true);
    }, 700);
  }

  if (actualizada) {
    return (
      <div className="min-h-screen bg-marfil flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-[2rem] bg-white shadow-xl border border-greige/40 p-10 text-center">
          <span className="relative h-10 w-12 shrink-0 block mx-auto">
            <Image src={`${ICONS}/hourglass-icon.png`} alt="" fill sizes="48px" className="object-contain" unoptimized />
          </span>

          <span className="relative h-28 w-28 shrink-0 block mx-auto mt-5 rounded-full bg-green-50">
            <Image src={`${ICONS}/icon-shield-check.png`} alt="" fill sizes="112px" className="object-contain p-5" unoptimized />
          </span>

          <h2 className="mt-5 font-display text-3xl text-borgona">¡Contraseña actualizada!</h2>
          <p className="mt-3 text-sm text-carbon/70">
            Tu contraseña se ha cambiado correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </p>

          <Link
            href="/auth/login"
            className="mt-6 w-full rounded-full bg-borgona text-marfil px-6 py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-borgona-dark transition-colors"
          >
            Iniciar sesión →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-marfil flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-[2rem] bg-white shadow-xl border border-greige/40 p-10">
        <span className="relative h-10 w-12 shrink-0 block mx-auto">
          <Image src={`${ICONS}/hourglass-icon.png`} alt="" fill sizes="48px" className="object-contain" unoptimized />
        </span>

        <h2 className="mt-4 text-center font-display text-3xl text-borgona">Crear nueva contraseña</h2>
        <Divider />
        <p className="text-center text-sm text-carbon/70">
          Ingresa y confirma tu nueva contraseña para continuar.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <CampoPassword label="Nueva contraseña" value={password} onChange={setPassword} />
            <div className="mt-2 space-y-1 pl-1">
              <Requisito cumplido={tieneOchoCaracteres} texto="Mínimo 8 caracteres" />
              <Requisito cumplido={tieneMayusYMinus} texto="Incluye mayúscula y minúscula" />
              <Requisito cumplido={tieneNumeroOSimbolo} texto="Incluye número o símbolo" />
            </div>
          </div>

          <div>
            <CampoPassword label="Confirmar nueva contraseña" value={confirmar} onChange={setConfirmar} />
            {confirmar.length > 0 && !coinciden && (
              <p className="mt-1.5 text-xs text-borgona">Las contraseñas no coinciden.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!requisitosOk || !coinciden || enviando}
            className="w-full rounded-full bg-borgona text-marfil px-6 py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-borgona-dark transition-colors disabled:opacity-50"
          >
            {enviando ? "Guardando…" : "Guardar nueva contraseña"}
            {!enviando && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          <Link href="/auth/login" className="text-borgona hover:text-borgona-dark transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
