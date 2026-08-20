import Link from "next/link";
import Logo from "./Logo";
import LeafSprig from "./LeafSprig";
import Button from "./Button";
import { IconInstagram, IconFacebook, IconTikTok, IconCorreo, IconEnviar } from "./icons";

const redes = [
  { Icono: IconInstagram, label: "Instagram", href: "https://instagram.com" },
  { Icono: IconFacebook, label: "Facebook", href: "https://facebook.com" },
  { Icono: IconTikTok, label: "TikTok", href: "https://tiktok.com" },
  { Icono: IconCorreo, label: "Correo", href: "mailto:hola@reviive.com" },
  { Icono: IconEnviar, label: "Telegram", href: "https://t.me" },
];

const navegacion = [
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/catalogo", label: "Servicios" },
  { href: "/catalogo", label: "Categorías" },
  { href: "/historias", label: "Historias" },
  { href: "/sobre-reviive", label: "Sobre Reviive" },
  { href: "/contacto", label: "Contacto" },
];

const servicios = [
  { href: "/catalogo", label: "Restauración" },
  { href: "/catalogo", label: "Preservación" },
  { href: "/catalogo", label: "Transformación" },
  { href: "/catalogo", label: "Mantenimiento" },
  { href: "/recuerdos/nuevo", label: "Evaluaciones" },
];

const ayuda = [
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/chat", label: "Cuidados y consejos" },
  { href: "/preguntas-frecuentes", label: "Términos y condiciones" },
  { href: "/preguntas-frecuentes", label: "Política de privacidad" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-greige/70 bg-[#e8ded2] relative overflow-hidden">
      <LeafSprig className="hidden md:block absolute right-6 top-8 h-40 w-40 text-dorado/50" />
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4 relative">
        <div>
          <Logo className="scale-125 origin-left" />
          <p className="mt-5 max-w-xs text-sm italic text-carbon/70">
            El taller donde el tiempo se devuelve.
          </p>
          <div className="mt-4 flex gap-3">
            {redes.map((r) => (
              <a
                key={r.label}
                href={r.href}
                aria-label={r.label}
                className="h-9 w-9 rounded-full bg-borgona text-marfil flex items-center justify-center hover:bg-borgona-dark transition-colors"
              >
                <r.Icono className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-dorado-suave mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm text-carbon/80">
            {navegacion.map((n) => (
              <li key={n.label}>
                <Link href={n.href} className="hover:text-borgona transition-colors">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-dorado-suave mb-3">Servicios</h3>
          <ul className="space-y-2 text-sm text-carbon/80">
            {servicios.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="hover:text-borgona transition-colors">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-dorado-suave mb-3">Ayuda</h3>
          <ul className="space-y-2 text-sm text-carbon/80 mb-5">
            {ayuda.map((a) => (
              <li key={a.label}>
                <Link href={a.href} className="hover:text-borgona transition-colors">{a.label}</Link>
              </li>
            ))}
          </ul>
          <h3 className="text-xs uppercase tracking-widest text-dorado-suave mb-2">Contacto</h3>
          <p className="text-sm text-carbon/80">hola@reviive.com</p>
          <p className="text-sm text-carbon/80">+57 318 485 5941</p>
          <p className="text-sm text-carbon/80">Medellín, Colombia</p>
          <Button href="/contacto" variant="secondary" className="mt-3 text-xs">Escríbenos</Button>
        </div>
      </div>
      <div className="border-t border-greige/60 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-carbon/50 max-w-6xl mx-auto">
        <span>© 2026 Reviive. Todos los derechos reservados.</span>
        <div className="flex gap-4">
          <Link href="/preguntas-frecuentes" className="hover:text-borgona">Términos y condiciones</Link>
          <Link href="/preguntas-frecuentes" className="hover:text-borgona">Política de privacidad</Link>
        </div>
      </div>
    </footer>
  );
}
