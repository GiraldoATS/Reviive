import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";

const manoDeObra = [
  { actividad: "Diagnóstico y desmontaje", costo: 600 },
  { actividad: "Restauración estructural", costo: 1600 },
  { actividad: "Lijado y preparación", costo: 1200 },
  { actividad: "Acabado y protección", costo: 800 },
];

const materiales = [
  { material: "Barniz natural mate", costo: 350 },
  { material: "Cera de abeja", costo: 120 },
];

const totalManoObra = manoDeObra.reduce((a, m) => a + m.costo, 0);
const totalMateriales = materiales.reduce((a, m) => a + m.costo, 0);
const logistica = 250;
const total = totalManoObra + totalMateriales + logistica;

export default function NuevaCotizacionProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Cotizaciones", "Nueva"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Crear cotización</h1>
      <p className="text-sm text-carbon/55 mb-6">Restauración de baúl de madera · #1287</p>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">1. Mano de obra</h2>
            <ul className="divide-y divide-greige/50 text-sm">
              {manoDeObra.map((m) => (
                <li key={m.actividad} className="flex justify-between py-2">
                  <span>{m.actividad}</span>
                  <span className="text-carbon/60">${m.costo.toLocaleString("es-CO")}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">2. Materiales</h2>
            <ul className="divide-y divide-greige/50 text-sm">
              {materiales.map((m) => (
                <li key={m.material} className="flex justify-between py-2">
                  <span>{m.material}</span>
                  <span className="text-carbon/60">${m.costo.toLocaleString("es-CO")}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">3. Notas para el cliente</h2>
            <textarea
              className="input resize-none"
              rows={3}
              defaultValue="Usaremos productos naturales que respetan la madera original. Cualquier detalle adicional se consultará antes de proceder."
            />
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Resumen de cotización</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-carbon/50">Mano de obra</dt><dd>${totalManoObra.toLocaleString("es-CO")}</dd></div>
            <div className="flex justify-between"><dt className="text-carbon/50">Materiales</dt><dd>${totalMateriales.toLocaleString("es-CO")}</dd></div>
            <div className="flex justify-between"><dt className="text-carbon/50">Logística</dt><dd>${logistica.toLocaleString("es-CO")}</dd></div>
          </dl>
          <div className="mt-3 pt-3 border-t border-greige/60 flex justify-between items-center">
            <span className="text-sm text-carbon/60">Total</span>
            <span className="font-display text-xl text-borgona">${total.toLocaleString("es-CO")}</span>
          </div>
          <Button variant="primary" className="w-full justify-center mt-4">Enviar cotización al cliente</Button>
        </Card>
      </div>
    </RolePortalShell>
  );
}
