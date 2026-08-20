import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";

export default function RegistroClientePage() {
  return (
    <AuthShell
      eyebrow="Registro de cliente"
      title="Bienvenido a Reviive"
      subtitle="Crea tu cuenta y comienza a preservar lo que más importa."
      footer={
        <p className="text-carbon/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-borgona underline">Inicia sesión</Link>
        </p>
      }
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Nombres</span>
            <input className="input" placeholder="Ingresa tus nombres" />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Apellidos</span>
            <input className="input" placeholder="Ingresa tus apellidos" />
          </label>
        </div>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
          <input type="email" className="input" placeholder="ejemplo@correo.com" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Contraseña</span>
          <input type="password" className="input" placeholder="Crea tu contraseña" />
        </label>
        <label className="flex items-start gap-2 text-xs text-carbon/60">
          <input type="checkbox" className="accent-borgona mt-0.5" />
          Acepto los Términos y Condiciones y la Política de Privacidad.
        </label>
        <Button type="submit" variant="primary" className="w-full justify-center">
          Crear cuenta
        </Button>
      </form>
    </AuthShell>
  );
}
