"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";

const ICONS = "/images/proveedor";

// No existe ningún modelo real de calificaciones/reseñas por pedido en
// el backend (solo un campo agregado y estático Proveedor.calificacion,
// fijado manualmente, sin reseñas individuales detrás). Por eso, igual
// que Solicitudes y Evidencias, esta vista muestra el diseño del
// prototipo con datos de ejemplo, para validar la visual.

const stats = [
  { icono: "cal-icon-star.png", numero: "4.8", sufijo: "/ 5", label: "Calificación promedio" },
  { icono: "cal-icon-people.png", numero: "128", label: "Total de calificaciones" },
  { icono: "cal-icon-calendar.png", numero: "12", label: "Reseñas este mes", nota: "+2 vs. mes anterior" },
  { icono: "cal-icon-chat-dots.png", numero: "3", label: "Pedidos sin calificar" },
];

const distribucion = [
  { estrellas: 5, cantidad: 92, pct: 72 },
  { estrellas: 4, cantidad: 28, pct: 22 },
  { estrellas: 3, cantidad: 6, pct: 5 },
  { estrellas: 2, cantidad: 2, pct: 1 },
  { estrellas: 1, cantidad: 0, pct: 0 },
];

const reputacion = [
  { mes: "Ene", valor: 4.6 },
  { mes: "Feb", valor: 4.7 },
  { mes: "Mar", valor: 4.8 },
  { mes: "Abr", valor: 4.8 },
  { mes: "May", valor: 4.9 },
  { mes: "Jun", valor: 4.8 },
  { mes: "Jul", valor: 4.8 },
  { mes: "Ago", valor: 4.8 },
];

const filtros = [
  { id: "todas", label: "Todas" },
  { id: "5", label: "5 estrellas" },
  { id: "4", label: "4 estrellas" },
  { id: "3-", label: "3 o menos" },
  { id: "con_comentario", label: "Con comentario" },
  { id: "sin_comentario", label: "Sin comentario" },
] as const;

const indicadores = [
  { icono: "cal-icon-star.png", label: "Calidad del trabajo", valor: 4.9 },
  { icono: "cal-icon-clipboard.png", label: "Cumplimiento del tiempo", valor: 4.7 },
  { icono: "cal-icon-shield-check.png", label: "Cuidado del objeto", valor: 5.0 },
  { icono: "cal-icon-chat-quote.png", label: "Comunicación", valor: 4.8 },
  { icono: "cal-icon-heart.png", label: "Experiencia general", valor: 4.8 },
];

const reconocimientos = [
  { icono: "cal-icon-medal.png", titulo: "Excelente cuidado", texto: "Obtuviste este reconocimiento 15 veces." },
  { icono: "cal-icon-medal.png", titulo: "Alta puntualidad", texto: "Cumples con los tiempos de entrega." },
  { icono: "cal-icon-medal.png", titulo: "Muy recomendado", texto: "Más del 90% de clientes te recomiendan." },
  { icono: "cal-icon-medal.png", titulo: "50 trabajos con 5 estrellas", texto: "¡Gracias por tu compromiso y calidad!" },
];

const pasos = [
  { icono: "cal-icon-calendar.png", titulo: "Pedido finalizado", texto: "Completa el trabajo y el cliente recibe su recuerdo." },
  { icono: "cal-icon-chat-quote.png", titulo: "Invitación enviada", texto: "Reviive invita al cliente a compartir su experiencia." },
  { icono: "cal-icon-star.png", titulo: "Cliente califica", texto: "El cliente valora tu trabajo y puede dejar un comentario." },
  { icono: "cal-icon-trend.png", titulo: "Calificación publicada", texto: "La valoración aparece en tu perfil público en Reviive." },
  { icono: "cal-icon-medal.png", titulo: "Mejora tu reputación", texto: "Sigue ofreciendo experiencias que enamoren a tus clientes." },
];

interface ResenaEjemplo {
  id: string;
  codigo: string;
  titulo: string;
  icono: string;
  estrellas: number;
  fecha: string;
  verificado: boolean;
  cliente: string;
  ciudad: string;
  comentario: string;
  servicio: string;
  aspectoSenalado?: string;
  estado: "positiva" | "observacion";
}

