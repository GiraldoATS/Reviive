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

const tituloClase = "text-xs uppercase tracking-widest text-dorado-suave mb-3";
const listaClase = "space-y-[16px] text-sm text-carbon/80";

export default function Footer() {
  return (
    <footer className="border-t border-greige/70 bg-[#e8ded2]">
      <div className="mx-auto w-[94%] max-w-[1500px] pt-14 pb-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.15fr_0.85fr_0.85fr_1fr_0.75fr] gap-x-8 xl:gap-x-10 gap-y-10 xl:items-start">
        {/* Marca */}
        <div className="flex flex-col items-center text-center xl:-mt-3">
          <div className="relative h-36 w-[122px] mx-auto">
            <Image src="/images/sello.png" alt="Reviive" fill sizes="122px" className="object-contain" />
          </div>
          <p className="mt-3 text-sm italic text-carbon/70">
            El taller donde el tiempo se devuelve.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
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

        {/* Navegación + Servicios: una sola columna en tablet, dos columnas propias en desktop */}
        <div className="xl:contents grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-10 sm:gap-y-0">
          <div>
            <h3 className={tituloClase}>Navegación</h3>
            <ul className={listaClase}>
              {navegacion.map((n) => (
                <li key={n.label}>
                  <Link href={n.href} className="hover:text-borgona transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={tituloClase}>Servicios</h3>
            <ul className={listaClase}>
              {servicios.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="hover:text-borgona transition-colors">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ayuda + Contacto: un solo bloque */}
        <div>
          <h3 className={tituloClase}>Ayuda</h3>
          <ul className={listaClase}>
            {ayuda.map((a) => (
              <li key={a.label}>
                <Link href={a.href} className="hover:text-borgona transition-colors">{a.label}</Link>
              </li>
            ))}
          </ul>
          <h3 className={`${tituloClase} mt-7`}>Contacto</h3>
          <p className="text-sm text-carbon/80">hola@reviive.com</p>
          <p className="text-sm text-carbon/80">+57 318 485 5941</p>
          <p className="text-sm text-carbon/80">Medellín, Colombia</p>
          <Button href="/contacto" variant="secondary" className="mt-4 text-xs">Escríbenos</Button>
        </div>

        {/* Reloj de arena: columna propia, con aire respecto a Ayuda/Contacto */}
        <div className="flex justify-center md:col-span-3 xl:col-span-1 xl:justify-start xl:-ml-8 xl:self-center mt-2 md:mt-8 xl:mt-0">
          <Image
            src="/images/footer-hourglass.png"
            alt=""
            width={700}
            height={541}
            className="w-[180px] xl:w-[225px] h-auto opacity-90"
          />
        </div>
      </div>

      <div className="bg-borgona">
        <div className="py-4 w-[94%] max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-marfil/60">
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
