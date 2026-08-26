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
        <span title="Próximamente">
          <Button variant="primary" className="text-xs opacity-50 cursor-not-allowed" disabled>
            <IconPlus className="h-4 w-4" /> Nuevo producto
          </Button>
        </span>
      </div>

      <SimpleTable
        columns={["", "Nombre", "Categoría", "Precio base", "Estado", ""]}
        rows={productos.map((p) => [
          <ProductPhoto key={`${p.id}-foto`} icono={p.imagen} src={p.imagenUrl} className="h-10 w-10 rounded-lg" />,
          p.nombre,
          p.categoria,
          `$${p.precioBase.toLocaleString("es-CO")}`,
          <Badge key={`${p.id}-estado`} tone={p.activo ? "success" : "pending"}>{p.activo ? "Activo" : "Inactivo"}</Badge>,
          <span key={`${p.id}-editar`} className="text-carbon/35 text-xs" title="Próximamente">Editar</span>,
        ])}
      />
    </RolePortalShell>
  );
}
