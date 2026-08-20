import Link from "next/link";
import Image from "next/image";
import Button from "./Button";

const redes = [
  { icono: "/images/social/instagram.png", label: "Instagram", href: "https://instagram.com" },
  { icono: "/images/social/facebook.png", label: "Facebook", href: "https://facebook.com" },
  { icono: "/images/social/tiktok.png", label: "TikTok", href: "https://tiktok.com" },
  { icono: "/images/social/correo.png", label: "Correo", href: "mailto:hola@reviive.com" },
  { icono: "/images/social/telegram.png", label: "Telegram", href: "https://t.me" },
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
    <footer className="border-t border-greige/70 bg-[#e8ded2] relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-4 pt-14 pb-10 grid gap-10 sm:grid-cols-2 md:grid-cols-4 relative">
        <div className="min-w-0">
          <div className="relative h-40 w-[140px] mx-auto">
            <Image src="/images/sello.png" alt="Reviive" fill sizes="140px" className="object-contain" />
          </div>
          <p className="mt-5 text-sm italic text-carbon/70 text-center">
            El taller donde el tiempo se devuelve.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {redes.map((r) => (
              <a
                key={r.label}
                href={r.href}
                aria-label={r.label}
                className="relative h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.9)]"
              >
                <Image src={r.icono} alt={r.label} fill sizes="40px" className="object-contain" />
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
      <div className="hidden md:flex justify-end max-w-6xl mx-auto px-6 lg:px-4 -mt-4 mb-6 pointer-events-none">
        <div className="relative h-[134px] w-[173px]">
          <Image src="/images/footer-hourglass.png" alt="" fill sizes="173px" className="object-contain" />
        </div>
      </div>
      <div className="bg-borgona">
        <div className="py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-marfil/60 max-w-6xl mx-auto">
          <span>© 2026 Reviive. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <Link href="/preguntas-frecuentes" className="hover:text-marfil transition-colors">Términos y condiciones</Link>
            <Link href="/preguntas-frecuentes" className="hover:text-marfil transition-colors">Política de privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
