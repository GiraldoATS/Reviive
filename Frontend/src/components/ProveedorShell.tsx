"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import FloatingAlma from "@/components/FloatingAlma";
import { useAuth } from "@/lib/AuthContext";
import { ProveedorProvider, useProveedor } from "@/lib/ProveedorContext";
import { IconBell, IconStar, IconChevronDown, IconMapPin } from "@/components/icons";

const ICONS = "/images/proveedor";

const navLinks = [
  { href: "/proveedor/dashboard", label: "Dashboard", icono: "icon-dashboard.png", disponible: true },
  { href: "/proveedor/solicitudes", label: "Solicitudes", icono: "icon-solicitudes.png", disponible: true },
  { href: "/proveedor/cotizaciones", label: "Cotizaciones", icono: "icon-cotizaciones.png", disponible: true },
  { href: "/proveedor/pedidos", label: "Pedidos", icono: "icon-pedidos.png", disponible: true },
  { href: "/proveedor/evidencias", label: "Evidencias", icono: "icon-evidencias.png", disponible: true },
  { href: "/proveedor/capacidad", label: "Capacidad", icono: "icon-capacidad.png", disponible: true },
  { href: "/proveedor/ingresos", label: "Ingresos", icono: "icon-ingresos.png", disponible: true },
  { href: "/proveedor/calificaciones", label: "Calificaciones", icono: "icon-calificaciones.png", disponible: true },
  { href: "/proveedor/mensajes", label: "Mensajes", icono: "icon-mensajes.png", disponible: true },
  { href: "/proveedor/configuracion", label: "Configuración", icono: "icon-configuracion.png", disponible: true },
] as const;

function ContenidoShell({ activeHref, children }: { activeHref: string; children: ReactNode }) {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const { proveedor, cargandoProveedor } = useProveedor();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const nombre = usuario?.perfil?.nombre?.trim().split(" ")[0] || "";
  const inicial = nombre ? nombre[0].toUpperCase() : "P";
  const verificado = proveedor?.estado_validacion === "validado";
  const calificacion = proveedor ? Number(proveedor.calificacion) : 0;

  function cerrarSesion() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-marfil flex flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="lg:w-80 shrink-0 bg-borgona-dark text-marfil/90 flex flex-col pb-8">
        <div className="p-6 flex items-start gap-3">
          <span className="relative h-16 w-16 shrink-0 mt-0.5">
            <Image src={`${ICONS}/logo-icono-dorado.png`} alt="" fill sizes="64px" className="object-contain" unoptimized />
          </span>
          <div className="leading-tight">
            <p className="font-display text-3xl text-dorado-suave">Reviive</p>
            <p className="mt-0.5 text-xs italic text-marfil/70">Honramos historias, creamos memoria.</p>
          </div>
        </div>

        <p className="px-6 text-[11px] uppercase tracking-widest text-dorado-suave/80">Proveedor</p>

        <nav className="mt-3 flex-1 px-3 space-y-1">
          {navLinks.map((n) => {
            const activo = n.href === activeHref;
            if (!n.disponible) {
              return (
                <span
                  key={n.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-marfil/35 cursor-default"
                  title="Próximamente"
                >
                  <span className="relative h-7 w-7 shrink-0">
                    <Image src={`${ICONS}/${n.icono}`} alt="" fill sizes="28px" className="object-contain grayscale opacity-60" unoptimized />
                  </span>
                  {n.label}
                </span>
              );
            }
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  activo ? "bg-marfil/10 text-dorado-suave font-medium" : "text-marfil/85 hover:bg-marfil/5"
                }`}
              >
                <span className="relative h-7 w-7 shrink-0">
                  <Image src={`${ICONS}/${n.icono}`} alt="" fill sizes="28px" className="object-contain" unoptimized />
                </span>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-greige/60 bg-white/60 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden bg-rosa/40 flex items-center justify-center">
              <span className="font-display text-lg text-borgona">{(proveedor?.nombre_taller || "P")[0]}</span>
            </span>
            <div>
              <p className="font-display text-base text-carbon leading-tight">
                {cargandoProveedor ? "Cargando..." : proveedor?.nombre_taller || "Mi taller"}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-carbon/60">
                {proveedor?.ciudad && (
                  <span className="inline-flex items-center gap-1">
                    <IconMapPin className="h-3 w-3" />
                    {proveedor.ciudad}, Colombia
                  </span>
                )}
                {!cargandoProveedor && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                      verificado ? "bg-emerald-50 text-emerald-700" : "bg-dorado-suave/15 text-borgona-dark"
                    }`}
                  >
                    {verificado ? "Proveedor verificado" : "Proveedor no verificado"}
                  </span>
                )}
                {verificado && calificacion > 0 && (
                  <span className="inline-flex items-center gap-1 text-dorado-suave">
                    <IconStar className="h-3 w-3" />
                    {calificacion.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-greige/60 text-carbon/60 hover:text-borgona transition-colors" aria-label="Notificaciones">
              <IconBell className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuAbierto((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-transparent hover:border-greige/60 pl-1 pr-2 py-1 transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-borgona text-marfil text-sm font-medium">
                  {inicial}
                </span>
                <span className="hidden sm:block text-left">
                  <span className="block text-sm text-carbon/80 leading-tight">{nombre || "Cuenta"}</span>
                  <span className="block text-[11px] text-carbon/50 leading-tight">Proveedor</span>
                </span>
                <IconChevronDown className={`h-3.5 w-3.5 text-carbon/50 transition-transform ${menuAbierto ? "rotate-180" : ""}`} />
              </button>
              {menuAbierto && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-greige/50 bg-white shadow-lg py-2 z-50">
                  <button
                    type="button"
                    onClick={cerrarSesion}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-borgona hover:bg-greige/20 transition-colors"
                  >
                    <span className="relative h-4 w-4 shrink-0">
                      <Image src="/images/dashboard/icon-external-link.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                    </span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
      </div>
      <Footer />
      <FloatingAlma />
    </div>
  );
}

export default function ProveedorShell({ activeHref, children }: { activeHref: string; children: ReactNode }) {
  const { accessToken, usuario, cargando } = useAuth();

  if (cargando) {
    return <div className="min-h-screen bg-marfil" />;
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-marfil flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl text-borgona">Inicia sesión para ver tu taller</p>
        <p className="text-sm text-carbon/60 max-w-sm">
          Necesitas iniciar sesión como proveedor para acceder a tu panel de solicitudes, cotizaciones y pedidos.
        </p>
        <Button href="/auth/login" variant="primary">Iniciar sesión →</Button>
      </div>
    );
  }

  if (usuario && usuario.rol !== "proveedor") {
    return (
      <div className="min-h-screen bg-marfil flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl text-borgona">Esta sección es solo para proveedores</p>
        <p className="text-sm text-carbon/60 max-w-sm">
          Tu cuenta no tiene un rol de proveedor. Si tienes un taller, regístralo para acceder a este panel.
        </p>
        <Button href="/" variant="primary">Volver al inicio →</Button>
      </div>
    );
  }

  return (
    <ProveedorProvider>
      <ContenidoShell activeHref={activeHref}>{children}</ContenidoShell>
    </ProveedorProvider>
  );
}
