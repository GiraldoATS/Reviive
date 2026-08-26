"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { destinoPorRol } from "@/lib/auth";
import {
  IconMessage,
  IconSeguro,
  IconLightbulb,
  IconChevronRight,
  IconChevronDown,
} from "@/components/icons";

const ICONS = "/images/preguntas-frecuentes";

const pasos = [
  { icono: `${ICONS}/icon-box-heart.png`, titulo: "Prepara y envía", texto: "Recibe tu kit Reviive, prepara tus recuerdos con calma y envíanoslos de forma segura." },
  { icono: `${ICONS}/icon-magnifier.png`, titulo: "Evaluamos y registramos", texto: "Revisamos, registramos y documentamos cada pieza con el máximo cuidado." },
  { icono: `${ICONS}/icon-book-heart.png`, titulo: "Conservamos", texto: "Conservamos tus recuerdos con técnicas especializadas y materiales de archivo." },
  { icono: `${ICONS}/icon-chest-heart.png`, titulo: "Devolvemos con amor", texto: "Te los enviamos de vuelta en perfecto estado, listos para seguir contando tu historia." },
];

const categorias = [
  {
    id: "como-funciona",
    icono: `${ICONS}/icon-leaf-gold.png`,
    iconoActivo: undefined as string | undefined,
    invertirEnActivo: false,
    titulo: "Cómo funciona",
    subtitulo: "Pasos del proceso",
  },
  {
    id: "costos",
    icono: `${ICONS}/icon-clock.png`,
    iconoActivo: `${ICONS}/icon-clock-gold.png`,
    invertirEnActivo: true,
    titulo: "Costos y tiempos",
    subtitulo: "Rangos estimados, factores y tiempos",
  },
  {
    id: "envios",
    icono: `${ICONS}/icon-truck.png`,
    iconoActivo: `${ICONS}/icon-truck-gold.png`,
    invertirEnActivo: true,
    titulo: "Envíos y entregas",
    subtitulo: "Recolección, envío, seguimiento y devolución",
  },
  {
    id: "alma",
    icono: `${ICONS}/icon-chat.png`,
    iconoActivo: `${ICONS}/icon-chat-gold.png`,
    invertirEnActivo: true,
    titulo: "Hablar con Alma",
    subtitulo: "Chat, asesoría personalizada y contacto directo",
  },
];

const FILTRO_DORADO =
  "brightness(0) saturate(100%) invert(70%) sepia(54%) saturate(500%) hue-rotate(2deg) brightness(101%) contrast(101%)";
const FILTRO_ATENUADO = { filter: "grayscale(65%)", opacity: 0.6 };

function iconoSidebar(c: (typeof categorias)[number], activo: boolean) {
  if (activo && c.iconoActivo) return { src: c.iconoActivo, style: undefined };
  if (activo && c.invertirEnActivo) return { src: c.icono, style: { filter: FILTRO_DORADO } };
  if (!activo && !c.invertirEnActivo) return { src: c.icono, style: FILTRO_ATENUADO };
  return { src: c.icono, style: undefined };
}

const preguntas = [
  {
    p: "¿Qué tipo de recuerdos puedo enviar?",
    r: "Joyas y relojes, fotografías y cartas, textiles, peluches, muebles, prendas de vestir y objetos decorativos con un significado especial para ti.",
  },
  {
    p: "¿Mis recuerdos están asegurados?",
    r: "Sí. Cada recuerdo que recibimos queda registrado y documentado, y su traslado incluye protección durante todo el proceso.",
  },
  {
    p: "¿Cuánto tiempo tarda el proceso completo?",
    r: "Depende del tipo de intervención: entre 2 y 8 semanas en promedio. Siempre recibirás un tiempo estimado antes de confirmar tu solicitud.",
  },
  {
    p: "¿Cómo sé el estado de mi envío?",
    r: "Desde tu cuenta puedes consultar en \"Envíos\" el estado de la recolección y la entrega de tu recuerdo en cada etapa.",
  },
];

