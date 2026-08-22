import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import { IconMessage, IconCheckCircle } from "@/components/icons";

const timeline = [
  {
    icono: "conversacion",
    titulo: "Una conversación",
    texto: "Natalia le contó a Brayan la historia de Beto y su preocupación por conservarlo.",
  },
  {
    icono: "historia-beto",
    titulo: "La historia de Beto",
    texto: "Ese último regalo de Navidad de su papá se había convertido en su tesoro.",
  },
  {
    icono: "necesidad",
    titulo: "Una necesidad real",
    texto: "¿Cómo conservar aquello que representa a alguien que amamos a través del tiempo?",
  },
  {
    icono: "idea-clase",
    titulo: "Una idea en clase",
    texto: "En una clase, el ejercicio era imaginar una empresa y crear su identidad.",
  },
  {
    icono: "julio-2026",
    titulo: "Julio 2026",
    texto: "En julio de 2026 nació Reviive, con el propósito de hacer esta idea realidad.",
  },
  {
    icono: "nace-reviive",
    titulo: "Nace Reviive",
    texto: "Hoy estamos construyendo el lugar donde los recuerdos pueden seguir viviendo.",
  },
];

const betoRow = [
  { icono: "peluche", titulo: "Peluche" },
  { icono: "fotografias", titulo: "Fotografías" },
  { icono: "relojes", titulo: "Relojes" },
  { icono: "prendas", titulo: "Prendas" },
  { icono: "cartas", titulo: "Cartas" },
  { icono: "muebles", titulo: "Muebles" },
];

const desafiosClientes = [
  "No saben a quién confiar un objeto tan importante.",
  "Les cuesta encontrar talleres especializados.",
  "No siempre reciben un trato que entiende el valor emocional del objeto.",
  "Necesitan tranquilidad, seguimiento y confianza.",
];

const desafiosTalleres = [
  "Tienen talento y experiencia, pero poca visibilidad.",
  "Los clientes no siempre llegan directamente.",
  "Les cuesta mostrar su trabajo y recibir oportunidades.",
  "Necesitan una plataforma que los conecte con quienes valoran su oficio.",
];

const esencia = [
  {
    icono: "mision",
    titulo: "Misión",
    texto: "Rescatar objetos del olvido para devolverles a nuestros clientes esos instantes de felicidad que creían perdidos en el tiempo, mediante técnicas de restauración con alma y precisión técnica.",
  },
  {
    icono: "vision",
    titulo: "Visión",
    texto: "Convertirnos en el “hospital de los recuerdos” referente en Antioquia, donde cada objeto encuentre no solo un taller, sino un puente que lo conecta con sus historias familiares.",
  },
  {
    icono: "proposito",
    titulo: "Propósito",
    texto: "Hacer posible que los recuerdos físicos puedan continuar acompañando a las personas a través del tiempo.",
  },
  {
    icono: "promesa",
    titulo: "Nuestra promesa",
    texto: "No tratamos objetos como objetos. Los tratamos como historias que alguien decidió confiarnos.",
  },
];

const valores = [
  { icono: "empatia", titulo: "Empatía", texto: "Entender primero qué representa el objeto." },
  { icono: "cuidado", titulo: "Cuidado", texto: "Cada pieza se trata como algo irremplazable." },
  { icono: "confianza", titulo: "Confianza", texto: "Trazabilidad y transparencia en todo el proceso." },
  { icono: "excelencia", titulo: "Excelencia artesanal", texto: "Encontrar las manos y técnicas adecuadas para cada recuerdo." },
  { icono: "respeto", titulo: "Respeto por la historia", texto: "Intervenir sin borrar aquello que hace única cada pieza." },
];

