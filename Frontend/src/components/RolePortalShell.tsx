"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import PortalSidebar from "./PortalSidebar";
import PortalTopbar from "./PortalTopbar";
import { adminNav, proveedorNav, supervisionNav } from "@/lib/nav";

type Role = "admin" | "proveedor" | "supervision";

const roleConfig: Record<
  Role,
  { title: string; userName: string; userRole: string; nav: (p: string) => { href: string; label: string; active: boolean }[] }
> = {
  admin: { title: "Admin", userName: "Administrador", userRole: "Administrador", nav: adminNav },
  proveedor: {
    title: "Proveedor",
    userName: "María Hernández",
    userRole: "Taller El Tiempo",
    nav: proveedorNav,
  },
  supervision: {
    title: "Supervisión",
    userName: "Mariana López",
    userRole: "Supervisora de Agentes IA",
    nav: supervisionNav,
  },
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
  const config = roleConfig[role];

  return (
    <div className="min-h-screen flex bg-marfil">
      <PortalSidebar title={config.title} userLabel={config.userRole} items={config.nav(pathname)} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalTopbar crumbs={crumbs} userName={config.userName} userRole={config.userRole} notifications={12} />
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
