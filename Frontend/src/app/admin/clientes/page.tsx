import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import FilterBar from "@/components/FilterBar";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconUsers, IconUser, IconBox } from "@/components/icons";

const clientes = [
  ["Juan Martínez", "Guadalajara", "12", "Activo"],
  ["Laura Méndez", "Monterrey", "7", "Activo"],
  ["María del Carmen R.", "Puebla", "15", "Activo"],
  ["Andrés Castillo", "Querétaro", "9", "Activo"],
  ["Sofía Ramírez", "Guadalajara", "4", "Inactivo"],
];

export default function ClientesAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Clientes"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de clientes</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra y da seguimiento a todos tus clientes desde un solo lugar.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconUsers className="h-5 w-5" />} value="2,534" label="Clientes activos" trend="+12.5%" trendTone="up" tone="rosa" />
        <StatCard icon={<IconUser className="h-5 w-5" />} value="186" label="Nuevos este mes" trend="+18.7%" trendTone="up" tone="dorado" />
        <StatCard icon={<IconBox className="h-5 w-5" />} value="1,642" label="Clientes recurrentes" trend="+14.1%" trendTone="up" tone="verde" />
        <StatCard icon={<IconUsers className="h-5 w-5" />} value="312" label="Casos con seguimiento" trend="-6.3%" trendTone="down" tone="greige" />
      </div>

      <FilterBar
        fields={[
          { label: "Ciudad", placeholder: "Todas las ciudades" },
          { label: "Estado", placeholder: "Todos los estados" },
          { label: "Rango de fechas", placeholder: "Últimos 30 días" },
          { label: "Ordenar por", placeholder: "Más reciente" },
        ]}
      />

      <SimpleTable
        columns={["Cliente", "Ciudad", "Pedidos", "Estado", ""]}
        rows={clientes.map((c) => [
          c[0], c[1], c[2],
          <Badge key="e" tone={c[3] === "Activo" ? "success" : "pending"}>{c[3]}</Badge>,
          <span key="a" className="text-borgona text-xs">Ver →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
