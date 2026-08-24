"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { IconMessage, IconSearch, IconChevronDown } from "@/components/icons";

const ICONS = "/images/ayuda";

const categorias = [
  { icono: "icon-como-funciona.png", titulo: "Cómo funciona", texto: "Todo el recorrido de Reviive, desde que registras un recuerdo hasta que vuelve a tus manos.", href: "/preguntas-frecuentes" },
  { icono: "icon-evaluaciones.png", titulo: "Evaluaciones", texto: "Solicitudes, recomendaciones, propuestas y aprobación.", href: "/evaluaciones" },
  { icono: "icon-procesos.png", titulo: "Procesos", texto: "Etapas de restauración, preservación o transformación.", href: "/mis-procesos" },
  { icono: "icon-envios.png", titulo: "Envíos y entregas", texto: "Recolecciones, transportadora, seguimiento y devolución.", href: "/envios" },
  { icono: "icon-cuenta-seguridad.png", titulo: "Mi cuenta y seguridad", texto: "Datos personales, contraseña, privacidad y configuración.", href: "/mi-cuenta" },
  { icono: "icon-pagos.png", titulo: "Pagos y propuestas", texto: "Precios, aprobación de propuestas, comprobantes y facturación.", href: "/preguntas-frecuentes" },
];

const especificos = [
  { icono: "icon-recuerdos.png", titulo: "Mis recuerdos", texto: "Aprende a registrar, editar o agregar fotografías a un recuerdo.", href: "/mis-recuerdos" },
  { icono: "icon-evaluaciones2.png", titulo: "Mis evaluaciones", texto: "Consulta cómo completar información o interpretar una recomendación.", href: "/evaluaciones" },
  { icono: "icon-procesos2.png", titulo: "Mis procesos", texto: "Conoce qué significa cada etapa del proceso.", href: "/mis-procesos" },
  { icono: "icon-envios2.png", titulo: "Mis envíos", texto: "Consulta recolecciones, seguimiento y novedades.", href: "/envios" },
];

const preguntas = [
  { icono: "icon-cuenta.png", categoria: "Cuenta", texto: "Puedes actualizar tus datos y tu contraseña desde el menú de tu perfil, en la parte superior derecha." },
  { icono: "icon-recuerdos.png", categoria: "Recuerdos", texto: "Registra cada objeto con su historia y fotografías en \"Mis recuerdos\"; podrás editarlo más adelante." },
  { icono: "icon-evaluaciones2.png", categoria: "Evaluaciones", texto: "Nuestros expertos revisan tu solicitud y te envían una propuesta con recomendación y taller sugerido." },
  { icono: "icon-procesos2.png", categoria: "Procesos", texto: "Desde que aceptas una propuesta puedes seguir cada etapa del trabajo en \"Mis procesos\"." },
  { icono: "icon-envios2.png", categoria: "Envíos", texto: "El estado de la recolección y la entrega de tu recuerdo se actualiza en \"Envíos\"." },
  { icono: "icon-pagos2.png", categoria: "Pagos y propuestas", texto: "Cada propuesta incluye un rango estimado de costos antes de que confirmes tu solicitud." },
  { icono: "icon-general.png", categoria: "General", texto: "Si tu duda no está aquí, Alma o nuestro equipo pueden ayudarte directamente." },
];

function saludo(nombre: string) {
  return nombre ? `¿Cómo podemos ayudarte, ${nombre}?` : "¿Cómo podemos ayudarte?";
}

