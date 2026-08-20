import Link from "next/link";
import Logo from "./Logo";

const navegacion = [
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/historias", label: "Historias" },
  { href: "/sobre-reviive", label: "Sobre Reviive" },
  { href: "/contacto", label: "Contacto" },
];

const ayuda = [
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/chat", label: "Hablar con Alma" },
];

const portales = [
  { href: "/proveedores", label: "Portal de proveedores" },
  { href: "/supervision", label: "Centro de supervisión" },
  { href: "/admin", label: "Dashboard administrativo" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-greige/70 bg-marfil">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm italic text-carbon/70">
            El taller donde el tiempo se devuelve.
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-dorado-suave mb-3">
            Navegación
          </h3>
          <ul className="space-y-2 text-sm text-carbon/80">
            {navegacion.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-borgona transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-dorado-suave mb-3">
            Ayuda
          </h3>
          <ul className="space-y-2 text-sm text-carbon/80">
            {ayuda.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="hover:text-borgona transition-colors">
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-widest text-dorado-suave mb-3">
            Portales internos
          </h3>
          <ul className="space-y-2 text-sm text-carbon/80">
            {portales.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-borgona transition-colors">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-greige/60 py-4 text-center text-xs text-carbon/50">
        Reviive · El taller donde el tiempo se devuelve.
      </div>
    </footer>
  );
}
