import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";

const categorias = ["Arreglos florales", "Urnas de madera", "Centros de mesa", "Cremaciones ecológicas"];

export default function CapacidadProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Capacidad"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Gestión de capacidad</h1>
      <p className="text-sm text-carbon/55 mb-6">Administra tu disponibilidad, límites de pedidos y fechas bloqueadas.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Capacidad disponible</h2>
          <div className="flex items-center gap-6">
            <div className="relative h-28 w-28 rounded-full" style={{ background: "conic-gradient(var(--color-dorado) 0deg 281deg, var(--color-greige) 281deg 360deg)" }}>
              <div className="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="font-display text-lg text-carbon">78%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-carbon/75">Tu capacidad está en buen nivel.</p>
              <p className="text-xs text-carbon/50 mt-1">Aún puedes aceptar más pedidos.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Categorías aceptadas</h2>
          <ul className="space-y-2 text-sm">
            {categorias.map((c) => (
              <li key={c} className="flex items-center justify-between">
                <span className="text-carbon/80">{c}</span>
                <span className="text-[#3f5c2b]">✓</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Límite de pedidos por mes</h2>
        <input type="range" min={20} max={100} defaultValue={80} className="w-full accent-borgona" />
        <p className="text-xs text-carbon/50 mt-2">Actual: 48 pedidos · Disponible: 32 pedidos</p>
        <Button variant="primary" className="mt-4">Guardar cambios</Button>
      </Card>
    </RolePortalShell>
  );
}
