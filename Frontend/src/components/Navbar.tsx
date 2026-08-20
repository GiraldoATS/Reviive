import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import CategoriesMenu from "./CategoriesMenu";
import NavLink from "./NavLink";
import { IconUserCircle } from "./icons";

export default function Navbar() {
  return (
    <header className="border-b border-greige/60 bg-marfil/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Reviive - Inicio">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-sm">
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/como-funciona">Cómo funciona</NavLink>
          <NavLink href="/catalogo">Servicios</NavLink>
          <CategoriesMenu />
          <NavLink href="/historias">Historias</NavLink>
          <NavLink href="/sobre-reviive">Sobre Reviive</NavLink>
          <NavLink href="/contacto">Contacto</NavLink>
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
