import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";

export default function RegistroProveedorPage() {
  return (
    <AuthShell
      eyebrow="Registro de proveedor"
      title="Únete como taller o artesano"
      subtitle="Postúlate para ofrecer tus servicios de restauración en Reviive."
      footer={
        <p className="text-carbon/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-borgona underline">Inicia sesión</Link>
        </p>
      }
    >
      <form className="space-y-4">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Nombre del taller</span>
          <input className="input" placeholder="Artesanía El Recuerdo" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Ciudad</span>
          <input className="input" placeholder="Oaxaca, Oaxaca" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
          <input type="email" className="input" placeholder="taller@correo.com" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Contraseña</span>
          <input type="password" className="input" placeholder="Crea tu contraseña" />
        </label>
        <Button type="submit" variant="primary" className="w-full justify-center">
          Enviar solicitud de registro
        </Button>
        <p className="text-xs text-carbon/50 text-center">
          Tu solicitud quedará en revisión y no recibirás pedidos automáticamente.
        </p>
      </form>
    </AuthShell>
  );
}
