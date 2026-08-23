"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Button from "@/components/Button";
import {
  IconMessage,
  IconUpload,
  IconEnviar,
  IconPlus,
  IconTruck,
  IconMapPin,
  IconGlobe,
} from "@/components/icons";

const contactoDirecto = [
  {
    icono: "correo",
    titulo: "Correo electrónico",
    lineas: ["hola@reviive.com", "Te responderemos con dedicación."],
  },
  {
    icono: "telegram",
    titulo: "Telegram",
    lineas: ["@reviive_asesoria", "Escríbenos para atención rápida y personalizada."],
  },
  {
    icono: "horarios",
    titulo: "Horarios de atención",
    lineas: ["Lunes a viernes 9:00 a. m. – 6:00 p. m.", "Sábados 10:00 a. m. – 2:00 p. m."],
  },
];

const redes = [
  { icono: "instagram", nombre: "Instagram", texto: "Historias, procesos y resultados." },
  { icono: "facebook", nombre: "Facebook", texto: "Comunidad Reviive." },
  { icono: "tiktok", nombre: "TikTok", texto: "Transformaciones y detrás de cámaras." },
];

const preguntas = [
  { p: "¿Cómo solicito una evaluación?", r: "Desde el botón \"Solicitar evaluación\" cuéntanos sobre tu objeto y nuestro equipo te enviará una recomendación." },
  { p: "¿Debo enviar fotografías del objeto?", r: "Sí, ayudan mucho a nuestros especialistas a evaluar el estado y las posibilidades de tu recuerdo." },
  { p: "¿Puedo contactar a Reviive desde otra ciudad?", r: "Sí, atendemos solicitudes de todo el país y coordinamos la recolección o el envío según tu ubicación." },
  { p: "¿Cómo entrego mi objeto?", r: "Puedes enviarlo por la transportadora de tu preferencia o solicitar que lo recojamos directamente." },
  { p: "¿Cuánto tarda una evaluación inicial?", r: "Normalmente recibirás una respuesta dentro de 24 a 48 horas hábiles." },
  { p: "¿Cómo puedo convertirme en proveedor de Reviive?", r: "Escríbenos por este formulario o a hola@reviive.com contándonos tu experiencia y con gusto te contactaremos." },
];

function BranchTag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {children}
      <span className="relative h-5 w-9 shrink-0">
        <Image src="/images/contacto/rama-pequena.png" alt="" fill sizes="36px" className="object-contain" unoptimized />
      </span>
    </span>
  );
}

