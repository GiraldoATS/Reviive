"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import VolverLink from "@/components/VolverLink";
import { IconChevronRight } from "@/components/icons";

export interface SeccionLegal {
  id: string;
  titulo: string;
  parrafos: string[];
  items?: string[];
}

export default function LegalDoc({
  titulo,
  actualizado,
  intro,
  secciones,
  notaIcono,
  notaTexto,
  fotoSrc,
}: {
  titulo: string;
  actualizado: string;
  intro: string;
  secciones: SeccionLegal[];
  notaIcono: string;
  notaTexto: string[];
  fotoSrc: string;
}) {
  const [activa, setActiva] = useState(secciones[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiva(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    secciones.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [secciones]);

  return (
    <div className="min-h-screen bg-marfil flex flex-col">
      <header className="border-b border-greige/60 px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/">
          <Logo tagline="Recuerdos que perduran" />
        </Link>
        <div className="flex items-center gap-5 text-sm text-carbon/70">
          <Link href="/" className="hover:text-borgona transition-colors">Volver al inicio</Link>
          <Link href="/auth/seleccionar-rol" className="hover:text-borgona transition-colors">Volver al registro</Link>
          <Link href="/preguntas-frecuentes" className="hover:text-borgona transition-colors">¿Necesitas ayuda?</Link>
          <span className="h-5 w-px bg-greige/60" />
          <span className="relative h-6 w-6 shrink-0">
            <Image src="/images/auth/hourglass-icon.png" alt="" fill sizes="24px" className="object-contain" unoptimized />
          </span>
        </div>
      </header>

      <main className="relative flex-1 mx-auto max-w-6xl w-full px-6 py-12 grid lg:grid-cols-[220px_1fr_260px] gap-10">
        <div className="pointer-events-none absolute right-0 top-0 hidden h-[460px] w-40 opacity-30 xl:block">
          <Image src="/images/auth/registro-cliente/rama.png" alt="" fill sizes="160px" className="object-contain object-top" unoptimized />
        </div>

        <nav className="hidden lg:block">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-carbon mb-3">
            Índice
            <span className="relative h-3.5 w-4 shrink-0">
              <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="16px" className="object-contain" />
            </span>
          </p>
          <ul className="space-y-0.5 text-sm">
            {secciones.map((s, i) => {
              const activo = s.id === activa;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block border-l-2 py-1.5 pl-3 transition-colors ${
                      activo
                        ? "border-borgona text-borgona font-medium"
                        : "border-transparent text-carbon/60 hover:text-borgona/80"
                    }`}
                  >
                    {i + 1}. {s.titulo}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <article>
          <h1 className="font-display text-4xl text-borgona">{titulo}</h1>
          <span className="relative mt-2 mb-4 block h-4 w-16">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="64px" className="object-contain" />
          </span>
          <p className="text-xs text-carbon/50">Última actualización: {actualizado}</p>
          <p className="mt-3 text-sm text-carbon/70">{intro}</p>

          <div className="mt-8 space-y-8">
            {secciones.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-greige/50 pt-6 first:border-t-0 first:pt-0">
                <h2 className="font-display text-xl text-borgona">
                  {i + 1}. {s.titulo}
                </h2>
                {s.parrafos.map((p, j) => (
                  <p key={j} className="mt-2 text-sm text-carbon/70">{p}</p>
                ))}
                {s.items && (
                  <ul className="mt-3 space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-carbon/70">
                        <IconChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-dorado-suave" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 flex justify-center lg:justify-start">
            <VolverLink
              fallbackHref="/auth/seleccionar-rol"
              className="inline-flex items-center gap-2 rounded-full border border-borgona/40 text-borgona px-6 py-2.5 text-sm hover:bg-borgona/5 transition-colors"
            />
          </div>
        </article>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <span className="relative h-9 w-9 flex items-center justify-center rounded-full bg-white/70 mb-3">
              <Image src={notaIcono} alt="" fill sizes="36px" className="object-contain p-2" unoptimized />
            </span>
            {notaTexto.map((t, i) => (
              <p key={i} className={`text-sm ${i === 0 ? "text-carbon" : "mt-1 text-carbon/70"}`}>
                {t}
              </p>
            ))}
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={fotoSrc} alt="" fill sizes="260px" className="object-cover" unoptimized />
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
