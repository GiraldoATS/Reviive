import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { IconBox, IconWallet, IconTruck, IconAlertTriangle, IconStar, IconMessage } from "@/components/icons";

const stats = [
  { icon: <IconBox className="h-5 w-5" />, valor: "12", label: "Solicitudes nuevas", trend: "+20% vs. ayer" },
  { icon: <IconMessage className="h-5 w-5" />, valor: "7", label: "Cotizaciones pendientes", trend: "Ver detalles" },
  { icon: <IconTruck className="h-5 w-5" />, valor: "18", label: "Pedidos activos", trend: "Ver pedidos" },
  { icon: <IconAlertTriangle className="h-5 w-5" />, valor: "3", label: "Pedidos atrasados", trend: "Atención requerida" },
  { icon: <IconWallet className="h-5 w-5" />, valor: "$48,560", label: "Ingresos del mes", trend: "+15% vs. mes pasado" },
  { icon: <IconStar className="h-5 w-5" />, valor: "4.8", label: "Calificación promedio", trend: "128 calificaciones" },
];

const tareas = [
  { texto: "Responder 8 solicitudes nuevas", prioridad: "Alta", nota: "Vence hoy" },
  { texto: "Enviar 3 cotizaciones pendientes", prioridad: "Media", nota: "Vence mañana" },
  { texto: "Actualizar seguimiento de pedidos atrasados", prioridad: "Alta", nota: "Requiere atención" },
];

export default function ProveedorDashboardPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Dashboard"]}>
      <h1 className="font-display text-2xl text-carbon">Bienvenida, María</h1>
      <p className="text-sm text-carbon/55 mt-1 mb-6">
        Aquí tienes un resumen de tu actividad y pendientes importantes.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="flex gap-4">
            <div className="h-11 w-11 shrink-0 rounded-full bg-rosa/40 text-borgona-dark flex items-center justify-center">
              {s.icon}
            </div>
            <div>
              <p className="font-display text-2xl text-carbon leading-none">{s.valor}</p>
              <p className="mt-1.5 text-xs text-carbon/55">{s.label}</p>
              <p className="mt-1 text-[11px] text-dorado-suave">{s.trend}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-display text-lg text-carbon mb-4">Tareas prioritarias</h2>
        <ul className="divide-y divide-greige/50">
          {tareas.map((t) => (
            <li key={t.texto} className="flex items-center justify-between py-3">
              <span className="text-sm text-carbon">{t.texto}</span>
              <div className="flex items-center gap-3">
                <Badge tone={t.prioridad === "Alta" ? "progress" : "pending"}>{t.prioridad}</Badge>
                <span className="text-xs text-carbon/45">{t.nota}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </RolePortalShell>
  );
}