const proceso = [
  { icono: "01", titulo: "Escuchamos tu historia", texto: "Nos cuentas qué objeto tienes y qué representa para ti." },
  { icono: "02", titulo: "Evaluamos tu objeto", texto: "Analizamos su estado y las posibilidades de restauración." },
  { icono: "03", titulo: "Encontramos al especialista", texto: "Conectamos tu objeto con el taller o artesano ideal para su historia." },
  { icono: "04", titulo: "Restauramos con cuidado", texto: "Cada intervención se hace con técnica y respeto por su esencia." },
  { icono: "05", titulo: "Documentamos el proceso", texto: "Registramos cada paso para que tengas total trazabilidad." },
  { icono: "06", titulo: "Devolvemos tu recuerdo", texto: "Tu objeto regresa a casa, restaurado y listo para seguir acompañándote." },
];

const fundadores = [
  {
    nombre: "Natalia Quintero",
    rol: "Cofundadora",
    iniciales: "NQ",
    texto: "Una historia personal y la necesidad de conservar a Beto fueron el punto de partida de Reviive.",
  },
  {
    nombre: "Brayan Giraldo",
    rol: "Cofundador",
    iniciales: "BG",
    texto: "De aquella conversación surgió la idea de transformar una necesidad emocional en una solución capaz de ayudar a muchas más personas.",
  },
];

function BranchTag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {children}
      <span className="relative h-6 w-10 shrink-0">
        <Image src="/images/sobre-reviive/rama-pequena.png" alt="" fill sizes="40px" className="object-contain" unoptimized />
      </span>
    </span>
  );
}

