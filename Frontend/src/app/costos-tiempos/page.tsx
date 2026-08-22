import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import VolverLink from "@/components/VolverLink";
import { IconMessage, IconInfo, IconChevronDown } from "@/components/icons";

const ICONS = "/images/costos-tiempos";

const factores = [
  { icono: `${ICONS}/icon-tag.png`, titulo: "Tipo de objeto", texto: "No es lo mismo un libro antiguo que una fotografía, una prenda o un mueble." },
  { icono: `${ICONS}/icon-magnifier-thick.png`, titulo: "Estado actual", texto: "El nivel de deterioro, daños estructurales o fragilidad impacta el proceso." },
  { icono: `${ICONS}/icon-paintbrush.png`, titulo: "Nivel de intervención", texto: "Evaluamos si requiere limpieza, estabilización, restauración o transformación." },
  { icono: `${ICONS}/icon-layers.png`, titulo: "Materiales y técnicas", texto: "El uso de materiales especializados y técnicas artesanales influye en el resultado final." },
  { icono: `${ICONS}/icon-heart.png`, titulo: "Personalización", texto: "Detalles personalizados o acabados especiales requieren tiempos y recursos adicionales." },
  { icono: `${ICONS}/icon-clock.png`, titulo: "Urgencia", texto: "Solicitudes con fechas específicas pueden requerir priorización del proceso." },
];

const tiempos = [
  { icono: `${ICONS}/icon-magnifier-thin.png`, badge: false, titulo: "Diagnóstico inicial", rango: "24 – 48 horas", texto: "Revisión, análisis y preparación de la propuesta." },
  { icono: `${ICONS}/icon-leaf-sprig.png`, badge: false, titulo: "Restauración ligera", rango: "1 – 2 semanas", texto: "Limpieza, estabilización o reparaciones menores." },
  { icono: `${ICONS}/icon-paintbrush.png`, badge: false, titulo: "Restauración media", rango: "2 – 4 semanas", texto: "Intervenciones moderadas que requieren más tiempo y detalle." },
  { icono: `${ICONS}/icon-restauracion-compleja.png`, badge: true, titulo: "Restauración compleja", rango: "4 – 8 semanas", texto: "Daños importantes o técnicas especializadas que demandan mayor proceso." },
  { icono: `${ICONS}/icon-transformacion.png`, badge: true, titulo: "Transformación personalizada", rango: "3 – 6 semanas", texto: "Diseños a medida y acabados especiales." },
];

const pasos = [
  { icono: `${ICONS}/icon-envelope.png`, titulo: "Recibimos tu historia", texto: "Cuéntanos sobre tu recuerdo, comparte fotos y lo que esperas lograr." },
  { icono: `${ICONS}/icon-magnifier-thick.png`, titulo: "Evaluamos el objeto", texto: "Analizamos su estado, materiales y posibilidades de restauración o transformación." },
  { icono: `${ICONS}/icon-clipboard.png`, titulo: "Te enviamos recomendación", texto: "Propuesta detallada con alcance, costos, tiempos estimados y recomendaciones." },
  { icono: `${ICONS}/icon-hands-heart.png`, titulo: "Iniciamos el proceso", texto: "Con tu aprobación, comenzamos el trabajo artesanal con todo el cuidado que merece." },
];

const preguntas = [
  "¿La evaluación tiene algún costo?",
  "¿Ofrecen servicio urgente?",
  "¿Por qué los tiempos pueden variar?",
  "¿Qué materiales y técnicas utilizan?",
  "¿Pueden trabajar mi recuerdo si está muy dañado?",
  "¿Cómo obtengo una cotización?",
];

function Icono({ icono, className, size }: { icono: string | React.ComponentType<{ className?: string }>; className?: string; size: number }) {
  if (typeof icono === "string") {
    return (
      <span className={`relative block shrink-0 ${className ?? ""}`} style={{ width: size, height: size }}>
        <Image src={icono} alt="" fill sizes={`${size}px`} className="object-contain" unoptimized />
      </span>
    );
  }
  const Comp = icono;
  return <Comp className={className} />;
}

function BranchTag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-3">
      {children}
      <span className="relative h-9 w-11 shrink-0">
        <Image src={`${ICONS}/icon-leaf-sprig.png`} alt="" fill sizes="44px" className="object-contain" unoptimized />
      </span>
    </span>
  );
}

function SectionDivider() {
  return (
    <span className="relative mx-auto mt-3 block h-9 w-48">
      <Image src={`${ICONS}/divider-crown.png`} alt="" fill sizes="192px" className="object-contain" unoptimized />
    </span>
  );
}

