import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import Button from "@/components/Button";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Bienvenida de vuelta"
      title="Iniciar sesión"
      footer={
        <p className="text-carbon/60">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/seleccionar-rol" className="text-borgona underline">
            Crear cuenta
          </Link>
        </p>
      }
    >
      <form className="space-y-4">
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Correo electrónico</span>
          <input type="email" className="input" placeholder="tu@email.com" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">Contraseña</span>
          <input type="password" className="input" placeholder="••••••••" />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-carbon/60">
            <input type="checkbox" className="accent-borgona" /> Recordarme
          </label>
          <Link href="/auth/recuperar" className="text-borgona">¿Olvidaste tu contraseña?</Link>
        </div>
        <Button type="submit" variant="primary" className="w-full justify-center">
          Iniciar sesión →
        </Button>
        <div className="flex items-center gap-3 text-xs text-carbon/40">
          <span className="flex-1 h-px bg-greige/70" /> o continuar con <span className="flex-1 h-px bg-greige/70" />
        </div>
        <Button href="/auth/telegram" variant="secondary" className="w-full justify-center">
          Continuar con Telegram
        </Button>
      </form>
    </AuthShell>
  );
}
