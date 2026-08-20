import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";

export default function RestablecerContrasenaPage() {
  return (
    <AuthShell
      title="Restablecer contraseña"
      subtitle="Elige una nueva contraseña para tu cuenta de Reviive."
    >
      <form className="space-y-4">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Nueva contraseña</span>
          <input type="password" className="input" placeholder="Crea tu nueva contraseña" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Confirmar contraseña</span>
          <input type="password" className="input" placeholder="Confirma tu nueva contraseña" />
        </label>
        <Button type="submit" variant="primary" className="w-full justify-center">
          Guardar nueva contraseña
        </Button>
      </form>
    </AuthShell>
  );
}
