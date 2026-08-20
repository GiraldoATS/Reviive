import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { IconBox } from "@/components/icons";

const etapas = ["Recepción de materiales", "En producción", "Control de calidad", "Empaque", "Envío", "Entrega"];

export default function EvidenciasProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Evidencias"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Registro de evidencias</h1>
      <p className="text-sm text-carbon/55 mb-6">Sube fotos, videos, comentarios y evidencia de cada etapa del pedido.</p>

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-carbon">Pedido #1256 · Centro floral premium</p>
            <p className="text-xs text-carbon/50">Solicitud de María López · En producción</p>
          </div>
          <span className="text-xs text-carbon/50">Etapa actual: En producción · 50%</span>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          {etapas.map((e, i) => (
            <span key={e} className={`rounded-full px-3 py-1.5 text-xs ${i === 1 ? "bg-borgona text-marfil" : "border border-greige/70 text-carbon/60"}`}>
              {e}
            </span>
          ))}
        </div>
        <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Fotos</h2>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-marfil border border-greige/70 flex items-center justify-center">
              <IconBox className="h-6 w-6 text-greige" />
            </div>
          ))}
          <div className="aspect-square rounded-lg border-2 border-dashed border-greige/70 flex items-center justify-center text-xs text-carbon/50 text-center px-2">
            Subir foto
          </div>
        </div>
        <label className="block mb-4">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Comentarios de la etapa</span>
          <textarea className="input resize-none" rows={3} placeholder="Describe el avance de esta etapa..." />
        </label>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1 justify-center">Guardar borrador</Button>
          <Button variant="primary" className="flex-1 justify-center">Marcar como completada</Button>
        </div>
      </Card>
    </RolePortalShell>
  );
}
