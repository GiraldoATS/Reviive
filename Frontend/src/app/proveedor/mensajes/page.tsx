"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";

const ICONS = "/images/proveedor";

// No existe ningún backend real de mensajería proveedor↔cliente: el
// único modelo de conversaciones (`apps/conversations`) es exclusivo
// del asistente Alma (un usuario chateando con IA/staff), sin relación
// a Pedido, Cotizacion o Proveedor, y un proveedor no puede acceder a
// esas conversaciones. Por eso, igual que Solicitudes, Evidencias,
// Calificaciones e Ingresos, esta vista es contenido de ejemplo.

const stats = [
  { icono: "msg-icon-chat-dots.png", numero: 3, label: "mensajes sin leer", nota: "Tienes mensajes nuevos" },
  { icono: "msg-icon-people.png", numero: 2, label: "conversaciones activas", nota: "En curso" },
  { icono: "msg-icon-hourglass.png", numero: 1, label: "requiere respuesta", nota: "Pendiente de tu acción" },
  { icono: "msg-icon-shield-check.png", numero: 0, label: "incidencias abiertas", nota: "Todo al día" },
];

const filtros = [
  { id: "todos", label: "Todos" },
  { id: "sin_leer", label: "Sin leer" },
  { id: "solicitudes", label: "Solicitudes" },
  { id: "cotizaciones", label: "Cotizaciones" },
  { id: "pedidos", label: "Pedidos" },
  { id: "reviive", label: "Reviive" },
] as const;

interface MensajeEjemplo {
  id: string;
  rol: "cliente" | "proveedor" | "reviive";
  autor: string;
  hora: string;
  texto: string;
}

interface ConversacionEjemplo {
  id: string;
  nombre: string;
  avatar?: string;
  asunto: string;
  etiqueta: string;
  categoria: "solicitudes" | "cotizaciones" | "pedidos" | "reviive";
  preview: string;
  tiempo: string;
  noLeido: boolean;
  esSistema?: boolean;
  pedido?: { codigo: string; titulo: string; icono: string; servicio: string; estado: string; valor: string; entrega: string };
  mensajes: MensajeEjemplo[];
}

