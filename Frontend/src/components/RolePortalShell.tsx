"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PortalSidebar from "./PortalSidebar";
import PortalTopbar from "./PortalTopbar";
import { adminNav, proveedorNav, supervisionNav } from "@/lib/nav";
import { useAuth } from "@/lib/AuthContext";
import type { RolUsuario } from "@/types";

type Role = "admin" | "proveedor" | "supervision";

const rolesPermitidos: Record<Role, RolUsuario[]> = {
  admin: ["administrador", "superadministrador"],
  proveedor: ["proveedor"],
  supervision: ["supervisor_ia", "administrador", "superadministrador"],
};

const roleConfig: Record<
  Role,
  { title: string; nav: (p: string) => { href: string; label: string; active: boolean }[] }
> = {
  admin: { title: "Admin", nav: adminNav },
  proveedor: { title: "Proveedor", nav: proveedorNav },
  supervision: { title: "Supervisión", nav: supervisionNav },
};

export default function RolePortalShell({
  role,
  crumbs,
  children,
}: {
  role: Role;
  crumbs?: string[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, cargando } = useAuth();
  const config = roleConfig[role];
  const autorizado = !!usuario && rolesPermitidos[role].includes(usuario.rol);

  useEffect(() => {
    if (cargando) return;
    if (!usuario) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    } else if (!autorizado) {
      router.replace("/auth/acceso-denegado");
    }
  }, [cargando, usuario, autorizado, pathname, router]);

  if (cargando || !autorizado) {
    return <div className="min-h-screen flex items-center justify-center bg-marfil text-carbon/50 text-sm">Verificando acceso…</div>;
  }

  const userName = usuario.perfil?.nombre || usuario.email;
  const userRole = usuario.perfil?.ciudad ? `${config.title} · ${usuario.perfil.ciudad}` : config.title;

  return (
    <div className="min-h-screen flex bg-marfil">
      <PortalSidebar title={config.title} userLabel={userRole} items={config.nav(pathname)} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalTopbar crumbs={crumbs} userName={userName} userRole={userRole} notifications={12} />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
