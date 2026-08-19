import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/recuerdos/nuevo", label: "Cómo funciona" },
  { href: "/chat", label: "Hablar con Alma" },
];

export default function Navbar() {
  return (
    <header className="border-b border-greige/60 bg-marfil/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Reviive - Inicio">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-carbon/80">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-borgona transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button href="/pedido/pedido-0512" variant="primary" className="text-xs md:text-sm">
          Ingresar
        </Button>
      </div>
    </header>
  );
}
