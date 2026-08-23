import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import VolverLink from "@/components/VolverLink";
import { IconMessage, IconInfo, IconChevronDown, IconCorreo, IconTruck, IconCamera, IconManosCorazon } from "@/components/icons";

const ICONS = "/images/envios-entregas";

const factores = [
  { icono: `${ICONS}/icon-globe.png`, titulo: "Cobertura", texto: "Realizamos envíos a todo el país. Consulta la disponibilidad de recolección en tu zona." },
  { icono: `${ICONS}/icon-box.png`, titulo: "Empaque seguro", texto: "Usa materiales resistentes y amortiguación suficiente. Protege piezas frágiles, bordes y superficies." },
  { icono: `${ICONS}/icon-truck.png`, titulo: "Recolección o envío", texto: "Puedes enviarlo por la transportadora de tu preferencia o solicitar recolección con nosotros." },
  { icono: `${ICONS}/icon-route-pins.png`, titulo: "Seguimiento", texto: "Te brindamos guía y código para que puedas rastrear tu envío en cada etapa." },
  { icono: `${ICONS}/icon-clock.png`, titulo: "Tiempos de tránsito", texto: "Pueden variar según la ciudad de origen y el servicio seleccionado (express o estándar)." },
  { icono: `${ICONS}/icon-shield-check.png`, titulo: "Entrega protegida", texto: "Devolvemos tu objeto con el mismo cuidado, empaque especializado y seguro incluido." },
];

const tiempos = [
  { icono: `${ICONS}/icon-badge-preparacion.png`, titulo: "Preparación del envío", rango: "24 a 48 horas", texto: "Revisamos tu caso y preparamos el empaque adecuado." },
  { icono: `${ICONS}/icon-badge-recoleccion.png`, titulo: "Recolección o despacho", rango: "1 a 3 días", texto: "Recogemos o recibimos tu objeto para iniciar su traslado." },
  { icono: `${ICONS}/icon-badge-recepcion.png`, titulo: "Recepción en taller", rango: "1 a 2 días", texto: "Verificamos el estado del objeto y confirmamos su ingreso al proceso." },
  { icono: `${ICONS}/icon-badge-intervencion.png`, titulo: "Proceso de intervención", rango: "según evaluación", texto: "El tiempo depende del tipo de intervención, materiales y detalles requeridos." },
  { icono: `${ICONS}/icon-badge-entregafinal.png`, titulo: "Entrega final", rango: "2 a 5 días", texto: "Enviamos tu objeto de vuelta a tu dirección con seguro y trazabilidad." },
];

const pasos = [
  { icono: IconCorreo, titulo: "Nos cuentas tu caso", texto: "Completa el formulario o escríbenos. Te orientamos sobre el mejor envío para tu objeto." },
  { icono: IconTruck, titulo: "Coordinamos el envío", texto: "Definimos si es recolección o envío por transportadora y te compartimos las instrucciones." },
  { icono: IconCamera, titulo: "Protegemos y documentamos", texto: "Al recibirlo, lo registramos con fotografías y lo resguardamos en condiciones óptimas." },
  { icono: IconManosCorazon, titulo: "Recibes seguimiento y entrega", texto: "Te informamos cada avance y te devolvemos tu recuerdo listo para seguir contando su historia." },
];

const preguntas = [
  { p: "¿Hacen envíos a toda Colombia?", r: "Sí, realizamos envíos a todo el país. Consulta con nuestro equipo la disponibilidad de recolección en tu zona." },
  { p: "¿Qué pasa si mi objeto es muy delicado?", r: "Usamos empaques especializados y amortiguación adicional para piezas frágiles, bordes y superficies sensibles." },
  { p: "¿Cómo debo empacar mi objeto?", r: "Te damos indicaciones específicas según el tipo de objeto; si prefieres, podemos coordinar la recolección para evitarte ese paso." },
  { p: "¿Cuánto tarda la entrega?", r: "La entrega final toma entre 2 y 5 días una vez finalizado el proceso, con seguro y trazabilidad incluidos." },
  { p: "¿Puedo solicitar recolección?", r: "Sí, puedes solicitar que recojamos tu objeto directamente en lugar de enviarlo por tu cuenta." },
  { p: "¿Cómo hago seguimiento?", r: "Desde tu cuenta, en la sección \"Envíos\", puedes consultar el estado de cada traslado en tiempo real." },
];

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
    <span className="relative mx-auto mt-3 block h-8 w-48">
      <Image src={`${ICONS}/divider-line.png`} alt="" fill sizes="192px" className="object-contain" unoptimized />
    </span>
  );
}

