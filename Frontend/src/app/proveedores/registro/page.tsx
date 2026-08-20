import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function RegistroProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Registro"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Registro completo del proveedor</h1>
      <p className="text-sm text-carbon/55 mb-6">Cuéntanos sobre tu taller para formar parte de Reviive.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Información del taller</h2>
          <div className="space-y-3">
            <label className="block"><span className="block text-xs text-carbon/50 mb-1">Nombre del taller *</span><input className="input" placeholder="Artesanía El Recuerdo" /></label>
            <label className="block"><span className="block text-xs text-carbon/50 mb-1">Ciudad *</span><input className="input" placeholder="Oaxaca, Oaxaca" /></label>
            <label className="block"><span className="block text-xs text-carbon/50 mb-1">Especialidades *</span><input className="input" placeholder="Tallado en madera, urnas artesanales" /></label>
            <label className="block"><span className="block text-xs text-carbon/50 mb-1">Años de experiencia *</span><input className="input" placeholder="12 años" /></label>
          </div>
        </Card>
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Persona responsable</h2>
          <div className="space-y-3">
            <label className="block"><span className="block text-xs text-carbon/50 mb-1">Nombre completo *</span><input className="input" placeholder="María Hernández" /></label>
            <label className="block"><span className="block text-xs text-carbon/50 mb-1">Teléfono *</span><input className="input" placeholder="951 123 4567" /></label>
            <label className="block"><span className="block text-xs text-carbon/50 mb-1">Correo electrónico *</span><input className="input" placeholder="maria@elrecuerdo.com" /></label>
          </div>
        </Card>
        <Card>
          <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Portafolio</h2>
          <div className="h-32 rounded-xl border-2 border-dashed border-greige/70 flex items-center justify-center text-xs text-carbon/50 text-center px-4">
            Arrastra imágenes aquí o selecciona archivos
          </div>
        </Card>
      </div>

      <Button variant="primary" className="mt-6">Enviar registro</Button>
    </RolePortalShell>
  );
}
