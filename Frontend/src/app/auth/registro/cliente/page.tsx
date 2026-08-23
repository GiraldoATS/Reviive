"use client";

import { useState } from "react";
import type { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { sugerirUsername } from "@/lib/auth";
import { IconUser, IconCorreo, IconTelefono, IconMapPin, IconLock, IconEye, IconEyeOff } from "@/components/icons";

function CampoTexto({
  etiqueta,
  icono,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { etiqueta: string; icono: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">{etiqueta}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40">
          {icono}
        </span>
        <input className="input pl-9" {...props} />
      </div>
    </label>
  );
}

function CampoPassword({
  etiqueta,
  placeholder,
  value,
  onChange,
}: {
  etiqueta: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">{etiqueta}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40">
          <IconLock className="h-4 w-4" />
        </span>
        <input
          type={mostrar ? "text" : "password"}
          required
          minLength={8}
          className="input pl-9 pr-9"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setMostrar((v) => !v)}
          aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40 hover:text-borgona"
        >
          {mostrar ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
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
        ciudad,
        telefono,
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
          <CampoTexto
            etiqueta="Nombres"
            icono={<IconUser className="h-4 w-4" />}
            placeholder="Ingresa tus nombres"
            required
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
          <CampoTexto
            etiqueta="Apellidos"
            icono={<IconUser className="h-4 w-4" />}
            placeholder="Ingresa tus apellidos"
            required
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </div>
        <CampoTexto
          etiqueta="Correo electrónico"
          icono={<IconCorreo className="h-4 w-4" />}
          type="email"
          required
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CampoTexto
          etiqueta="Teléfono"
          icono={<IconTelefono className="h-4 w-4" />}
          type="tel"
          placeholder="+57 300 123 4567"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <CampoTexto
          etiqueta="Ciudad"
          icono={<IconMapPin className="h-4 w-4" />}
          placeholder="Ingresa tu ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
        <CampoPassword
          etiqueta="Contraseña"
          placeholder="Crea tu contraseña"
          value={password}
          onChange={setPassword}
        />
        <CampoPassword
          etiqueta="Confirmar contraseña"
          placeholder="Confirma tu contraseña"
          value={confirmarPassword}
          onChange={setConfirmarPassword}
        />
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
