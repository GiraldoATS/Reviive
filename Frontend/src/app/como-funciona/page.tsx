import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";

const pasos = [
  {
    icono: "/images/como-funciona/icon-comparte.png",
    titulo: "Comparte tu historia",
    texto: "Cuéntanos sobre el objeto y su historia. Puedes adjuntar fotos y detalles que consideres importantes.",
  },
  {
    icono: "/images/como-funciona/icon-evaluamos.png",
    titulo: "Evaluamos tu pieza",
    texto: "Nuestros especialistas revisan la información y determinan el estado, alcance y alternativas de intervención.",
  },
  {
    icono: "/images/como-funciona/icon-propuesta.png",
    titulo: "Propuesta y aprobación",
    texto: "Recibes una propuesta clara con el plan de trabajo, tiempos y costos. Tú decides cómo quieres cuidar tu pieza.",
  },
  {
    icono: "/images/como-funciona/icon-restauramos.png",
    titulo: "Restauramos o transformamos",
    texto: "Trabajamos con técnicas artesanales y materiales de alta calidad para devolverle vida y significado.",
  },
  {
    icono: "/images/como-funciona/icon-entrega.png",
    titulo: "Entrega cuidadosa",
    texto: "Tu pieza viaja protegida hasta tus manos, con un empaque seguro y un informe del proceso.",
  },
  {
    icono: "/images/como-funciona/icon-propuesta.png",
    titulo: "Sigue contando tu historia",
    texto: "Tu memoria vuelve a ser parte de tu día a día y de las historias que están por venir.",
  },
];

const compromisos = [
  {
    icono: "/images/como-funciona/icon-evaluamos.png",
    foto: "/images/como-funciona/card-evaluacion.png",
    titulo: "Evaluación experta",
    texto: "Analizamos el estado de tu pieza con sensibilidad y conocimiento. Te orientamos sobre la mejor opción para su cuidado.",
  },
  {
    icono: "/images/como-funciona/icon-restauramos.png",
    foto: "/images/como-funciona/card-restauracion.png",
    titulo: "Restauración artesanal",
    texto: "Con técnicas tradicionales, respetamos la esencia original de cada objeto, devolviéndole su belleza y función.",
  },
  {
    icono: "/images/como-funciona/icon-destello.png",
    foto: "/images/como-funciona/card-transformacion.png",
    titulo: "Transformación significativa",
    texto: "Cuando la restauración no es posible, transformamos tu pieza para darle una nueva vida con propósito.",
  },
  {
    icono: "/images/como-funciona/icon-entrega.png",
    foto: "/images/como-funciona/card-entrega.png",
    titulo: "Entrega segura",
    texto: "Empaques personalizados y envíos seguros para que tu pieza llegue a ti en perfectas condiciones.",
  },
  {
    icono: "/images/como-funciona/icon-propuesta.png",
    foto: "/images/como-funciona/card-cadena.png",
    titulo: "Cadena de cuidado",
    texto: "Documentamos el proceso y te acompañamos para que la memoria de tu pieza perdure en el tiempo.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <SiteShell>
      <section className="grid lg:grid-cols-2 items-stretch">
        <div className="relative px-6 py-16 lg:py-24 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))] overflow-hidden">
          <div className="hidden lg:block absolute left-2 top-1/2 -translate-y-1/2 h-[420px] w-32">
            <Image src="/images/branch-left-v2.png" alt="" fill sizes="128px" className="object-contain object-top" />
          </div>
          <h1 className="relative font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Cómo funciona
            <br />
            <span className="inline-flex items-center gap-2">
              Reviive
              <span className="relative h-7 w-14 shrink-0">
                <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="56px" className="object-contain" />
              </span>
            </span>
          </h1>
          <p className="relative mt-5 text-carbon/75 max-w-md">
            Un proceso cuidadoso, humano y artesanal para preservar lo que te conecta con tu historia.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-4">
            <Button href="/recuerdos/nuevo" variant="primary">
              Solicitar evaluación →
            </Button>
            <Button href="#proceso" variant="secondary">
              Conocer el proceso
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-auto">
          <Image
            src="/images/landing-hero.png"
            alt="Objetos restaurados por Reviive"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section id="proceso" className="mx-auto max-w-6xl px-6 py-20 text-center scroll-mt-20">
        <p className="text-xs uppercase tracking-widest text-dorado-suave">Tu memoria, en buenas manos</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-medium text-borgona-dark">
          Así es el proceso de Reviive
        </h2>

        <div className="relative z-0 mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
          <div className="hidden lg:block absolute left-[8%] right-[8%] top-8 -z-10 border-t-2 border-dotted border-dorado-suave/50" />
          {pasos.map((p, i) => (
            <div key={p.titulo}>
              <div className="relative h-16 w-16 mx-auto">
                <Image src={p.icono} alt="" fill sizes="64px" className="object-contain" />
              </div>
              <span className="mt-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-borgona text-[10px] text-marfil">
                {i + 1}
              </span>
              <h3 className="mt-2 font-display text-sm text-borgona">{p.titulo}</h3>
              <p className="mt-1.5 text-xs text-carbon/60">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-greige/20 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-dorado-suave">Cómo cuidamos cada memoria</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-medium text-borgona-dark">
            Nuestro compromiso en cada etapa
          </h2>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {compromisos.map((c) => (
              <div key={c.titulo} className="rounded-2xl border border-greige/60 bg-white/70 overflow-hidden flex flex-col text-left">
                <div className="p-6 pb-4 text-center">
                  <div className="relative h-14 w-14 mx-auto">
                    <Image src={c.icono} alt="" fill sizes="56px" className="object-contain" />
                  </div>
                  <h3 className="mt-3 font-display text-base text-borgona">{c.titulo}</h3>
                  <p className="mt-1.5 text-xs text-carbon/60">{c.texto}</p>
                </div>
                <div className="relative h-24 w-full mt-auto">
                  <Image src={c.foto} alt="" fill sizes="220px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rosa/25 py-14 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 xl:pr-40 grid lg:grid-cols-[1fr_1fr_auto] gap-8 items-center relative">
          <div className="flex items-start gap-3">
            <span className="relative h-8 w-8 shrink-0 mt-1">
              <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="32px" className="object-contain" />
            </span>
            <p className="font-display text-xl text-borgona leading-snug">
              El primer paso es compartir la historia que hay detrás.
            </p>
          </div>
          <p className="text-sm text-carbon/70">
            Solicita una evaluación sin compromiso y descubre cómo podemos cuidar lo que más valoras.
          </p>
          <Button href="/recuerdos/nuevo" variant="primary" className="justify-self-start lg:justify-self-end">
            Solicitar evaluación →
          </Button>
        </div>
        <div className="hidden xl:block absolute right-4 top-1/2 -translate-y-1/2 h-24 w-32 opacity-70 pointer-events-none">
          <Image src="/images/footer-hourglass.png" alt="" fill sizes="128px" className="object-contain" />
        </div>
      </section>
    </SiteShell>
  );
}