export default function EnviosEntregasPage() {
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
          <span className="text-carbon/70">Envíos y entregas</span>
        </span>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="relative h-12 w-14 shrink-0 block">
            <Image src={`${ICONS}/icon-leaf-sprig.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
          </span>
          <h1 className="mt-2 font-display text-4xl text-borgona max-w-md">Envíos y entregas</h1>
          <span className="relative mt-3 block h-8 w-64">
            <Image src={`${ICONS}/divider-line.png`} alt="" fill sizes="256px" className="object-contain object-left" unoptimized />
          </span>
          <p className="mt-3 text-sm text-carbon/70 max-w-md">
            En Reviive entendemos que cada recuerdo es único e irrepetible. Por eso te acompañamos en el envío de
            tus objetos con el mayor cuidado, trazabilidad y empaques diseñados para proteger lo que más valoras.
          </p>
          <p className="mt-3 text-sm text-carbon/70 max-w-md">
            Nuestro compromiso es que tu historia llegue segura a nuestras manos y regrese a ti restaurada y
            preservada para las próximas generaciones.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image src={`${ICONS}/hero.png`} alt="" fill sizes="500px" className="object-cover" unoptimized priority />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-borgona">
          <BranchTag>¿Qué debes tener en cuenta?</BranchTag>
        </h2>
        <SectionDivider />
        <p className="mt-2 text-sm text-carbon/60">
          Estos aspectos nos ayudan a garantizar un envío seguro y una experiencia tranquila.
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
                <span className="relative h-11 w-11 mx-auto block">
                  <Image src={f.icono} alt="" fill sizes="44px" className="object-contain" unoptimized />
                </span>
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
            Estos tiempos son aproximados y pueden variar según el origen, la temporada y el servicio elegido.
          </p>
          <div className="relative mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
            <div className="hidden lg:block absolute left-[8%] right-[8%] top-9 border-t-2 border-dotted border-dorado-suave/50" />
            {tiempos.map((t) => (
              <div key={t.titulo} className="relative">
                <span className="relative z-10 block h-[4.5rem] w-[4.5rem] mx-auto">
                  <Image src={t.icono} alt="" fill sizes="72px" className="object-contain" unoptimized />
                </span>
                <h3 className="mt-3 font-display text-sm text-borgona">{t.titulo}</h3>
                <p className="mt-1 font-display text-base text-borgona-dark">{t.rango}</p>
                <p className="mt-1 text-xs text-carbon/60">{t.texto}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 inline-flex items-center gap-2 text-xs text-carbon/60">
            <IconInfo className="h-4 w-4 text-dorado-suave" />
            Te mantendremos informado en cada etapa del recorrido.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-borgona">
          <BranchTag>¿Cómo funciona el proceso?</BranchTag>
        </h2>
        <SectionDivider />
        <p className="mt-2 text-sm text-carbon/60">
          Un proceso claro y cercano para que te sientas acompañado en todo momento.
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
              <p.icono className="mt-3 h-14 w-14 mx-auto text-borgona" />
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
        <div className="pointer-events-none absolute -right-16 bottom-0 hidden h-72 w-52 opacity-15 lg:block -scale-x-100">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="208px" className="object-contain object-left-bottom -scale-y-100" unoptimized />
        </div>
        <h2 className="relative text-center font-display text-2xl md:text-3xl font-medium text-borgona">
          Preguntas frecuentes
        </h2>
        <p className="mt-2 text-center text-sm text-carbon/60">
          Resolvemos las dudas más comunes sobre nuestros envíos y entregas.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-x-8">
          {preguntas.map((item) => (
            <details key={item.p} className="group border-b border-greige/60 py-3">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm text-carbon/80">
                {item.p}
                <IconChevronDown className="h-4 w-4 shrink-0 text-dorado-suave transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-carbon/60">{item.r}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <span className="relative h-14 w-14 shrink-0">
              <Image src="/images/costos-tiempos/icon-leaf-gold-coin.png" alt="" fill sizes="56px" className="object-contain" unoptimized />
            </span>
            <div>
              <h3 className="font-display text-xl text-borgona leading-tight">Tu recuerdo merece llegar seguro</h3>
              <p className="mt-1 text-sm text-carbon/60">Déjalo en nuestras manos y lo cuidaremos como lo que más importa.</p>
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
