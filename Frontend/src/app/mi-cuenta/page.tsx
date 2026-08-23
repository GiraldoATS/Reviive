"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconMessage, IconStar, IconCheck } from "@/components/icons";

const ICONS = "/images/dashboard";

// Pasos reales que expone la API de pedidos (Pedido.Estado). No hay un paso
// "aprobado" separado en el backend, así que el stepper solo muestra los 6
// estados que de verdad existen.
const PASOS_PEDIDO = [
  { estado: "recibido", label: "Recibido" },
  { estado: "en_evaluacion", label: "Evaluado" },
  { estado: "en_proceso", label: "Restauración" },
  { estado: "control_de_calidad", label: "Calidad" },
  { estado: "en_camino", label: "En camino" },
  { estado: "entregado", label: "Entrega" },
] as const;

const ESTADO_LABEL: Record<string, string> = {
  recibido: "Recibido",
  en_evaluacion: "En evaluación",
  en_proceso: "En restauración",
  control_de_calidad: "En control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

interface ArchivoAPI {
  id: string;
  url: string;
}
interface ObjetoMemoriaAPI {
  id: string;
  tipo: string;
  estado?: string;
  archivos: ArchivoAPI[];
}
interface RecuerdoAPI {
  id: string;
  persona_recordada: string;
  objetos: ObjetoMemoriaAPI[];
  creado_en: string;
}
interface EventoPedidoAPI {
  id: string;
  estado: string;
  fecha: string;
  descripcion: string;
}
interface ResumenPedidoAPI {
  objeto?: string;
  historia?: string;
  proveedor?: string;
}
interface PedidoAPI {
  id: string;
  codigo: string;
  resumen: ResumenPedidoAPI | string | null;
  estado: string;
  eventos: EventoPedidoAPI[];
  creado_en: string;
}
interface RecomendacionAPI {
  id: string;
  titulo: string;
  justificacion: string;
  puntaje: number;
  producto?: { nombre?: string } | null;
}

function tituloPedido(pedido: PedidoAPI): string {
  if (typeof pedido.resumen === "string" && pedido.resumen) return pedido.resumen;
  if (pedido.resumen && typeof pedido.resumen === "object" && pedido.resumen.objeto) return pedido.resumen.objeto;
  return pedido.codigo;
}

function primeraFoto(recuerdo: RecuerdoAPI): string | null {
  for (const objeto of recuerdo.objetos ?? []) {
    const archivo = objeto.archivos?.[0];
    if (archivo?.url) return archivo.url;
  }
  return null;
}

function PanelVacio({
  icono,
  titulo,
  texto,
  boton,
  href,
}: {
  icono: string;
  titulo: string;
  texto: string;
  boton: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
      <h3 className="mb-5 inline-flex items-center gap-2 font-display text-xl text-borgona">
        {titulo}
        <span className="relative h-3 w-14 shrink-0">
          <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="56px" className="object-contain" />
        </span>
      </h3>
      <div className="flex flex-col items-center text-center gap-3">
        <span className="relative h-16 w-16 shrink-0 rounded-full bg-rosa/40 flex items-center justify-center">
          <Image src={`${ICONS}/${icono}`} alt="" fill sizes="64px" className="object-contain p-4" unoptimized />
        </span>
        <p className="text-sm text-carbon">{texto}</p>
        <Button href={href} variant="secondary" className="mt-1">
          {boton}
        </Button>
      </div>
    </div>
  );
}

function ContenidoMiCuenta() {
  const { accessToken, usuario } = useAuth();
  const [recuerdos, setRecuerdos] = useState<RecuerdoAPI[]>([]);
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionAPI[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  const nombre = usuario?.perfil?.nombre?.trim().split(" ")[0] || "";

  useEffect(() => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/memories/`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/orders/`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/recommendations/`, { headers }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([r, p, rec]) => {
        setRecuerdos(Array.isArray(r) ? r : (r.results ?? []));
        setPedidos(Array.isArray(p) ? p : (p.results ?? []));
        setRecomendaciones(Array.isArray(rec) ? rec : (rec.results ?? []));
      })
      .catch(() => {
        setRecuerdos([]);
        setPedidos([]);
        setRecomendaciones([]);
      })
      .finally(() => setCargandoDatos(false));
  }, [accessToken]);

  if (cargandoDatos) {
    return <div className="min-h-[60vh]" />;
  }

  const procesosActivos = pedidos.filter((p) => p.estado !== "entregado" && p.estado !== "cancelado");
  // No existe todavía un endpoint propio de "evaluaciones" en la API; como
  // aproximación honesta, contamos los pedidos que aún están en la etapa de
  // evaluación inicial.
  const evaluacionesEnCurso = pedidos.filter((p) => p.estado === "recibido" || p.estado === "en_evaluacion");
  const tieneInformacion = recuerdos.length > 0 || pedidos.length > 0;

  const stats = [
    { icono: "icon-caja-abierta.png", numero: recuerdos.length, label: "Recuerdos registrados", verLabel: "Ver recuerdos", href: "/mis-recuerdos" },
    { icono: "icon-clipboard-lista.png", numero: evaluacionesEnCurso.length, label: evaluacionesEnCurso.length === 1 ? "Evaluación en curso" : "Evaluaciones en curso", verLabel: "Ver evaluaciones", href: "/evaluaciones" },
    { icono: "icon-hourglass.png", numero: procesosActivos.length, label: procesosActivos.length === 1 ? "Proceso activo" : "Procesos activos", verLabel: "Ver procesos", href: "/mis-procesos" },
    { icono: "icon-bell.png", numero: 0, label: "Pendientes", verLabel: "Ver pendientes", href: "/pendientes" },
  ];

  const procesoDestacado = procesosActivos[0] ?? null;
  const pasoActualIdx = procesoDestacado
    ? Math.max(0, PASOS_PEDIDO.findIndex((p) => p.estado === procesoDestacado.estado))
    : 0;
  const ultimoEvento = procesoDestacado?.eventos?.[procesoDestacado.eventos.length - 1] ?? null;
  const recomendacionDestacada = recomendaciones[0] ?? null;

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>

        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            {tieneInformacion ? (
              <>
                <h1 className="font-display text-4xl text-carbon">Hola, {nombre || "de nuevo"}</h1>
                <p className="mt-1 font-display text-xl text-dorado-suave">¿Qué recuerdo quieres cuidar hoy?</p>
              </>
            ) : (
              <>
                <h1 className="font-display text-4xl text-carbon">Bienvenida, {nombre || "de nuevo"}</h1>
                <p className="mt-1 font-display text-xl text-dorado-suave">Tu historia con Reviive comienza aquí.</p>
              </>
            )}
            <p className="mt-4 text-sm text-carbon/70 max-w-sm">
              Cada objeto guarda una historia única.
              <br />
              Estamos aquí para ayudarte a conservarla.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/recuerdos/nuevo" variant="primary" className="inline-flex items-center gap-2">
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={`${ICONS}/icon-hourglass.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                {tieneInformacion ? "Solicitar una evaluación" : "Solicitar mi primera evaluación"}
              </Button>
              {!tieneInformacion && (
                <Button href="/mis-recuerdos/nuevo" variant="secondary" className="inline-flex items-center gap-2">
                  <span className="relative h-4 w-4 shrink-0">
                    <Image src={`${ICONS}/icon-caja-cerrada.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </span>
                  Registrar mi primer recuerdo
                </Button>
              )}
              <Button href="/chat" variant="secondary" className="inline-flex items-center gap-2">
                <IconMessage className="h-4 w-4" />
                Hablar con Alma
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block min-h-[320px]">
            <Image src={`${ICONS}/hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-start gap-4">
            <span className="relative h-12 w-12 shrink-0 rounded-full bg-rosa/40 flex items-center justify-center">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="48px" className="object-contain p-3" unoptimized />
            </span>
            <div>
              <p className="font-display text-2xl text-carbon leading-none">{s.numero}</p>
              <p className="mt-1 text-sm text-carbon/70">{s.label}</p>
              <Link href={s.href} className="mt-1 inline-block text-sm text-borgona hover:text-borgona-dark transition-colors">
                {s.verLabel} →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {tieneInformacion ? (
        <section className="mx-auto max-w-6xl w-full px-6 pb-16 grid lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-carbon">Mis procesos activos</h3>
              <Link href="/mis-procesos" className="text-sm text-borgona hover:text-borgona-dark transition-colors">Ver todos →</Link>
            </div>

            {procesoDestacado ? (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg text-carbon">{tituloPedido(procesoDestacado)}</p>
                  <span className="rounded-full bg-rosa/40 px-3 py-1 text-xs text-borgona-dark">
                    {ESTADO_LABEL[procesoDestacado.estado] ?? procesoDestacado.estado}
                  </span>
                </div>

                <div className="relative mt-6 flex justify-between">
                  <div className="absolute left-0 right-0 top-2.5 h-px bg-greige/60" />
                  {PASOS_PEDIDO.map((paso, i) => (
                    <div key={paso.estado} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          i < pasoActualIdx
                            ? "bg-borgona border-borgona text-marfil"
                            : i === pasoActualIdx
                              ? "bg-marfil border-borgona"
                              : "bg-marfil border-greige/60"
                        }`}
                      >
                        {i < pasoActualIdx && <IconCheck className="h-2.5 w-2.5" />}
                      </span>
                      <span className="text-[10px] text-carbon/60 text-center">{paso.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-4 text-xs text-carbon/55 border-t border-greige/50 pt-4">
                  <span>Código: {procesoDestacado.codigo}</span>
                  {ultimoEvento && <span>Última actualización: {new Date(ultimoEvento.fecha).toLocaleDateString("es-CO")}</span>}
                </div>

                <div className="mt-4 flex gap-3">
                  <Button href={`/pedido/${procesoDestacado.id}`} variant="secondary">Ver proceso</Button>
                  <Button href="/chat" variant="primary" className="inline-flex items-center gap-2">
                    <IconMessage className="h-4 w-4" />
                    Hablar con Alma
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-carbon/60">No tienes procesos activos en este momento.</p>
            )}
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-carbon">Mis recuerdos</h3>
              <Link href="/mis-recuerdos" className="text-sm text-borgona hover:text-borgona-dark transition-colors">Ver todos →</Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {recuerdos.slice(0, 3).map((r) => {
                const foto = primeraFoto(r);
                const estado = r.objetos?.[0]?.estado;
                return (
                  <div key={r.id}>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-greige/20">
                      {foto ? (
                        <Image src={foto} alt="" fill sizes="120px" className="object-cover" unoptimized />
                      ) : (
                        <span className="relative h-full w-full block p-6 opacity-40">
                          <Image src={`${ICONS}/icon-caja-abierta.png`} alt="" fill sizes="80px" className="object-contain" unoptimized />
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-carbon truncate">{r.persona_recordada || "Recuerdo"}</p>
                    {estado && (
                      <p className="text-[10px] text-carbon/50 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-dorado-suave" />
                        {estado}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <Button href="/mis-recuerdos/nuevo" variant="secondary" className="mt-5 w-full justify-center">
              + Registrar un nuevo recuerdo
            </Button>
          </div>

          {recomendacionDestacada ? (
            <div className="rounded-2xl border border-emerald-700/20 bg-emerald-700/5 p-6">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg text-emerald-800">Recomendación disponible</h3>
                <span className="relative h-9 w-9 shrink-0 rounded-full bg-white flex items-center justify-center">
                  <IconStar className="h-4 w-4 text-emerald-700" />
                </span>
              </div>
              <p className="mt-2 text-sm text-carbon/70">
                Tenemos una recomendación para tu recuerdo
              </p>
              <p className="mt-2 font-display text-xl text-carbon">{recomendacionDestacada.titulo}</p>
              <p className="mt-2 text-sm text-carbon/70">{recomendacionDestacada.justificacion}</p>
              <p className="mt-3 text-xs text-carbon/50">Coincidencia: {Math.round(recomendacionDestacada.puntaje * 100)}%</p>
              <Button href="/mis-recuerdos" variant="primary" className="mt-4 w-full justify-center">
                Ver propuesta →
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl text-borgona">Alma</h3>
                  <p className="text-xs text-carbon/60">Tu asistente de confianza</p>
                </div>
                <span className="relative h-9 w-9 shrink-0 rounded-full bg-greige/30 flex items-center justify-center">
                  <Image src={`${ICONS}/icon-sparkle.png`} alt="" fill sizes="36px" className="object-contain p-2" unoptimized />
                </span>
              </div>
              <p className="mt-4 text-sm text-carbon/70">
                Cuéntame si necesitas ayuda con alguno de tus procesos o recuerdos.
              </p>
              <Link href="/chat" className="mt-auto pt-4 text-center text-sm text-borgona hover:text-borgona-dark transition-colors">
                Hablar con Alma →
              </Link>
            </div>
          )}
        </section>
      ) : (
        <section className="mx-auto max-w-6xl w-full px-6 pb-16 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <PanelVacio
              icono="icon-caja-abierta.png"
              titulo="Mis recuerdos"
              texto="Aún no has registrado recuerdos. Guarda aquí la información de objetos que hacen parte de tu historia."
              boton="+ Registrar recuerdo"
              href="/mis-recuerdos/nuevo"
            />
            <PanelVacio
              icono="icon-clipboard-lista.png"
              titulo="Mis evaluaciones"
              texto="Todavía no has solicitado ninguna evaluación. Nuestros expertos pueden ayudarte a encontrar la mejor alternativa para conservar tu objeto."
              boton="Solicitar evaluación"
              href="/recuerdos/nuevo"
            />
            <PanelVacio
              icono="icon-hourglass.png"
              titulo="Mis procesos"
              texto="Cuando apruebes una evaluación, podrás seguir aquí cada etapa de tu proceso de conservación."
              boton="Ver cómo funciona"
              href="/preguntas-frecuentes"
            />
            <PanelVacio
              icono="icon-truck.png"
              titulo="Envíos y entregas"
              texto="Aquí verás el estado de tus envíos y entregas cuando inicies algún proceso."
              boton="Más información"
              href="/envios-entregas"
            />
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl text-borgona">Alma</h3>
                <p className="text-xs text-carbon/60">Tu asistente de confianza</p>
              </div>
              <span className="relative h-9 w-9 shrink-0 rounded-full bg-greige/30 flex items-center justify-center">
                <Image src={`${ICONS}/icon-sparkle.png`} alt="" fill sizes="36px" className="object-contain p-2" unoptimized />
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-greige/20 p-4 text-sm text-carbon/80">
              Hola {nombre || ""},
              <br />
              <br />
              Estoy aquí para ayudarte a comenzar. Cuéntame qué objeto quieres conservar y qué significado tiene
              para ti.
            </div>

            <div className="mt-4 space-y-1">
              {[
                { icono: "icon-chat-dots.png", label: "Hablar con Alma", href: "/chat" },
                { icono: "icon-tag.png", label: "¿Cómo funciona una evaluación?", href: "/preguntas-frecuentes" },
                { icono: "icon-mappin.png", label: "Consejos para cuidar recuerdos", href: "/preguntas-frecuentes" },
              ].map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-carbon/75 hover:bg-greige/20 transition-colors"
                >
                  <span className="relative h-4 w-4 shrink-0">
                    <Image src={`${ICONS}/${q.icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                  </span>
                  <span className="flex-1">{q.label}</span>
                  <span className="text-dorado-suave">→</span>
                </Link>
              ))}
            </div>

            <Link href="/chat" className="mt-auto pt-4 text-center text-sm text-borgona hover:text-borgona-dark transition-colors">
              Ver más conversaciones →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

export default function MiCuentaPage() {
  return (
    <ClienteShell activeHref="/mi-cuenta">
      <ContenidoMiCuenta />
    </ClienteShell>
  );
}