export default function PreguntasFrecuentesPage() {
  const [activa, setActiva] = useState("como-funciona");
  const categoriaActiva = categorias.find((c) => c.id === activa)!;
  const { usuario, cargando } = useAuth();

  return (
    <div className="min-h-screen bg-marfil">
      <header className="border-b border-greige/60 px-6 py-4 flex items-center justify-between gap-4">
        <Link href={usuario ? destinoPorRol(usuario.rol) : "/"}>
          <Logo tagline="Recuerdos que perduran" />
        </Link>
        <div className="flex items-center gap-5 text-sm text-carbon/70">
          {!cargando && usuario ? (
            <Link href={destinoPorRol(usuario.rol)} className="hover:text-borgona transition-colors">
              Volver a mi cuenta
            </Link>
          ) : (
            <>
              <Link href="/" className="hover:text-borgona transition-colors">Volver al inicio</Link>
              <Link href="/auth/login" className="hover:text-borgona transition-colors">Iniciar sesión</Link>
            </>
          )}
          <span className="h-5 w-px bg-greige/60" />
          <span className="relative h-6 w-6 shrink-0">
            <Image src="/images/auth/hourglass-icon.png" alt="" fill sizes="24px" className="object-contain" unoptimized />
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-80 w-48 opacity-40 sm:block">
          <Image src={`${ICONS}/rama-flor.png`} alt="" fill sizes="192px" className="object-contain object-left-top" unoptimized />
        </div>
        <div className="pointer-events-none absolute -right-6 top-0 hidden h-80 w-48 opacity-40 sm:block -scale-x-100">
          <Image src={`${ICONS}/rama-flor.png`} alt="" fill sizes="192px" className="object-contain object-left-top" unoptimized />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-14 text-center">
          <h1 className="font-display text-4xl text-borgona">¿Necesitas ayuda?</h1>
          <p className="mt-3 text-sm text-carbon/70 max-w-xl mx-auto">
            Este es el único centro de ayuda oficial de Reviive.
            <br />
            Aquí encontrarás todo lo que necesitas para confiar, enviar y conservar lo que más importa.
          </p>

          <div className="mt-10 grid lg:grid-cols-[300px_1fr] gap-6 text-left">
            <div className="space-y-3">
              {categorias.map((c) => {
                const activo = c.id === activa;
                const icono = iconoSidebar(c, activo);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiva(c.id)}
                    className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                      activo
                        ? "bg-borgona border-borgona text-marfil"
                        : "bg-white/70 border-greige/60 text-carbon/80 hover:border-borgona/40"
                    }`}
                  >
                    <span className="relative h-11 w-11 shrink-0">
                      <Image
                        src={icono.src}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-contain transition-[filter,opacity] duration-200"
                        style={icono.style}
                        unoptimized
                      />
                    </span>
                    <span>
                      <span className={`block font-display text-base ${activo ? "text-marfil" : "text-borgona"}`}>
                        {c.titulo}
                      </span>
                      <span className={`block text-xs ${activo ? "text-marfil/75" : "text-carbon/55"}`}>
                        {c.subtitulo}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-8">
              <p className="text-xs uppercase tracking-widest text-dorado-suave">Contenido</p>
              <h2 className="mt-1 font-display text-2xl text-borgona">{categoriaActiva.titulo}</h2>

              {activa === "como-funciona" && (
                <>
                  <p className="mt-2 text-sm text-carbon/70">
                    Un proceso cuidado de principio a fin para que tus recuerdos estén siempre en buenas manos.
                  </p>
                  <div className="relative mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
                    <div className="hidden sm:block absolute left-[8%] right-[8%] top-5 -z-0 border-t-2 border-dotted border-dorado-suave/50" />
                    {pasos.map((p, i) => (
                      <div key={p.titulo} className="relative text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-borgona text-[11px] text-marfil">
                            {i + 1}
                          </span>
                        </div>
                        <span className="relative mt-2 h-16 w-16 mx-auto sm:mx-0 block">
                          <Image src={p.icono} alt="" fill sizes="64px" className="object-contain" unoptimized />
                        </span>
                        <h3 className="mt-2 font-display text-sm text-borgona">{p.titulo}</h3>
                        <p className="mt-1 text-xs text-carbon/60">{p.texto}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-greige/50 pt-6">
                    <Button href="/recuerdos/nuevo" variant="primary" className="inline-flex items-center gap-2">
                      Iniciar mi proceso →
                    </Button>
                    <p className="inline-flex items-center gap-2 text-xs text-carbon/60">
                      <IconSeguro className="h-4 w-4 text-borgona" />
                      Proceso seguro, confidencial y con garantía de cuidado.
                    </p>
                  </div>
                </>
              )}

              {activa === "costos" && (
                <div className="mt-2 space-y-3 text-sm text-carbon/70">
                  <p>
                    Cada evaluación incluye un rango estimado de costos según el tipo de objeto, su estado y la
                    intervención que necesita: restauración, preservación o transformación.
                  </p>
                  <p>
                    Los tiempos varían entre 2 y 6 semanas dependiendo de la complejidad del proceso y la
                    disponibilidad del taller o artesano asignado. Siempre recibirás un tiempo estimado antes de
                    confirmar tu solicitud.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-greige/50 pt-6">
                    <Button href="/costos-tiempos" variant="primary" className="inline-flex items-center gap-2">
                      Ver costos y tiempos en detalle →
                    </Button>
                  </div>
                </div>
              )}

              {activa === "envios" && (
                <div className="mt-2 space-y-3 text-sm text-carbon/70">
                  <p>
                    Coordinamos la recolección de tu objeto o te indicamos cómo enviarlo de forma segura hasta
                    nuestro taller aliado más cercano.
                  </p>
                  <p>
                    Durante todo el proceso puedes hacer seguimiento al estado de tu envío, y al finalizar
                    coordinamos la entrega de vuelta con el mismo cuidado con el que lo recibimos.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-greige/50 pt-6">
                    <Button href="/envios-entregas" variant="primary" className="inline-flex items-center gap-2">
                      Ver envíos y entregas en detalle →
                    </Button>
                  </div>
                </div>
              )}

              {activa === "alma" && (
                <div className="mt-4 space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <p className="flex-1 text-sm text-carbon/70">
                      Alma es tu asistente de confianza. Cuéntale sobre tu objeto y ella te ayudará a resolver
                      dudas, recomendarte una opción y acompañarte durante todo el proceso.
                    </p>
                    <Button href="/chat" variant="primary" className="inline-flex items-center gap-2 justify-center shrink-0">
                      <IconMessage className="h-4 w-4" />
                      Hablar con Alma
                    </Button>
                  </div>
                  <div className="relative mx-auto h-40 w-40 rounded-2xl overflow-hidden ring-4 ring-white/60">
                    <Image
                      src="/images/sobre-reviive/alma-bienvenida.png"
                      alt="Alma"
                      fill
                      sizes="160px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-dorado-suave">
              <span aria-hidden="true">←</span>
              Qué muestra cada opción
              <span aria-hidden="true">→</span>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categorias.map((c) => {
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiva(c.id)}
                    className="flex items-center gap-3 rounded-2xl border border-greige/60 bg-white/70 p-4 text-left hover:border-borgona/40 transition-colors"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rosa/40 p-2">
                      <span className="relative h-full w-full block">
                        <Image
                          src={c.icono}
                          alt=""
                          fill
                          sizes="28px"
                          className="object-contain"
                          style={!c.invertirEnActivo ? { filter: "grayscale(65%)", opacity: 0.6 } : undefined}
                          unoptimized
                        />
                      </span>
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-sm text-borgona">{c.titulo}</span>
                      <span className="block text-xs text-carbon/55">{c.subtitulo}.</span>
                    </span>
                    <IconChevronRight className="h-4 w-4 shrink-0 text-dorado-suave" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-14 grid lg:grid-cols-[1fr_360px] gap-8 text-left">
            <div>
              <h2 className="font-display text-xl text-borgona">Preguntas frecuentes</h2>
              <p className="mt-1 text-xs text-carbon/55">
                Haz clic en una pregunta para ver la respuesta.
              </p>
              <div className="mt-4">
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
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex items-start gap-3">
              <IconLightbulb className="h-6 w-6 shrink-0 text-borgona" />
              <div>
                <h3 className="font-display text-base text-borgona">Cómo funciona la navegación</h3>
                <p className="mt-1.5 text-xs text-carbon/65">
                  Estas cuatro opciones son las únicas categorías de ayuda.
                </p>
                <p className="mt-1.5 text-xs text-carbon/65">
                  ¿No encuentras tu respuesta aquí? Habla con Alma para una orientación personalizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-greige/50 py-6 text-center">
        <p className="text-xs text-carbon/40">© 2026 Reviive. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