function ContenidoAyuda() {
  const { usuario } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const nombre = usuario?.perfil?.nombre?.trim().split(" ")[0] || "";

  const preguntasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return preguntas;
    return preguntas.filter((p) => p.categoria.toLowerCase().includes(q) || p.texto.toLowerCase().includes(q));
  }, [busqueda]);

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>

        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-carbon">{saludo(nombre)}</h1>
            <p className="mt-1 text-dorado-suave max-w-sm">
              Encuentra respuestas, consulta tus procesos o habla con Alma cuando lo necesites.
            </p>
            <div className="mt-6 relative max-w-md">
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar una pregunta o tema..."
                className="w-full rounded-full border border-greige/60 bg-white/80 pl-11 pr-4 py-3 text-sm outline-none focus:border-borgona/50"
              />
            </div>
            <p className="mt-2 text-xs text-carbon/50 max-w-md">
              Ejemplos: &quot;¿Cómo envío mi recuerdo?&quot;, &quot;¿Cuánto tarda una evaluación?&quot;
            </p>
          </div>
          <div className="relative hidden lg:block min-h-[280px]">
            <Image src={`${ICONS}/hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categorias.map((c) => (
            <Link
              key={c.titulo}
              href={c.href}
              className="rounded-2xl border border-greige/50 bg-greige/20 p-5 hover:border-borgona/40 transition-colors"
            >
              <span className="relative h-11 w-11 shrink-0 block">
                <Image src={`${ICONS}/${c.icono}`} alt="" fill sizes="44px" className="object-contain" unoptimized />
              </span>
              <h3 className="mt-3 font-display text-base text-borgona">{c.titulo}</h3>
              <p className="mt-1 text-xs text-carbon/60">{c.texto}</p>
              <span className="mt-2 inline-block text-sm text-borgona">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-10 grid lg:grid-cols-[1fr_1fr_320px] gap-6 items-start">
        <div className="lg:col-span-2 rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <h2 className="font-display text-xl text-carbon">¿Necesitas ayuda con algo específico?</h2>
          <p className="mt-1 text-sm text-carbon/60">Selecciona el tema relacionado con lo que estás haciendo.</p>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            {especificos.map((e) => (
              <div key={e.titulo} className="rounded-xl border border-greige/50 bg-marfil p-4">
                <span className="relative h-9 w-9 shrink-0 block">
                  <Image src={`${ICONS}/${e.icono}`} alt="" fill sizes="36px" className="object-contain" unoptimized />
                </span>
                <h3 className="mt-2 font-display text-sm text-borgona">{e.titulo}</h3>
                <p className="mt-1 text-xs text-carbon/60">{e.texto}</p>
                <Link href={e.href} className="mt-2 inline-flex items-center gap-1 text-sm text-borgona hover:text-borgona-dark transition-colors">
                  Ver ayuda →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden ring-2 ring-white/60">
              <Image src="/images/sobre-reviive/alma-bienvenida.png" alt="Alma" fill sizes="56px" className="object-cover" unoptimized />
            </div>
            <h3 className="font-display text-base text-borgona">¿No encuentras lo que necesitas?</h3>
          </div>
          <p className="mt-3 text-sm text-carbon/70">
            Alma está aquí para orientarte. Cuéntale tu duda y podrá ayudarte con tus recuerdos, evaluaciones,
            procesos y envíos.
          </p>
          <Button href="/chat" variant="primary" className="mt-3 w-full justify-center inline-flex items-center gap-2">
            <IconMessage className="h-4 w-4" />
            Hablar con Alma
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-10 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-carbon">Preguntas frecuentes</h2>
            <Link href="/preguntas-frecuentes" className="text-sm text-borgona hover:text-borgona-dark transition-colors">
              Ver todas →
            </Link>
          </div>
          <div className="mt-4">
            {preguntasFiltradas.map((p) => (
              <details key={p.categoria} className="group border-b border-greige/60 py-3">
                <summary className="flex items-center gap-3 cursor-pointer list-none text-sm text-carbon/80">
                  <span className="relative h-5 w-5 shrink-0">
                    <Image src={`${ICONS}/${p.icono}`} alt="" fill sizes="20px" className="object-contain" unoptimized />
                  </span>
                  <span className="flex-1 font-display text-base text-borgona">{p.categoria}</span>
                  <IconChevronDown className="h-4 w-4 shrink-0 text-dorado-suave transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-2 pl-8 text-sm text-carbon/65">{p.texto}</p>
              </details>
            ))}
            {preguntasFiltradas.length === 0 && (
              <p className="py-4 text-sm text-carbon/50">No encontramos temas relacionados con &quot;{busqueda}&quot;.</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
            <h3 className="font-display text-lg text-borgona">¿Necesitas atención de nuestro equipo?</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-carbon/70">
              <li>Correo: reviivemed@gmail.com</li>
              <li>Teléfono: +57 318 485 5941</li>
              <li>Ciudad: Medellín, Colombia</li>
            </ul>
            <Button href="mailto:reviivemed@gmail.com" variant="secondary" className="mt-4 w-full justify-center">
              Contactar con Reviive
            </Button>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-carbon">Mis solicitudes de ayuda</h3>
            </div>
            <p className="mt-3 text-sm text-carbon/60">Aún no has creado solicitudes de ayuda.</p>
            <p className="mt-1 text-xs text-carbon/45">
              Si contactas a nuestro equipo, tu solicitud aparecerá aquí para que puedas seguirla.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-10">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icono: "icon-respuestas-rapidas.png", titulo: "Respuestas rápidas", texto: "Encuentra soluciones sin esperar." },
            { icono: "icon-acompanamiento-humano.png", titulo: "Acompañamiento humano", texto: "Nuestro equipo puede ayudarte cuando lo necesites." },
            { icono: "icon-informacion-segura.png", titulo: "Información segura", texto: "Tus datos y recuerdos están protegidos." },
            { icono: "icon-alma-disponible.png", titulo: "Alma siempre disponible", texto: "Obtén orientación durante todo el proceso." },
          ].map((b) => (
            <div key={b.titulo} className="flex items-start gap-3">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS}/${b.icono}`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              <div>
                <h3 className="font-display text-sm text-borgona">{b.titulo}</h3>
                <p className="mt-0.5 text-xs text-carbon/60">{b.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function AyudaPage() {
  return (
    <ClienteShell activeHref="/ayuda">
      <ContenidoAyuda />
    </ClienteShell>
  );
}
