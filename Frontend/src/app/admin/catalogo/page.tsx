import RolePortalShell from "@/components/RolePortalShell";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import ProductPhoto from "@/components/ProductPhoto";
import { IconPlus } from "@/components/icons";
import { getProductos } from "@/lib/api";

export default async function CatalogoAdminPage() {
  const productos = await getProductos();

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Catálogo"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Gestión del catálogo</h1>
          <p className="text-sm text-carbon/55">Servicios de restauración activos, cargados desde la API.</p>
        </div>
        <Button variant="primary" className="text-xs">
          <IconPlus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      <SimpleTable
        columns={["", "Nombre", "Categoría", "Precio base", "Estado", ""]}
        rows={productos.map((p) => [
          <ProductPhoto key="i" icono={p.imagen} src={p.imagenUrl} className="h-10 w-10 rounded-lg" />,
          p.nombre,
          p.categoria,
          `$${p.precioBase.toLocaleString("es-CO")}`,
          <Badge key="e" tone={p.activo ? "success" : "pending"}>{p.activo ? "Activo" : "Inactivo"}</Badge>,
          <span key="a" className="text-borgona text-xs">Editar →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