const RESENAS: ResenaEjemplo[] = [
  {
    id: "1",
    codigo: "PED-00128",
    titulo: "Reloj de bolsillo familiar",
    icono: "sol-icon-clock.png",
    estrellas: 5,
    fecha: "23 ago 2026",
    verificado: true,
    cliente: "Familia Ramírez",
    ciudad: "Medellín, Colombia",
    comentario: "El reloj quedó hermoso y conservaron cada detalle que era importante para nuestra familia.",
    servicio: "Restauración",
    estado: "positiva",
  },
  {
    id: "2",
    codigo: "PED-00124",
    titulo: "Álbum de fotos antiguo",
    icono: "icon-evidencias.png",
    estrellas: 4.5,
    fecha: "18 ago 2026",
    verificado: true,
    cliente: "Ana Torres",
    ciudad: "Bogotá, Colombia",
    comentario: "Excelente trabajo, recuperaron fotos que creíamos que ya no se podían salvar. Muy recomendados.",
    servicio: "Restauración",
    estado: "positiva",
  },
  {
    id: "3",
    codigo: "PED-00117",
    titulo: "Baúl de madera heredado",
    icono: "sol-icon-caja.png",
    estrellas: 3,
    fecha: "10 ago 2026",
    verificado: false,
    cliente: "Carlos Mejía",
    ciudad: "Envigado, Colombia",
    comentario: "El resultado fue bueno, pero el proceso tomó más tiempo del esperado.",
    servicio: "Restauración",
    aspectoSenalado: "Cumplimiento de tiempos",
    estado: "observacion",
  },
];

function Estrellas({ valor }: { valor: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const llena = valor >= i + 1;
        const media = !llena && valor > i;
        return (
          <span key={i} className={`text-sm ${llena || media ? "text-dorado-suave" : "text-greige/60"}`}>
            {media ? "★" : "★"}
          </span>
        );
      })}
    </span>
  );
}

