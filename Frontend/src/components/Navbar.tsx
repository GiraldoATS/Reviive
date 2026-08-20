import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import CategoriesMenu from "./CategoriesMenu";
import { IconUserCircle } from "./icons";

const links = [
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/catalogo", label: "Servicios" },
  { href: "/historias", label: "Historias" },
  { href: "/sobre-reviive", label: "Sobre Reviive" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  return (
    <header className="border-b border-greige/60 bg-marfil/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Reviive - Inicio">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm text-carbon/80">
          <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
          <Link href={links[0].href} className="hover:text-borgona transition-colors">{links[0].label}</Link>
          <Link href={links[1].href} className="hover:text-borgona transition-colors">{links[1].label}</Link>
          <CategoriesMenu />
          <Link href={links[2].href} className="hover:text-borgona transition-colors">{links[2].label}</Link>
          <Link href={links[3].href} className="hover:text-borgona transition-colors">{links[3].label}</Link>
          <Link href={links[4].href} className="hover:text-borgona transition-colors">{links[4].label}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button href="/recuerdos/nuevo" variant="primary" className="text-xs md:text-sm">
            Solicitar evaluación
          </Button>
          <Link
            href="/auth/login"
            aria-label="Ingresar"
            className="h-9 w-9 rounded-full border border-greige/70 flex items-center justify-center text-carbon/60 hover:text-borgona hover:border-borgona/50 transition-colors"
          >
            <IconUserCircle className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
