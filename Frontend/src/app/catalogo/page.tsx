import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import ProductPhoto from "@/components/ProductPhoto";
import { getProductos } from "@/lib/api";

export default async function CatalogoPage() {
  const productos = await getProductos();
  const categorias = Array.from(new Set(productos.map((p) => p.categoria)));

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-[220px_1fr] gap-10">
        <aside>
          <h2 className="font-display text-lg text-borgona mb-4">Categorías</h2>
          <ul className="space-y-2 text-sm text-carbon/75">
            <li className="text-borgona font-medium">Todas</li>
            {categorias.map((cat) => (
              <li key={cat} className="hover:text-borgona cursor-pointer transition-colors">
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl text-carbon">Catálogo</h1>
              <p className="text-sm text-carbon/60 mt-1">
                Encuentra el servicio ideal para tu recuerdo.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col rounded-2xl border border-greige/70 bg-white/60 overflow-hidden"
              >
                <ProductPhoto icono={prod.imagen} className="h-40 w-full" />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg text-carbon">{prod.nombre}</h3>
                  <p className="mt-2 text-sm text-carbon/65 flex-1">{prod.descripcion}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-dorado-suave">
                      Desde ${prod.precioBase.toLocaleString("es-CO")}
                    </span>
                    <Button href="/recuerdos/nuevo" variant="ghost" className="text-xs px-0">
                      Ver detalle →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