function ContenidoCalificaciones() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todas");

  const visibles = useMemo(() => {
    return RESENAS.filter((r) => {
      if (filtro === "5") return r.estrellas >= 5;
      if (filtro === "4") return r.estrellas >= 4 && r.estrellas < 5;
      if (filtro === "3-") return r.estrellas <= 3;
      if (filtro === "con_comentario") return r.comentario.trim().length > 0;
      if (filtro === "sin_comentario") return r.comentario.trim().length === 0;
      return true;
    });
  }, [filtro]);

  const maxReputacion = Math.max(...reputacion.map((r) => r.valor));
  const minReputacion = Math.min(...reputacion.map((r) => r.valor));

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-4">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Calificaciones</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Consulta cómo valoran tus clientes la calidad de tu trabajo y utiliza sus comentarios para seguir
              mejorando tu servicio.
            </p>
          </div>
          <div
            className="relative hidden lg:block h-52 w-36 mx-auto"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
            }}
          >
            <Image src={`${ICONS}/cal-hero.png`} alt="" fill sizes="144px" className="object-cover" unoptimized />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 block">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="56px" className="object-contain" unoptimized />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl text-carbon leading-tight">
                {s.numero} {s.sufijo && <span className="text-sm text-carbon/50">{s.sufijo}</span>}
              </p>
              <p className="mt-0.5 text-xs text-carbon/60">{s.label}</p>
              {s.nota && <p className="text-[11px] text-emerald-700">{s.nota}</p>}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-borgona">Distribución de calificaciones</h3>
          <ul className="mt-4 space-y-2.5">
            {distribucion.map((d) => (
              <li key={d.estrellas} className="flex items-center gap-3 text-sm">
                <span className="w-20 shrink-0 whitespace-nowrap text-carbon/70">{d.estrellas} estrellas</span>
                <Estrellas valor={d.estrellas} />
                <div className="flex-1 h-2 rounded-full bg-greige/40 overflow-hidden">
                  <div className="h-full rounded-full bg-dorado-suave" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right text-carbon/50 text-xs">{d.cantidad} ({d.pct}%)</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-carbon/40">Basado en 128 calificaciones</p>
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
          <h3 className="font-display text-base text-borgona">Evolución de tu reputación</h3>
          <div className="mt-4 flex items-end gap-3 h-28">
            {reputacion.map((r) => {
              const pct = maxReputacion > minReputacion ? (r.valor - minReputacion) / (maxReputacion - minReputacion) : 0.5;
              return (
                <div key={r.mes} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-carbon/50">{r.valor}</span>
                  <div className="relative h-16 w-full flex items-end">
                    <div className="w-full rounded-t bg-borgona/70" style={{ height: `${20 + pct * 80}%` }} />
                  </div>
                  <span className="text-[10px] text-carbon/45">{r.mes}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-carbon/40">Promedio mensual</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3 flex flex-wrap gap-2">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  filtro === f.id ? "bg-borgona text-marfil" : "bg-white/60 text-carbon/70 hover:bg-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {visibles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-8 text-center text-sm text-carbon/60">
              No hay calificaciones que coincidan con este filtro.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {visibles.map((r) => (
                <div key={r.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <span className="relative h-16 w-16 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                      <span className="relative h-8 w-8 block">
                        <Image src={`${ICONS}/${r.icono}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                      </span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg text-carbon">Pedido #{r.codigo}</p>
                        <p className="text-sm text-carbon/70">{r.titulo}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-carbon/60">
                        <span>Cliente: {r.cliente}</span>
                        <span>{r.ciudad}</span>
                      </div>
                      <p className="mt-2 text-sm text-carbon/70 italic">&ldquo;{r.comentario}&rdquo;</p>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-carbon/50">
                        <span>Servicio: {r.servicio}</span>
                        {r.aspectoSenalado && (
                          <span>
                            Aspecto señalado: <span className="text-borgona">{r.aspectoSenalado}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5">
                        <Estrellas valor={r.estrellas} />
                        <span className="text-sm text-carbon font-medium">{r.estrellas.toFixed(1)}</span>
                      </div>
                      <span className="text-[11px] text-carbon/40">{r.fecha}</span>
                      {r.verificado ? (
                        <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px]">✓ Verificado</span>
                      ) : (
                        <span className="rounded-full bg-dorado-suave/20 text-borgona-dark px-2.5 py-0.5 text-[11px]">Con observación</span>
                      )}
                      <div className="flex gap-2 mt-1">
                        <Link href="/proveedor/pedidos" className="rounded-full border border-borgona text-borgona px-3 py-1.5 text-xs hover:bg-borgona/5 transition-colors">
                          Ver pedido
                        </Link>
                        <span className="rounded-full border border-greige/60 text-carbon/40 px-3 py-1.5 text-xs cursor-default" title="Próximamente">
                          Responder reseña
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="#" className="inline-block text-sm text-borgona hover:text-borgona-dark transition-colors" title="Próximamente">
                Ver todas las calificaciones →
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Indicadores por aspecto</h3>
            <ul className="mt-3 space-y-2">
              {indicadores.map((i) => (
                <li key={i.label} className="flex items-center gap-3 text-sm">
                  <span className="relative h-8 w-8 shrink-0">
                    <Image src={`${ICONS}/${i.icono}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                  </span>
                  <span className="flex-1 text-carbon/70">{i.label}</span>
                  <span className="text-carbon font-medium">{i.valor.toFixed(1)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-carbon/40">Basado en 128 calificaciones</p>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Pedidos pendientes de calificación</h3>
            <p className="mt-3 font-display text-3xl text-borgona">3</p>
            <p className="mt-1 text-xs text-carbon/60">
              Estos trabajos ya fueron entregados, pero el cliente aún no ha dejado su valoración.
            </p>
            <Link
              href="/proveedor/pedidos"
              className="mt-3 inline-flex items-center justify-center rounded-full border border-borgona text-borgona px-4 py-2 text-sm hover:bg-borgona/5 transition-colors w-full"
            >
              Ver pedidos pendientes
            </Link>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-base text-borgona">Reconocimientos</h3>
            <ul className="mt-3 space-y-3">
              {reconocimientos.map((r) => (
                <li key={r.titulo} className="flex items-start gap-2.5">
                  <span className="relative h-8 w-8 shrink-0">
                    <Image src={`${ICONS}/${r.icono}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                  </span>
                  <div>
                    <p className="text-sm text-carbon">{r.titulo}</p>
                    <p className="text-xs text-carbon/55">{r.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pb-16">
        <h3 className="font-display text-lg text-borgona">¿Cómo se generan las calificaciones?</h3>
        <div className="mt-5 grid sm:grid-cols-5 gap-4">
          {pasos.map((p, i) => (
            <div key={p.titulo} className="flex flex-col items-center text-center gap-2">
              <span className="relative h-14 w-14 shrink-0 rounded-full bg-white/70 flex items-center justify-center">
                <span className="relative h-7 w-7 block">
                  <Image src={`${ICONS}/${p.icono}`} alt="" fill sizes="28px" className="object-contain" unoptimized />
                </span>
              </span>
              <p className="text-sm font-medium text-carbon">
                {i + 1}. {p.titulo}
              </p>
              <p className="text-xs text-carbon/55">{p.texto}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <span className="relative h-5 w-5 shrink-0 opacity-70">
            <Image src={`${ICONS}/cal-icon-shield-check.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
          </span>
          <p className="text-xs text-carbon/50">
            Las calificaciones se publican cuando el cliente finaliza la valoración. Reviive no puede modificar las
            reseñas de los clientes.
          </p>
        </div>
      </section>
    </>
  );
}

export default function CalificacionesPage() {
  return (
    <ProveedorShell activeHref="/proveedor/calificaciones">
      <ContenidoCalificaciones />
    </ProveedorShell>
  );
}
