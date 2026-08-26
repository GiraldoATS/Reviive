import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import { IconMessage, IconUpload } from "@/components/icons";

export default function HistoriasPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 pt-4 text-xs text-carbon/50">
        <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-carbon/70">Historias</span>
      </div>

      <section className="relative overflow-hidden grid lg:grid-cols-2 lg:items-center">
        <div className="pointer-events-none absolute -left-4 top-0 hidden h-full w-36 opacity-25 sm:block md:w-44">
          <Image src="/images/historias/rama-hero.png" alt="" fill sizes="176px" className="object-contain object-top" unoptimized />
        </div>
        <div className="relative px-6 py-12 lg:py-16 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Historias que permanecen
          </h1>
          <p className="mt-5 text-carbon/75 max-w-md">
            Objetos que guardan recuerdos. Historias que merecen seguir vivas. Descubre cómo el cuidado y la restauración pueden devolverles su lugar en la vida y en el corazón.
          </p>
          <span className="relative mt-3 h-5 w-10 block">
            <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="40px" className="object-contain" />
          </span>
        </div>
        <div className="relative h-64 w-full lg:h-auto lg:aspect-[1348/850]">
          <Image
            src="/images/historias/hero.png"
            alt="Objetos con historia restaurados por Reviive"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-widest text-dorado-suave">Historias de nuestros clientes</p>
        <h2 className="mt-2 font-display text-2xl md:text-3xl text-borgona">
          Todavía no tenemos historias publicadas
        </h2>
        <p className="mt-3 text-sm text-carbon/70">
          Estamos empezando a reunir las historias reales de las personas que han confiado en Reviive.
          Cuando tengamos evaluaciones y restauraciones completas, las compartiremos aquí — con el
          permiso de cada cliente. Si ya trabajaste con nosotros y quieres contar tu historia,
          escríbenos.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/recuerdos/nuevo" variant="primary" className="inline-flex items-center gap-2">
            <IconUpload className="h-4 w-4" />
            Comienza tu historia
          </Button>
          <Button href="/chat" variant="secondary" className="inline-flex items-center gap-2">
            <IconMessage className="h-4 w-4" />
            Hablar con Alma
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8 text-center">
          <h3 className="font-display text-xl text-borgona">¿Quieres ver lo que podemos crear?</h3>
          <p className="mt-2 text-sm text-carbon/70">
            Explora el catálogo de soluciones reales de restauración, preservación y transformación.
          </p>
          <Button href="/catalogo" variant="primary" className="mt-5">
            Ver catálogo →
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
