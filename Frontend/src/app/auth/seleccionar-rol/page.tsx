import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import { IconCheck } from "@/components/icons";

const ICONS = "/images/auth/seleccionar-rol";

const roles = [
  {
    numero: "01",
    ilustracion: `${ICONS}/ilustracion-cliente.png`,
    titulo: "Cliente",
    subtitulo: "Quiero conservar un recuerdo",
    texto:
      "Encuentra alternativas para restaurar, preservar o transformar aquellos objetos que tienen un significado especial para ti.",
    items: [
      "Solicitar evaluaciones",
      "Compartir fotografías e historias",
      "Consultar recomendaciones",
      "Hacer seguimiento a tus procesos",
      "Hablar con Alma, tu asistente Reviive",
    ],
    href: "/auth/registro/cliente",
    label: "Crear cuenta como cliente",
  },
  {
    numero: "02",
    ilustracion: `${ICONS}/ilustracion-artesano.png`,
    titulo: "Taller o artesano",
    subtitulo: "Quiero ofrecer mi experiencia",
    texto:
      "Forma parte de la red de talleres y artesanos de Reviive y conecta tu oficio con personas que buscan manos capaces de cuidar sus recuerdos.",
    items: [
      "Crear tu perfil profesional",
      "Registrar especialidades",
      "Mostrar trabajos realizados",
      "Recibir oportunidades",
      "Gestionar procesos asignados",
    ],
    href: "/auth/registro/proveedor",
    label: "Registrarme como taller o artesano",
  },
];

function HourglassOval({ size }: { size: number }) {
  return (
    <span className="relative block shrink-0" style={{ width: size * 0.71, height: size }}>
      <Image src={`${ICONS}/icon-hourglass-oval.png`} alt="" fill sizes={`${size}px`} className="object-contain" unoptimized />
    </span>
  );
}

export default function SeleccionarRolPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-10 top-8 hidden h-72 w-56 opacity-30 lg:block">
          <Image src={`${ICONS}/flor-rosa.png`} alt="" fill sizes="224px" className="object-contain object-left-top" unoptimized />
        </div>
        <div className="pointer-events-none absolute -right-10 top-8 hidden h-72 w-56 opacity-30 lg:block -scale-x-100">
          <Image src={`${ICONS}/flor-dorada.png`} alt="" fill sizes="224px" className="object-contain object-left-top" unoptimized />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-14 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-dorado-suave/50" />
            <HourglassOval size={56} />
            <span className="h-px w-16 bg-dorado-suave/50" />
          </div>

          <h1 className="mt-4 font-display text-4xl text-carbon">
            Crea tu cuenta en <span className="text-borgona">Reviive</span>
          </h1>

          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-px w-16 bg-dorado-suave/50" />
            <span className="h-1.5 w-1.5 rotate-45 bg-dorado-suave" />
            <span className="h-px w-16 bg-dorado-suave/50" />
          </div>

          <h2 className="font-display text-2xl text-borgona">Elige cómo quieres ser parte de Reviive.</h2>
          <p className="mt-2 text-sm text-carbon/60 max-w-xl mx-auto">
            Selecciona el tipo de cuenta que mejor representa lo que quieres hacer. Podrás completar tu información
            en el siguiente paso.
          </p>

          <div className="mt-10 rounded-[2rem] border border-greige/50 bg-greige/20 grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-greige/50 overflow-hidden text-left">
            {roles.map((r) => (
              <div key={r.titulo} className="p-8 sm:p-10 flex flex-col">
                <span className="relative h-32 w-32 mx-auto shrink-0">
                  <Image src={r.ilustracion} alt="" fill sizes="128px" className="object-contain" unoptimized />
                </span>

                <div className="mt-5 flex items-center justify-center gap-3 text-xs tracking-widest text-dorado-suave">
                  <span className="h-px w-10 bg-dorado-suave/40" />
                  {r.numero}
                  <span className="h-px w-10 bg-dorado-suave/40" />
                </div>
                <h3 className="mt-1 text-center font-display text-2xl text-borgona">{r.titulo}</h3>
                <p className="mt-1 text-center text-sm font-medium text-dorado-suave">{r.subtitulo}</p>
                <p className="mt-3 text-center text-sm text-carbon/70">{r.texto}</p>

                <div className="mt-5 mx-auto h-px w-24 bg-greige/60" />

                <ul className="mt-5 space-y-2.5">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-carbon/75">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-dorado-suave text-dorado-suave">
                        <IconCheck className="h-2.5 w-2.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex-1 min-h-7" />

                <Link
                  href={r.href}
                  className="w-full rounded-full bg-borgona text-marfil px-6 py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-borgona-dark transition-colors"
                >
                  {r.label} →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-greige/50 bg-greige/20 p-5 flex flex-col md:flex-row items-center gap-5 text-left">
            <div className="flex items-start gap-3 flex-1">
              <span className="relative h-6 w-6 shrink-0 mt-0.5">
                <Image src="/images/auth/icon-shield-check.png" alt="" fill sizes="24px" className="object-contain" unoptimized />
              </span>
              <p className="text-sm text-carbon/70">
                Los perfiles profesionales están sujetos a validación por parte de Reviive para garantizar calidad,
                confianza y un servicio excepcional.
              </p>
            </div>
            <span className="hidden md:block h-10 w-px bg-greige/60" />
            <Link href="/chat" className="flex items-center gap-3 shrink-0">
              <span>
                <span className="block text-sm text-carbon/70">¿No sabes cuál elegir?</span>
                <span className="block text-sm font-medium text-borgona">Habla con Alma, tu asistente Reviive →</span>
              </span>
              <span className="relative h-11 w-11 shrink-0">
                <Image src={`${ICONS}/icon-chat-circle.png`} alt="" fill sizes="44px" className="object-contain" unoptimized />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