export default function SobreReviivePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 pt-4 text-xs text-carbon/50">
        <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-carbon/70">Sobre Reviive</span>
      </div>

      <section className="relative overflow-hidden grid lg:grid-cols-2 lg:items-center">
        <div className="pointer-events-none absolute -left-4 top-0 hidden h-full w-36 opacity-25 sm:block md:w-44">
          <Image src="/images/sobre-reviive/rama-hero.png" alt="" fill sizes="176px" className="object-contain object-top" unoptimized />
        </div>
        <div className="relative px-6 py-12 lg:py-16 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Sobre Reviive
          </h1>
          <p className="mt-3 font-display text-xl text-carbon max-w-md">
            <BranchTag>Hay recuerdos que merecen quedarse toda la vida.</BranchTag>
          </p>
          <p className="mt-5 text-sm text-carbon/70 max-w-md">
            Reviive nació de una conversación, un recuerdo y una pregunta muy sencilla: ¿cómo conservar aquello que representa a alguien que amamos, incluso cuando pasan los años?
          </p>
        </div>
        <div className="relative h-64 w-full lg:h-auto lg:aspect-[1672/941]">
          <Image
            src="/images/sobre-reviive/hero.png"
            alt="Beto, el peluche que inspiró a Reviive"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image src="/images/sobre-reviive/recuerdo-cuadro.png" alt="Beto" fill sizes="500px" className="object-cover" unoptimized />
        </div>
        <div>
          <h2 className="font-display text-2xl text-borgona">
            <BranchTag>El recuerdo que lo inició todo</BranchTag>
          </h2>
          <p className="mt-3 text-sm text-carbon/70">
            Beto fue un regalo de Navidad de Humberto, el padre de Natalia. Con los años dejó de ser simplemente un peluche: se convirtió en un recuerdo físico de una persona fundamental en su vida.
          </p>
          <p className="mt-3 text-sm text-carbon/70">
            El paso del tiempo trajo también una preocupación: ¿qué pasaría si algún día Beto se deterioraba tanto que ya no pudiera conservarse?
          </p>
          <p className="mt-4 font-display text-lg text-borgona italic">
            &ldquo;¿Cómo hago para que este recuerdo pueda seguir conmigo a pesar del paso de los años?&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8">
          <h2 className="text-center font-display text-2xl text-borgona">
            <BranchTag>De una conversación nació una idea</BranchTag>
          </h2>
          <div className="relative mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
            <div className="hidden lg:block absolute left-[8%] right-[8%] top-12 -z-0 border-t-2 border-dotted border-dorado-suave/50" />
            {timeline.map((t) => (
              <div key={t.titulo} className="relative text-center">
                <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden">
                  <Image src={`/images/sobre-reviive/timeline-${t.icono}.png`} alt="" fill sizes="96px" className="object-cover" unoptimized />
                </div>
                <h3 className="mt-2 font-display text-sm text-borgona">{t.titulo}</h3>
                <p className="mt-1.5 text-xs text-carbon/60">{t.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-display text-2xl text-borgona">
          <BranchTag>De Beto a miles de recuerdos</BranchTag>
        </h2>
        <p className="mt-3 text-sm text-carbon/70 max-w-2xl">
          Descubrimos que detrás de cada objeto hay una persona, un momento y una historia que alguien quiere seguir conservando.
        </p>
        <p className="mt-2 text-sm text-carbon/70 max-w-2xl">
          Así entendimos que nuestra misión no era solo restaurar objetos, sino preservar lo que representan.
        </p>
        <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-4">
          {betoRow.map((b) => (
            <div key={b.titulo} className="text-center">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={`/images/sobre-reviive/beto-${b.icono}.png`} alt="" fill sizes="160px" className="object-cover" unoptimized />
              </div>
              <p className="mt-2 text-xs text-carbon/70">{b.titulo}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-carbon/70">
          Objetos diferentes. <span className="font-medium text-borgona">Una misma necesidad:</span>{" "}
          <span className="font-medium text-dorado-suave">que la historia permanezca.</span>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 grid md:grid-cols-[1fr_320px_1fr] gap-6 items-stretch">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0">
              <Image src="/images/sobre-reviive/icon-clientes.png" alt="" fill sizes="56px" className="object-contain" unoptimized />
            </span>
            <h3 className="font-display text-base text-borgona">El desafío de nuestros clientes</h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {desafiosClientes.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-carbon/70">
                <IconCheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-borgona" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-borgona p-8 flex flex-col items-center justify-center text-center">
          <div className="pointer-events-none absolute -left-6 -bottom-8 h-40 w-32 opacity-40">
            <Image src="/images/sobre-reviive/card-rama-1.png" alt="" fill sizes="128px" className="object-contain object-left-bottom" unoptimized />
          </div>
          <div className="pointer-events-none absolute -right-6 -top-8 h-40 w-32 opacity-40 rotate-180">
            <Image src="/images/sobre-reviive/card-rama-2.png" alt="" fill sizes="128px" className="object-contain object-left-bottom" unoptimized />
          </div>
          <div className="relative h-16 w-16">
            <Image src="/images/sobre-reviive/icon-hourglass-card.png" alt="" fill sizes="64px" className="object-contain" unoptimized />
          </div>
          <h3 className="relative mt-3 font-display text-2xl text-marfil">Reviive</h3>
          <p className="relative mt-2 text-sm text-marfil/80">
            El punto donde una historia encuentra las manos capaces de preservarla.
          </p>
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0">
              <Image src="/images/sobre-reviive/icon-talleres.png" alt="" fill sizes="56px" className="object-contain" unoptimized />
            </span>
            <h3 className="font-display text-base text-borgona">El desafío de los talleres y artesanos</h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {desafiosTalleres.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-carbon/70">
                <IconCheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-borgona" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8">
          <h2 className="text-center font-display text-2xl text-borgona">Nuestra esencia</h2>
          <div className="mt-6 grid grid-cols-2 gap-6">
            {esencia.map((e) => (
              <div key={e.titulo} className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-rosa/40 flex items-center justify-center overflow-hidden">
                  <div className="relative h-10 w-10">
                    <Image src={`/images/sobre-reviive/esencia-${e.icono}.png`} alt="" fill sizes="40px" className="object-contain" unoptimized />
                  </div>
                </div>
                <h3 className="mt-2 font-display text-sm text-borgona">{e.titulo}</h3>
                <p className="mt-1.5 text-xs text-carbon/60">{e.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8">
          <h2 className="text-center font-display text-2xl text-borgona">Nuestros valores</h2>
          <ul className="mt-6 space-y-4">
            {valores.map((v) => (
              <li key={v.titulo} className="flex items-start gap-3">
                <span className="relative h-14 w-14 shrink-0">
                  <Image src={`/images/sobre-reviive/valor-${v.icono}.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
                </span>
                <div>
                  <p className="font-display text-sm text-borgona">{v.titulo}</p>
                  <p className="text-xs text-carbon/60">{v.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 grid md:grid-cols-2 gap-6 items-stretch">
        <div>
          <h2 className="font-display text-xl text-borgona">Detrás de Reviive</h2>
          <div className="mt-5 grid grid-cols-2 gap-5">
            {fundadores.map((f) => (
              <div key={f.nombre}>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-rosa/50 ring-2 ring-white flex items-center justify-center shrink-0">
                    <span className="font-display text-base text-borgona">{f.iniciales}</span>
                  </div>
                  <div>
                    <p className="font-display text-sm text-borgona">{f.nombre}</p>
                    <p className="text-xs text-carbon/50">{f.rol}</p>
                  </div>
                </div>
                <p className="mt-2.5 text-xs text-carbon/70">{f.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-borgona p-6 flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden ring-2 ring-marfil/60">
            <Image src="/images/sobre-reviive/alma-bienvenida.png" alt="Alma" fill sizes="96px" className="object-cover" unoptimized />
          </div>
          <div>
            <h3 className="font-display text-lg text-marfil">Alma, tu asistente de confianza</h3>
            <p className="mt-1 text-xs text-marfil/80">
              Cada recuerdo empieza con una historia. Cuéntame la tuya.
            </p>
            <p className="mt-1.5 text-xs text-marfil/70">
              Estoy aquí para escuchar qué objeto tienes, qué significa para ti y ayudarte a descubrir cómo podemos conservarlo, restaurarlo o transformarlo.
            </p>
            <Button href="/chat" variant="secondary" className="mt-3 !text-marfil !border-marfil hover:!bg-marfil/10 inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Hablar con Alma
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl bg-greige/20 border border-greige/50 p-8">
          <h2 className="text-center font-display text-2xl text-borgona">
            <BranchTag>Del recuerdo a las manos correctas</BranchTag>
          </h2>
          <div className="relative mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
            <div className="hidden lg:block absolute left-[8%] right-[8%] top-12 -z-0 border-t-2 border-dotted border-dorado-suave/50" />
            {proceso.map((p) => (
              <div key={p.titulo} className="relative text-center">
                <div className="relative h-24 w-24 mx-auto">
                  <Image src={`/images/sobre-reviive/proceso-${p.icono}.png`} alt="" fill sizes="96px" className="object-contain" unoptimized />
                </div>
                <h3 className="mt-2 font-display text-sm text-borgona">{p.titulo}</h3>
                <p className="mt-1.5 text-xs text-carbon/60">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-borgona py-9">
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-24 opacity-40 md:h-40 md:w-28">
          <Image src="/images/sobre-reviive/cta-rama-1.png" alt="" fill sizes="112px" className="object-contain object-left-bottom" unoptimized />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-24 opacity-40 md:h-40 md:w-28">
          <Image src="/images/sobre-reviive/cta-rama-2.png" alt="" fill sizes="112px" className="object-contain object-right-bottom" unoptimized />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-display text-lg text-marfil">
              Beto nos enseñó que conservar un objeto también puede ser una forma de conservar a alguien.
            </p>
            <p className="mt-1.5 text-sm text-marfil/70">
              Reviive existe para que otras personas puedan seguir teniendo cerca esos recuerdos que el tiempo no debería llevarse.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 shrink-0">
            <Button href="/recuerdos/nuevo" variant="secondary" className="!text-borgona !bg-marfil !border-marfil hover:!bg-marfil/90">
              Cuéntanos tu historia
            </Button>
            <Button href="/chat" variant="ghost" className="!text-marfil inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Hablar con Alma
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