export default function CostosTiemposPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 pt-4 flex items-center gap-4 text-xs text-carbon/50">
        <VolverLink fallbackHref="/preguntas-frecuentes" className="hover:text-borgona transition-colors" />
        <span className="h-3.5 w-px bg-greige/60" />
        <span className="flex items-center">
          <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
          <span className="mx-1.5">›</span>
          <Link href="/preguntas-frecuentes" className="hover:text-borgona transition-colors">Necesito ayuda</Link>
          <span className="mx-1.5">›</span>
          <span className="text-carbon/70">Costos y tiempos</span>
        </span>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="relative h-12 w-14 shrink-0 block">
            <Image src={`${ICONS}/icon-leaf-sprig.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <h1 className="mt-2 font-display text-4xl text-borgona max-w-md">Costos y tiempos</h1>
          <span className="relative mt-3 block h-10 w-64">
            <Image src={`${ICONS}/divider-crown.png`} alt="" fill sizes="256px" className="object-contain object-left" unoptimized />
          </span>
          <p className="mt-3 text-sm text-carbon/70 max-w-md">
            Cada recuerdo es único e irrepetible. Por eso, el costo y el tiempo de restauración dependen de su
            estado, la técnica necesaria, la complejidad del trabajo y el propósito que deseas lograr.
          </p>
          <p className="mt-3 text-sm text-carbon/70 max-w-md">
            Nuestro compromiso es ofrecerte una evaluación honesta, transparente y personalizada para que tomes
            la mejor decisión sobre lo que más valoras.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image src="/images/costos-tiempos/hero.png" alt="" fill sizes="500px" className="object-cover" unoptimized priority />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-borgona">
          <BranchTag>¿Qué influye en el costo?</BranchTag>
        </h2>
        <SectionDivider />
        <p className="mt-2 text-sm text-carbon/60">
          Estos son los principales factores que consideramos al preparar tu propuesta personalizada.
        </p>
        <div className="relative mt-10">
          <div className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 hidden h-64 w-52 opacity-40 xl:block">
            <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="208px" className="object-contain" unoptimized />
          </div>
          <div className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 hidden h-64 w-52 opacity-40 xl:block -scale-x-100">
            <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="208px" className="object-contain" unoptimized />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {factores.map((f) => (
              <div key={f.titulo} className="rounded-2xl border border-greige/50 bg-greige/20 p-5 text-center">
                <Icono icono={f.icono} className="mx-auto text-borgona" size={44} />
                <h3 className="mt-3 font-display text-sm text-borgona">{f.titulo}</h3>
                <p className="mt-1.5 text-xs text-carbon/60">{f.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-medium text-borgona">
            <BranchTag>Tiempos estimados</BranchTag>
          </h2>
          <SectionDivider />
          <p className="mt-2 text-sm text-carbon/60">
            Estos tiempos son aproximados y pueden variar según las características de cada objeto.
          </p>
          <div className="relative mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
            <div className="hidden lg:block absolute left-[8%] right-[8%] top-9 border-t-2 border-dotted border-dorado-suave/50" />
            {tiempos.map((t) => (
              <div key={t.titulo} className="relative">
                {t.badge ? (
                  <span className="relative z-10 block h-[4.5rem] w-[4.5rem] mx-auto">
                    <Image src={t.icono} alt="" fill sizes="72px" className="object-contain" unoptimized />
                  </span>
                ) : (
                  <div className="relative z-10 h-[4.5rem] w-[4.5rem] mx-auto rounded-full bg-rosa flex items-center justify-center shadow-sm">
                    <Icono icono={t.icono} className="text-dorado-suave" size={34} />
                  </div>
                )}
                <h3 className="mt-3 font-display text-sm text-borgona">{t.titulo}</h3>
                <p className="mt-1 font-display text-base text-borgona-dark">{t.rango}</p>
                <p className="mt-1 text-xs text-carbon/60">{t.texto}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 inline-flex items-center gap-2 text-xs text-carbon/60">
            <IconInfo className="h-4 w-4 text-dorado-suave" />
            Te mantendremos informado en cada etapa del proceso.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-borgona">
          <BranchTag>¿Cómo definimos tu propuesta?</BranchTag>
        </h2>
        <SectionDivider />
        <p className="mt-2 text-sm text-carbon/60">
          Un proceso claro y cercano para entender tu recuerdo y ofrecerte la mejor solución.
        </p>
        <div className="relative mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-10">
          {pasos.map((p, i) => (
            <div key={p.titulo} className="relative">
              {i < pasos.length - 1 && (
                <span className="hidden sm:flex absolute top-2.5 -right-4 items-center justify-center text-dorado-suave/60">
                  ›
                </span>
              )}
              <span className="flex h-6 w-6 mx-auto items-center justify-center rounded-full bg-borgona text-[11px] text-marfil">
                {i + 1}
              </span>
              <Icono icono={p.icono} className="mt-3 mx-auto text-borgona" size={60} />
              <h3 className="mt-2 font-display text-sm text-borgona">{p.titulo}</h3>
              <p className="mt-1 text-xs text-carbon/60">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden mx-auto max-w-4xl px-6 pb-16">
        <div className="pointer-events-none absolute -left-16 bottom-0 hidden h-72 w-52 opacity-15 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="208px" className="object-contain object-left-bottom -scale-y-100" unoptimized />
        </div>
        <h2 className="relative text-center font-display text-2xl md:text-3xl font-medium text-borgona">
          Preguntas frecuentes
        </h2>
        <p className="mt-2 text-center text-sm text-carbon/60">
          Resolvemos las dudas más comunes sobre costos y tiempos.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-x-8">
          {preguntas.map((p) => (
            <details key={p} className="group border-b border-greige/60 py-3">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm text-carbon/80">
                {p}
                <IconChevronDown className="h-4 w-4 shrink-0 text-dorado-suave transition-transform duration-200 group-open:rotate-180" />
              </summary>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <span className="relative h-14 w-14 shrink-0">
              <Image src={`${ICONS}/icon-leaf-circle.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
            </span>
            <div>
              <h3 className="font-display text-xl text-borgona leading-tight">Tu recuerdo merece el mejor cuidado</h3>
              <p className="mt-1 text-sm text-carbon/60">Estamos aquí para ayudarte a conservar lo que más importa.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Button href="/recuerdos/nuevo" variant="primary" className="inline-flex items-center gap-2">
              Solicitar evaluación →
            </Button>
            <Button href="/chat" variant="secondary" className="inline-flex items-center gap-2">
              Hablar con Alma
              <IconMessage className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
