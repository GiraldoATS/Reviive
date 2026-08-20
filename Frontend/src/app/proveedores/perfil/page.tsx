import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { IconMadera } from "@/components/icons";

export default function PerfilProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Configuración"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Perfil y portafolio</h1>
      <p className="text-sm text-carbon/55 mb-6">Así te ven los clientes en Reviive.</p>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-rosa/40 flex items-center justify-center">
              <IconMadera className="h-8 w-8 text-borgona" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl text-carbon">Artesanía El Recuerdo</h2>
                <Badge tone="success">Proveedor verificado</Badge>
              </div>
              <p className="text-sm text-carbon/55">Oaxaca, México · ★ 4.8 (128 calificaciones)</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-carbon/75">
            Somos un taller familiar en Oaxaca dedicados a crear piezas
            artesanales que honran historias y recuerdos. Trabajamos con
            técnicas tradicionales y materiales de alta calidad para entregar
            piezas únicas y significativas.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Urnas artesanales", "Tallado en madera", "Alfarería ceremonial", "Cajas conmemorativas"].map((e) => (
              <span key={e} className="rounded-full border border-greige/70 px-3 py-1 text-xs text-carbon/70">{e}</span>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary">Editar perfil</Button>
            <Button variant="primary">Vista pública</Button>
          </div>
        </Card>

        <Card className="h-fit space-y-3 text-sm">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50">Resumen rápido</h2>
          <div className="flex justify-between"><span className="text-carbon/50">Años de experiencia</span><span>12 años</span></div>
          <div className="flex justify-between"><span className="text-carbon/50">Tiempo de entrega</span><span>7-14 días</span></div>
          <div className="flex justify-between"><span className="text-carbon/50">Cobertura de envíos</span><span>Nacional</span></div>
          <div className="flex justify-between"><span className="text-carbon/50">Facturación</span><span>Sí emitimos</span></div>
        </Card>
      </div>
    </RolePortalShell>
  );
}