const CONVERSACIONES: ConversacionEjemplo[] = [
  {
    id: "1",
    nombre: "Familia Ramírez",
    asunto: "Reloj de bolsillo familiar",
    etiqueta: "Pedido #PED-00128",
    categoria: "pedidos",
    preview: "Nuevo mensaje",
    tiempo: "15 min",
    noLeido: true,
    pedido: {
      codigo: "PED-00128",
      titulo: "Reloj de bolsillo familiar",
      icono: "sol-icon-clock.png",
      servicio: "Restauración",
      estado: "En proceso",
      valor: "$850.000 COP",
      entrega: "18 sep 2026",
    },
    mensajes: [
      { id: "m1", rol: "cliente", autor: "Familia Ramírez", hora: "10:32 a. m.", texto: "¿Es posible conservar el cristal original del reloj?" },
      { id: "m2", rol: "proveedor", autor: "María Hernández", hora: "10:48 a. m.", texto: "Sí. Durante la revisión intentaremos conservarlo siempre que su estado permita una intervención segura." },
      { id: "m3", rol: "cliente", autor: "Familia Ramírez", hora: "11:05 a. m.", texto: "Perfecto, muchas gracias. Quedamos atentos." },
      { id: "m4", rol: "proveedor", autor: "María Hernández", hora: "11:12 a. m.", texto: "Con gusto. Te mantendremos informado en cada paso del proceso." },
      { id: "m5", rol: "reviive", autor: "Equipo Reviive", hora: "11:30 a. m.", texto: "Recordatorio: por favor comparte evidencias visuales del estado actual del objeto antes de iniciar el trabajo." },
    ],
  },
  {
    id: "2",
    nombre: "Equipo Reviive",
    asunto: "Cotización #COT-00127",
    etiqueta: "Cotización #COT-00127",
    categoria: "cotizaciones",
    preview: "Necesitamos confirmar el plazo...",
    tiempo: "Ayer",
    noLeido: true,
    esSistema: true,
    mensajes: [
      { id: "m1", rol: "reviive", autor: "Equipo Reviive", hora: "Ayer · 4:10 p. m.", texto: "Necesitamos confirmar el plazo de entrega propuesto en la cotización #COT-00127 antes de enviarla al cliente." },
    ],
  },
  {
    id: "3",
    nombre: "Lucía Torres",
    asunto: "Álbum de fotos antiguo",
    etiqueta: "Solicitud #SOL-00127",
    categoria: "solicitudes",
    preview: "Gracias, quedo atenta.",
    tiempo: "2 días",
    noLeido: false,
    mensajes: [
      { id: "m1", rol: "cliente", autor: "Lucía Torres", hora: "hace 2 días", texto: "¿Cuánto tiempo tomaría restaurar el álbum completo?" },
      { id: "m2", rol: "proveedor", autor: "María Hernández", hora: "hace 2 días", texto: "Aproximadamente 3 semanas, dependiendo del estado de las páginas." },
      { id: "m3", rol: "cliente", autor: "Lucía Torres", hora: "hace 2 días", texto: "Gracias, quedo atenta." },
    ],
  },
  {
    id: "4",
    nombre: "Carlos Mejía",
    asunto: "Baúl de madera heredado",
    etiqueta: "Pedido #PED-00117",
    categoria: "pedidos",
    preview: "¿Podemos revisar el envío?",
    tiempo: "3 días",
    noLeido: false,
    mensajes: [
      { id: "m1", rol: "cliente", autor: "Carlos Mejía", hora: "hace 3 días", texto: "¿Podemos revisar el envío? Quiero confirmar la dirección de entrega." },
    ],
  },
  {
    id: "5",
    nombre: "Equipo Reviive",
    asunto: "Información importante",
    etiqueta: "Reviive",
    categoria: "reviive",
    preview: "Recuerda actualizar tus tiempos...",
    tiempo: "4 días",
    noLeido: false,
    esSistema: true,
    mensajes: [
      { id: "m1", rol: "reviive", autor: "Equipo Reviive", hora: "hace 4 días", texto: "Recuerda actualizar tus tiempos de entrega en la sección de Capacidad para reflejar tu disponibilidad real." },
    ],
  },
  {
    id: "6",
    nombre: "Andrea Gómez",
    asunto: "Cuadro al óleo antiguo",
    etiqueta: "Solicitud #SOL-00125",
    categoria: "solicitudes",
    preview: "Envío más fotografías.",
    tiempo: "5 días",
    noLeido: false,
    mensajes: [
      { id: "m1", rol: "cliente", autor: "Andrea Gómez", hora: "hace 5 días", texto: "Envío más fotografías del cuadro para que puedan evaluarlo mejor." },
    ],
  },
  {
    id: "7",
    nombre: "Equipo Reviive",
    asunto: "Nuevo pedido disponible",
    etiqueta: "Reviive",
    categoria: "reviive",
    preview: "Tienes una nueva solicitud compatible...",
    tiempo: "1 semana",
    noLeido: false,
    esSistema: true,
    mensajes: [
      { id: "m1", rol: "reviive", autor: "Equipo Reviive", hora: "hace 1 semana", texto: "Tienes una nueva solicitud compatible con tu taller. Revísala en la sección de Solicitudes." },
    ],
  },
];

const consejos = [
  { icono: "msg-icon-medal.png", texto: "Mantén toda la comunicación dentro de Reviive." },
  { icono: "msg-icon-shield-check.png", texto: "Responde a tiempo para ofrecer la mejor experiencia." },
  { icono: "msg-icon-clipboard-check.png", texto: "Usa las acciones rápidas para gestionar la información." },
];

const canales = [
  { icono: "msg-icon-shield-check.png", titulo: "Comunicación segura", texto: "Los datos de contacto de los clientes se mantienen protegidos." },
  { icono: "msg-icon-clipboard-checklist.png", titulo: "Todo con contexto", texto: "Cada conversación está asociada a un proceso específico." },
  { icono: "msg-icon-trend-up.png", titulo: "Trazabilidad completa", texto: "Todos los mensajes quedan registrados para tu seguridad y la del cliente." },
];

