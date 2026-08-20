import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";

export default function RecuperarContrasenaPage() {
  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace temporal y de un solo uso a tu correo."
      footer={
        <Link href="/auth/login" className="text-borgona">← Volver a iniciar sesión</Link>
      }
    >
      <form className="space-y-4">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
          <input type="email" className="input" placeholder="tu@email.com" />
        </label>
        <Button type="submit" variant="primary" className="w-full justify-center">
          Enviar enlace de recuperación
        </Button>
      </form>
    </AuthShell>
  );
}
