"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const ICONS = "/images/cuenta";

const items = [
  { href: "/mi-cuenta/perfil", label: "Mi perfil", icono: "icon-cuenta.png" },
  { href: "/mi-cuenta/datos", label: "Mis datos", icono: "icon-datos.png" },
  { href: "/mi-cuenta/seguridad", label: "Seguridad", icono: "icon-seguridad.png" },
] as const;

export default function CuentaSidebar({ activo }: { activo: (typeof items)[number]["href"] }) {
  const router = useRouter();
  const { logout } = useAuth();

  function cerrarSesion() {
    logout();
    router.push("/");
  }

  return (
    <nav className="rounded-2xl border border-greige/50 bg-greige/20 p-3 space-y-1 lg:sticky lg:top-20">
      {items.map((item) => {
        const activoAhora = item.href === activo;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              activoAhora ? "bg-white/70 text-borgona font-medium" : "text-carbon/70 hover:bg-white/50"
            }`}
          >
            <span className="relative h-5 w-5 shrink-0">
              <Image src={`${ICONS}/${item.icono}`} alt="" fill sizes="20px" className="object-contain" unoptimized />
            </span>
            {item.label}
          </Link>
        );
      })}
      <div className="my-1.5 border-t border-greige/50" />
      <button
        type="button"
        onClick={cerrarSesion}
        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-borgona hover:bg-white/50 transition-colors"
      >
        <span className="relative h-5 w-5 shrink-0">
          <Image src="/images/dashboard/icon-external-link.png" alt="" fill sizes="20px" className="object-contain" unoptimized />
        </span>
        Cerrar sesión
      </button>
    </nav>
  );
}
