import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IconPlus } from "@/components/icons";

const usuarios = [
  ["María Camila Gómez", "maria.gomez@reviive.com", "Administrador", "Activo"],
  ["Juan Pablo Rivera", "juan.rivera@reviive.com", "Analista", "Activo"],
  ["Laura Restrepo", "laura.restrepo@reviive.com", "Operaciones", "Activo"],
  ["Sofía Londoño", "sofia.londono@reviive.com", "Viewer", "Inactivo"],
];

export default function UsuariosAdminPage() {
  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Usuarios y roles"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Gestión de usuarios y roles</h1>
          <p className="text-sm text-carbon/55">Controla usuarios, roles y permisos en la plataforma.</p>
        </div>
        <Button variant="primary" className="text-xs"><IconPlus className="h-4 w-4" /> Nuevo usuario</Button>
      </div>

      <SimpleTable
        columns={["Nombre", "Correo electrónico", "Rol", "Estado", ""]}
        rows={usuarios.map((u) => [
          u[0], u[1], u[2],
          <Badge key="e" tone={u[3] === "Activo" ? "success" : "pending"}>{u[3]}</Badge>,
          <span key="a" className="text-borgona text-xs">Editar →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