function BurbujaMensaje({ m }: { m: MensajeEjemplo }) {
  const esProveedor = m.rol === "proveedor";
  const esReviive = m.rol === "reviive";
  return (
    <div className={`flex ${esProveedor ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${esProveedor ? "items-end" : "items-start"} flex flex-col`}>
        <p className="text-[11px] text-carbon/40 mb-1">{m.autor} · {m.hora}</p>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm ${
            esReviive
              ? "bg-dorado-suave/15 text-borgona-dark"
              : esProveedor
                ? "bg-borgona text-marfil"
                : "bg-white/80 text-carbon/80"
          }`}
        >
          {m.texto}
        </div>
      </div>
    </div>
  );
}

function ContenidoMensajes() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionId, setSeleccionId] = useState(CONVERSACIONES[0].id);
  const [borrador, setBorrador] = useState("");
  const [extras, setExtras] = useState<Record<string, MensajeEjemplo[]>>({});

  const visibles = useMemo(() => {
    return CONVERSACIONES.filter((c) => {
      if (filtro === "sin_leer" && !c.noLeido) return false;
      if (filtro !== "todos" && filtro !== "sin_leer" && c.categoria !== filtro) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        return c.nombre.toLowerCase().includes(q) || c.asunto.toLowerCase().includes(q);
      }
      return true;
    });
  }, [filtro, busqueda]);

  const activa = CONVERSACIONES.find((c) => c.id === seleccionId) ?? CONVERSACIONES[0];
  const hilo = [...activa.mensajes, ...(extras[activa.id] ?? [])];

  function enviar() {
    if (!borrador.trim()) return;
    const nuevo: MensajeEjemplo = {
      id: `local-${Date.now()}`,
      rol: "proveedor",
      autor: "María Hernández",
      hora: "Ahora",
      texto: borrador.trim(),
    };
    setExtras((prev) => ({ ...prev, [activa.id]: [...(prev[activa.id] ?? []), nuevo] }));
    setBorrador("");
  }

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-4">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Mensajes</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Consulta conversaciones relacionadas con tus solicitudes, cotizaciones y pedidos, y mantén toda la
              comunicación centralizada en Reviive.
            </p>
          </div>
          <div
            className="relative hidden lg:block h-52 w-36 mx-auto"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
            }}
          >
            <Image src={`${ICONS}/msg-hero.png`} alt="" fill sizes="144px" className="object-cover" unoptimized />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
            <span className="relative h-11 w-11 block">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="44px" className="object-contain" unoptimized />
            </span>
            <p className="mt-2 font-display text-xl text-carbon">{s.numero}</p>
            <p className="mt-0.5 text-xs text-carbon/60">{s.label}</p>
            <p className="mt-1 text-[11px] text-carbon/40">{s.nota}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
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
          <span
            className="inline-flex items-center gap-2 rounded-full border border-borgona text-borgona px-4 py-2 text-sm cursor-default"
            title="Próximamente"
          >
            Nueva conversación
          </span>
        </div>

        <div className="mt-5 grid lg:grid-cols-[280px_1fr_260px] gap-4 items-start">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3">
            <div className="relative mb-2">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar conversación..."
                className="w-full rounded-xl border border-greige/70 bg-white/70 pl-3 pr-3 py-2 text-xs outline-none focus:border-borgona/50"
              />
            </div>
            <div className="space-y-1 max-h-[520px] overflow-y-auto">
              {visibles.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSeleccionId(c.id)}
                  className={`w-full text-left rounded-xl p-2.5 transition-colors ${
                    seleccionId === c.id ? "bg-white/80" : "hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="relative h-9 w-9 shrink-0 rounded-full bg-borgona/10 flex items-center justify-center overflow-hidden">
                      <span className="relative h-5 w-5 block">
                        <Image
                          src={`${ICONS}/${c.esSistema ? "msg-icon-shield-check.png" : "msg-icon-person-circle.png"}`}
                          alt=""
                          fill
                          sizes="20px"
                          className="object-contain"
                          unoptimized
                        />
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-medium text-carbon truncate">{c.nombre}</p>
                        {c.noLeido && <span className="h-2 w-2 rounded-full bg-borgona shrink-0" />}
                      </div>
                      <p className="text-xs text-carbon/60 truncate">{c.asunto}</p>
                      <p className="text-[11px] text-borgona-dark truncate">{c.etiqueta}</p>
                      <p className="text-[11px] text-carbon/45 truncate">{c.preview}</p>
                    </div>
                    <span className="text-[10px] text-carbon/35 shrink-0">{c.tiempo}</span>
                  </div>
                </button>
              ))}
              {visibles.length === 0 && (
                <p className="text-center text-xs text-carbon/45 py-6">No hay conversaciones en este filtro.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 flex flex-col h-[600px]">
            <div className="p-4 border-b border-greige/40">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg text-carbon">{activa.asunto}</p>
                <span className="text-carbon/40 text-sm cursor-default" title="Próximamente">⋯</span>
              </div>
              <p className="text-xs text-carbon/50">{activa.etiqueta}</p>
              {activa.pedido && (
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-carbon/60">
                  <span>Cliente: {activa.nombre}</span>
                  <span className="rounded-full bg-dorado-suave/20 text-borgona-dark px-2.5 py-0.5">{activa.pedido.estado}</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {hilo.map((m) => (
                <BurbujaMensaje key={m.id} m={m} />
              ))}
            </div>

            <div className="p-3 border-t border-greige/40">
              <textarea
                rows={2}
                value={borrador}
                onChange={(e) => setBorrador(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviar();
                  }
                }}
                placeholder="Escribe tu mensaje..."
                className="w-full rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50 resize-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-carbon/35 cursor-default" title="Próximamente">📎 Adjuntar archivo</span>
                <button
                  type="button"
                  onClick={enviar}
                  className="rounded-full bg-borgona text-marfil px-5 py-2 text-sm hover:bg-borgona-dark transition-colors"
                >
                  Enviar mensaje
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {activa.pedido && (
              <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
                <h3 className="font-display text-sm text-borgona">Pedido relacionado</h3>
                <div className="mt-2 flex items-start gap-3">
                  <span className="relative h-12 w-12 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                    <span className="relative h-6 w-6 block">
                      <Image src={`${ICONS}/${activa.pedido.icono}`} alt="" fill sizes="24px" className="object-contain" unoptimized />
                    </span>
                  </span>
                  <div className="text-xs">
                    <p className="font-medium text-carbon">{activa.pedido.codigo}</p>
                    <p className="text-carbon/60">{activa.pedido.titulo}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-carbon/60">
                  <li>Servicio: <span className="text-carbon">{activa.pedido.servicio}</span></li>
                  <li>Valor: <span className="text-carbon">{activa.pedido.valor}</span></li>
                  <li>Entrega estimada: <span className="text-carbon">{activa.pedido.entrega}</span></li>
                </ul>
                <span className="mt-3 inline-flex items-center justify-center rounded-full border border-borgona text-borgona px-3 py-1.5 text-xs w-full cursor-default" title="Próximamente">
                  Ver pedido
                </span>
              </div>
            )}

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
              <h3 className="font-display text-sm text-borgona">Acciones rápidas</h3>
              <ul className="mt-2 space-y-2 text-xs">
                {[
                  { icono: "msg-icon-clipboard-check.png", texto: "Solicitar información" },
                  { icono: "msg-icon-bell.png", texto: "Reportar novedad" },
                  { icono: "msg-icon-box.png", texto: "Adjuntar evidencia" },
                ].map((a) => (
                  <li key={a.texto} className="flex items-center gap-2 cursor-default text-carbon/70" title="Próximamente">
                    <span className="relative h-4 w-4 shrink-0">
                      <Image src={`${ICONS}/${a.icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                    </span>
                    {a.texto}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-4">
              <h3 className="font-display text-sm text-borgona">Consejos</h3>
              <ul className="mt-2 space-y-2 text-xs text-carbon/65">
                {consejos.map((c) => (
                  <li key={c.texto} className="flex items-start gap-2">
                    <span className="relative h-4 w-4 shrink-0 mt-0.5">
                      <Image src={`${ICONS}/${c.icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                    </span>
                    {c.texto}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pb-16">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <h3 className="font-display text-lg text-borgona text-center">Canales de comunicación seguros</h3>
          <p className="text-center text-sm text-carbon/60">En Reviive protegemos la información de todos.</p>
          <div className="mt-5 grid sm:grid-cols-3 gap-5">
            {canales.map((c) => (
              <div key={c.titulo} className="flex items-start gap-3">
                <span className="relative h-9 w-9 shrink-0">
                  <Image src={`${ICONS}/${c.icono}`} alt="" fill sizes="36px" className="object-contain" unoptimized />
                </span>
                <div>
                  <p className="text-sm font-medium text-carbon">{c.titulo}</p>
                  <p className="text-xs text-carbon/55">{c.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function MensajesPage() {
  return (
    <ProveedorShell activeHref="/proveedor/mensajes">
      <ContenidoMensajes />
    </ProveedorShell>
  );
}