export default function ContactoPage() {
  const [aceptaPolitica, setAceptaPolitica] = useState(false);

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 pt-4 text-xs text-carbon/50">
        <Link href="/" className="hover:text-borgona transition-colors">Inicio</Link>
        <span className="mx-1.5">›</span>
        <span className="text-carbon/70">Contacto</span>
      </div>

      <section className="relative overflow-hidden grid lg:grid-cols-2 lg:items-center">
        <div className="pointer-events-none absolute -left-4 top-0 hidden h-full w-36 opacity-25 sm:block md:w-44">
          <Image src="/images/contacto/rama-hero.png" alt="" fill sizes="176px" className="object-contain object-top" unoptimized />
        </div>
        <div className="relative px-6 py-12 lg:py-16 flex flex-col justify-center lg:pl-[max(1.5rem,calc((100vw-72rem)/2))]">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-borgona max-w-md">
            Estamos aquí para ayudarte.
          </h1>
          <span className="relative mt-3 h-5 w-9 block">
            <Image src="/images/contacto/rama-pequena.png" alt="" fill sizes="36px" className="object-contain" unoptimized />
          </span>
          <p className="mt-5 text-sm text-carbon/70 max-w-md">
            Cada recuerdo tiene una historia y cada historia merece ser escuchada.
          </p>
          <p className="mt-3 text-sm text-carbon/70 max-w-md">
            Cuéntanos qué objeto quieres conservar, restaurar o transformar y te ayudaremos a encontrar el mejor camino.
          </p>
        </div>
        <div className="relative h-64 w-full lg:h-auto lg:aspect-[1672/941]">
          <Image
            src="/images/contacto/hero.png"
            alt="Escríbenos, cada historia merece ser escuchada"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 grid lg:grid-cols-[1fr_1fr] gap-10">
        <div>
          <h2 className="font-display text-2xl text-borgona">
            <BranchTag>Envíanos un mensaje</BranchTag>
          </h2>
          <form className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src="/images/contacto/icon-person.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <input className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="Nombre completo" />
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src="/images/contacto/icon-envelope.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <input type="email" className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="Correo electrónico" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src="/images/contacto/icon-phone.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <input className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50" placeholder="Teléfono (opcional)" />
              </div>
              <div className="relative">
                <select className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pr-9 text-sm text-carbon/70 outline-none transition-colors focus:border-borgona/50 appearance-none">
                  <option>¿En qué podemos ayudarte?</option>
                  <option>Restauración</option>
                  <option>Preservación</option>
                  <option>Transformación</option>
                  <option>Otra consulta</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5">
                  <Image src="/images/contacto/icon-chevron.png" alt="" fill sizes="14px" className="object-contain" unoptimized />
                </span>
              </div>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-3 h-4 w-4">
                <Image src="/images/contacto/icon-message.png" alt="" fill sizes="16px" className="object-contain" unoptimized />
              </span>
              <textarea className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 pl-9 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50 resize-none" rows={4} placeholder="Cuéntanos la historia de tu objeto..." />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-greige/60 bg-white/60 px-4 py-3 cursor-pointer">
              <span className="relative h-6 w-6 shrink-0">
                <Image src="/images/contacto/icon-upload.png" alt="" fill sizes="24px" className="object-contain" unoptimized />
              </span>
              <span className="text-sm text-carbon/70">
                Adjuntar fotografía del objeto (opcional)
                <span className="block text-xs text-carbon/45">Formatos: JPG, PNG. Máx. 10MB</span>
              </span>
              <input type="file" accept="image/*" className="hidden" />
            </label>

            <label className="flex items-center gap-2.5 text-xs text-carbon/60">
              <input
                type="checkbox"
                checked={aceptaPolitica}
                onChange={(e) => setAceptaPolitica(e.target.checked)}
                className="h-4 w-4 rounded border-greige/60 accent-borgona"
              />
              He leído y acepto la{" "}
              <Link href="/politica-privacidad" className="text-borgona hover:text-borgona-dark underline">
                Política de privacidad.
              </Link>
            </label>

            <Button type="submit" variant="primary" className="w-full justify-center inline-flex items-center gap-2">
              Enviar mensaje
              <IconEnviar className="h-4 w-4" />
            </Button>
            <p className="text-xs text-carbon/50">
              Tiempo estimado de respuesta: dentro de 24 horas hábiles.
            </p>
          </form>
        </div>

        <div>
          <h2 className="font-display text-2xl text-borgona">
            <BranchTag>Contáctanos directamente</BranchTag>
          </h2>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {contactoDirecto.map((c) => (
              <div key={c.titulo} className="rounded-2xl border border-greige/50 bg-greige/20 p-5 text-center">
                <div className="relative h-14 w-14 mx-auto">
                  <Image src={`/images/contacto/contact-${c.icono}.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
                </div>
                <h3 className="mt-3 font-display text-sm text-borgona">{c.titulo}</h3>
                {c.lineas.map((l) => (
                  <p key={l} className="mt-1 text-xs text-carbon/60">{l}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-72 w-56 shrink-0">
              <Image src="/images/contacto/alma-ayuda-full.png" alt="Alma, ayuda y soporte" fill sizes="224px" className="object-contain" unoptimized />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-display text-lg text-borgona">¿No sabes por dónde comenzar?</h3>
              <p className="mt-1 text-xs text-carbon/70">
                Cuéntale a Alma qué objeto tienes y qué significa para ti. Ella te ayudará a identificar cómo podemos conservarlo.
              </p>
              <div className="mt-4 flex flex-col gap-2 items-center sm:items-start">
                <Button href="/chat" variant="primary" className="inline-flex items-center gap-2 justify-center whitespace-nowrap">
                  Hablar con Alma
                  <IconMessage className="h-4 w-4" />
                </Button>
                <Button href="/recuerdos/nuevo" variant="secondary" className="inline-flex items-center gap-2 justify-center whitespace-nowrap">
                  Subir foto del objeto
                  <IconUpload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute -left-6 top-1/2 hidden h-48 w-40 -translate-y-1/2 opacity-25 sm:block">
          <Image src="/images/contacto/rama-hero.png" alt="" fill sizes="160px" className="object-contain" unoptimized />
        </div>
        <div className="pointer-events-none absolute -right-6 top-1/2 hidden h-48 w-40 -translate-y-1/2 opacity-25 sm:block -scale-x-100">
          <Image src="/images/contacto/rama-hero.png" alt="" fill sizes="160px" className="object-contain" unoptimized />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl font-medium text-borgona">
            <BranchTag>Síguenos y descubre historias que siguen vivas</BranchTag>
          </h2>
          <div className="mt-10 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {redes.map((r) => (
              <div key={r.nombre} className="text-center">
                <div className="relative h-16 w-16 mx-auto">
                  <Image src={`/images/contacto/social-${r.icono}.png`} alt="" fill sizes="64px" className="object-contain" unoptimized />
                </div>
                <h3 className="mt-3 font-display text-base text-borgona">{r.nombre}</h3>
                <p className="mt-1 text-xs text-carbon/60">{r.texto}</p>
                <Button variant="secondary" className="mt-4 !px-5 !py-2 text-xs">
                  Síguenos
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-xl text-borgona">
            <BranchTag>Estamos en Medellín</BranchTag>
          </h2>
          <div className="mt-4 relative h-48 w-full rounded-2xl overflow-hidden" style={{ background: "#dfe6d3" }}>
            {/* river */}
            <div
              className="absolute inset-y-0"
              style={{ left: "38%", width: "9%", background: "#a9c6cf", transform: "skewX(-8deg)" }}
            />
            {/* parks / blocks */}
            <div className="absolute rounded-md" style={{ top: "14%", left: "8%", width: "22%", height: "26%", background: "#c3d6ae" }} />
            <div className="absolute rounded-md" style={{ top: "56%", left: "14%", width: "16%", height: "30%", background: "#c9b79a" }} />
            <div className="absolute rounded-md" style={{ top: "20%", left: "58%", width: "26%", height: "20%", background: "#c9b79a" }} />
            <div className="absolute rounded-md" style={{ top: "54%", left: "62%", width: "20%", height: "32%", background: "#c3d6ae" }} />
            {/* streets */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, transparent 24%, #eee7d8 25%, #eee7d8 26.5%, transparent 27.5%, transparent 73%, #eee7d8 74%, #eee7d8 75.5%, transparent 76.5%), linear-gradient(90deg, transparent 24%, #eee7d8 25%, #eee7d8 26.5%, transparent 27.5%, transparent 73%, #eee7d8 74%, #eee7d8 75.5%, transparent 76.5%)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center gap-2 rounded-full bg-marfil/95 px-4 py-2 shadow-md">
                <IconMapPin className="h-4 w-4 text-borgona" />
                <span className="text-sm text-carbon/80">Robledo</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3 text-sm text-carbon/70">
            <IconMapPin className="h-4 w-4 mt-0.5 shrink-0 text-borgona" />
            <p>Territorio Robledo, Medellín, Antioquia, Colombia</p>
          </div>
          <div className="mt-2 flex items-start gap-3 text-sm text-carbon/70">
            <IconGlobe className="h-4 w-4 mt-0.5 shrink-0 text-borgona" />
            <p>Atención digital y acompañamiento en todo el proceso.</p>
          </div>
          <div className="mt-4 rounded-xl bg-greige/20 border border-greige/50 p-4 flex items-start gap-3">
            <IconTruck className="h-5 w-5 shrink-0 text-borgona mt-0.5" />
            <div>
              <p className="text-sm font-medium text-borgona">¿Estás fuera de Medellín?</p>
              <p className="mt-1 text-xs text-carbon/60">
                Escríbenos. Evaluaremos contigo las alternativas de recepción, transporte y entrega de tu recuerdo.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl text-borgona">
            <BranchTag>Preguntas frecuentes</BranchTag>
          </h2>
          <div className="mt-4">
            {preguntas.map((item) => (
              <details key={item.p} className="group border-b border-greige/60 py-3">
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm text-carbon/80">
                  {item.p}
                  <IconPlus className="h-4 w-4 shrink-0 text-dorado-suave transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="mt-2 text-sm text-carbon/60">{item.r}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-xs text-carbon/60">
            ¿No encuentras lo que buscas? Escríbenos y con gusto te ayudaremos.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-borgona py-9">
        <div className="pointer-events-none absolute bottom-0 left-4 h-24 w-24 opacity-40 md:left-8 md:h-32 md:w-32">
          <Image src="/images/contacto/rama-hero.png" alt="" fill sizes="128px" className="object-contain object-left-bottom" unoptimized />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-4 h-24 w-24 opacity-40 md:right-8 md:h-32 md:w-32 -scale-x-100">
          <Image src="/images/contacto/rama-hero.png" alt="" fill sizes="128px" className="object-contain object-left-bottom" unoptimized />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-display text-lg text-marfil">Todo recuerdo comienza con una conversación.</p>
            <p className="mt-1.5 text-sm text-marfil/70">
              Cuéntanos qué quieres conservar y construyamos juntos la mejor manera de hacerlo permanecer.
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
