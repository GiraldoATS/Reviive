type NavItem = { href: string; label: string };

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
  { href: "/admin/matching", label: "Matching" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/custodia", label: "Cadena de custodia" },
  { href: "/admin/logistica", label: "Logística" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/proveedores", label: "Proveedores" },
  { href: "/admin/catalogo", label: "Catálogo" },
  { href: "/admin/pagos", label: "Pagos y comisiones" },
  { href: "/admin/reclamaciones", label: "Reclamaciones" },
  { href: "/admin/notificaciones", label: "Notificaciones" },
  { href: "/admin/reportes", label: "Reportes" },
  { href: "/admin/usuarios", label: "Usuarios y roles" },
  { href: "/admin/configuracion", label: "Configuración" },
];

const SUPERVISION_NAV: NavItem[] = [
  { href: "/supervision", label: "Resumen" },
  { href: "/supervision/conversaciones", label: "Conversaciones" },
  { href: "/supervision/evaluaciones", label: "Evaluaciones" },
  { href: "/supervision/revision", label: "Revisión y corrección" },
  { href: "/supervision/agentes", label: "Agentes" },
  { href: "/supervision/dataset", label: "Dataset de entrenamiento" },
  { href: "/supervision/conocimiento", label: "Base de conocimiento" },
  { href: "/supervision/ml", label: "Machine Learning" },
  { href: "/supervision/auditoria", label: "Auditoría y trazabilidad" },
];

function withActive(items: NavItem[], pathname: string) {
  return items.map((item) => ({
    ...item,
    active: item.href === pathname || (item.href !== "/admin" && item.href !== "/supervision" && pathname.startsWith(item.href)),
  }));
}

export function adminNav(pathname: string) {
  return withActive(ADMIN_NAV, pathname);
}

export function supervisionNav(pathname: string) {
  return withActive(SUPERVISION_NAV, pathname);
}
