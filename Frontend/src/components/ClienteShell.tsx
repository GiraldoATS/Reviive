"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import FloatingAlma from "@/components/FloatingAlma";
import { useAuth } from "@/lib/AuthContext";
import { IconMessage, IconChevronDown } from "@/components/icons";

const ICONS = "/images/dashboard";

const navLinks = [
  { href: "/mi-cuenta", label: "Inicio" },
  { href: "/mis-recuerdos", label: "Mis recuerdos" },
  { href: "/evaluaciones", label: "Evaluaciones" },
  { href: "/mis-cotizaciones", label: "Cotizaciones" },
  { href: "/mis-procesos", label: "Mis procesos" },
  { href: "/envios", label: "Envíos" },
  { href: "/ayuda", label: "Ayuda" },
];

const menuUsuario = [
  { icono: "icon-persona-circle.png", label: "Mi perfil", href: "/mi-cuenta/perfil" },
  { icono: "icon-documento.png", label: "Mis datos", href: "/mi-cuenta/datos" },
  { icono: "icon-shield-lock.png", label: "Seguridad", href: "/mi-cuenta/seguridad" },
];

export default function ClienteShell({ activeHref, children }: { activeHref: string; children: ReactNode }) {
  const router = useRouter();
  const { accessToken, usuario, cargando, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const nombre = usuario?.perfil?.nombre?.trim().split(" ")[0] || "";
  const inicial = nombre ? nombre[0].toUpperCase() : "?";

  function cerrarSesion() {
    logout();
    router.push("/");
  }

  if (cargando) {
    return <div className="min-h-screen bg-marfil" />;
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-marfil flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl text-borgona">Inicia sesión para ver tu cuenta</p>
        <p className="text-sm text-carbon/60 max-w-sm">
          Necesitas iniciar sesión para acceder a tu panel de recuerdos, evaluaciones y procesos.
        </p>
        <Button href="/auth/login" variant="primary">Iniciar sesión →</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-marfil flex flex-col">
      <header className="border-b border-greige/60 px-6 py-3 flex items-center justify-between gap-6">
        <Link href="/mi-cuenta">
          <Logo tagline="Recuerdos que perduran" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm text-carbon/70">
          {navLinks.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`pb-1 border-b-2 transition-colors ${
                n.href === activeHref ? "border-borgona text-borgona font-medium" : "border-transparent hover:text-borgona"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Button href="/recuerdos/nuevo" variant="primary" className="hidden sm:inline-flex">
            Solicitar evaluación
          </Button>
          <Link
            href="/chat"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-greige/60 px-4 py-2 text-sm text-carbon/70 hover:border-borgona/40 transition-colors"
          >
            <IconMessage className="h-4 w-4 text-borgona" />
            Alma
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-transparent hover:border-greige/60 pl-1 pr-2 py-1 transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-borgona text-marfil text-sm font-medium">
                {inicial}
              </span>
              <span className="hidden sm:block text-sm text-carbon/80">{nombre || "Cuenta"}</span>
              <IconChevronDown className={`h-3.5 w-3.5 text-carbon/50 transition-transform ${menuAbierto ? "rotate-180" : ""}`} />
            </button>

            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-greige/50 bg-white shadow-lg py-2 z-50">
                {menuUsuario.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-carbon/75 hover:bg-greige/20 transition-colors"
                  >
                    <span className="relative h-4 w-4 shrink-0">
                      <Image src={`${ICONS}/${m.icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                    </span>
                    {m.label}
                  </Link>
                ))}
                <div className="my-1.5 border-t border-greige/50" />
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-borgona hover:bg-greige/20 transition-colors"
                >
                  <span className="relative h-4 w-4 shrink-0">
                    <Image src={`${ICONS}/icon-external-link.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </span>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
      <FloatingAlma />
    </div>
  );
}
