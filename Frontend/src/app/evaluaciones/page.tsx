"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconMessage, IconChevronDown } from "@/components/icons";

const ICONS = "/images/evaluaciones";

const beneficios = [
  { icono: "icon-person.png", titulo: "Acompañamiento experto", texto: "Nuestros especialistas te guían en cada paso del proceso." },
  { icono: "icon-star.png", titulo: "Recomendaciones personalizadas", texto: "Recibe propuestas pensadas para cada objeto y su historia." },
  { icono: "icon-clipboard-list.png", titulo: "Seguimiento claro", texto: "Consulta el estado de cada solicitud de forma sencilla y organizada." },
  { icono: "icon-shield-check-gold.png", titulo: "Decisiones con confianza", texto: "Toma la mejor decisión con información clara y honesta." },
];

const pasos = [
  "Nos envías la información de tu objeto.",
  "Nuestros expertos lo revisan y analizan.",
  "Te entregamos una recomendación clara.",
  "Tú decides cuándo iniciar el proceso.",
];

const filtros = [
  { id: "todas", label: "Todas", icono: "icon-box.png" },
  { id: "recibido", label: "Solicitadas", icono: "icon-hourglass.png" },
  { id: "en_evaluacion", label: "En revisión", icono: "icon-magnifier.png" },
  { id: "en_proceso", label: "Propuesta enviada", icono: "icon-paperplane.png" },
  { id: "aprobada", label: "Aprobadas", icono: "icon-shield-check.png" },
] as const;

const ESTADO_INFO: Record<string, { label: string; clase: string; detalle: string }> = {
  recibido: { label: "Solicitud recibida", clase: "bg-dorado-suave/15 text-borgona-dark", detalle: "Recibimos tu solicitud y pronto la asignaremos a un especialista." },
  en_evaluacion: { label: "En revisión", clase: "bg-blue-50 text-blue-700", detalle: "Estamos revisando tu objeto y la información enviada." },
  en_proceso: { label: "Propuesta enviada", clase: "bg-emerald-50 text-emerald-700", detalle: "Ya tienes una propuesta de restauración disponible." },
  control_de_calidad: { label: "Aprobada", clase: "bg-purple-50 text-purple-700", detalle: "Tu objeto está en control de calidad." },
  en_camino: { label: "Aprobada", clase: "bg-purple-50 text-purple-700", detalle: "Tu objeto va en camino de regreso." },
  entregado: { label: "Aprobada", clase: "bg-purple-50 text-purple-700", detalle: "El proceso se completó y tu objeto fue entregado." },
  cancelado: { label: "Descartada", clase: "bg-greige/40 text-carbon/60", detalle: "Decidiste no continuar con esta evaluación." },
};

function categoriaDe(estado: string): (typeof filtros)[number]["id"] | "otra" {
  if (estado === "recibido") return "recibido";
  if (estado === "en_evaluacion") return "en_evaluacion";
  if (estado === "en_proceso") return "en_proceso";
  if (estado === "control_de_calidad" || estado === "en_camino" || estado === "entregado") return "aprobada";
  return "otra";
}

interface ArchivoAPI { id: string; url: string; }
interface ObjetoMemoriaAPI { id: string; archivos: ArchivoAPI[]; }
interface RecuerdoAPI { id: string; persona_recordada: string; objetos: ObjetoMemoriaAPI[]; }
interface ResumenPedidoAPI { objeto?: string; historia?: string; proveedor?: string; recuerdo_id?: string; }
interface PedidoAPI {
  id: string;
  codigo: string;
  resumen: ResumenPedidoAPI | string | null;
  estado: string;
  creado_en: string;
}

function tituloPedido(p: PedidoAPI): string {
  if (typeof p.resumen === "string" && p.resumen) return p.resumen;
  if (p.resumen && typeof p.resumen === "object" && p.resumen.objeto) return p.resumen.objeto;
  return p.codigo;
}

function fotoDe(p: PedidoAPI, recuerdos: RecuerdoAPI[]): string | null {
  const recuerdoId = typeof p.resumen === "object" ? p.resumen?.recuerdo_id : null;
  const recuerdo = recuerdoId ? recuerdos.find((r) => r.id === recuerdoId) : null;
  for (const objeto of recuerdo?.objetos ?? []) {
    const archivo = objeto.archivos?.[0];
    if (archivo?.url) return archivo.url;
  }
  return null;
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function ContenidoEvaluaciones() {
  const { accessToken } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [recuerdos, setRecuerdos] = useState<RecuerdoAPI[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todas");

  useEffect(() => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/orders/`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/memories/`, { headers }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([p, r]) => {
        setPedidos(Array.isArray(p) ? p : (p.results ?? []));
        setRecuerdos(Array.isArray(r) ? r : (r.results ?? []));
      })
      .catch(() => {
        setPedidos([]);
        setRecuerdos([]);
      })
      .finally(() => setCargandoDatos(false));
  }, [accessToken]);

  if (cargandoDatos) {
    return <div className="min-h-[60vh]" />;
  }

  const tieneEvaluaciones = pedidos.length > 0;
  const visibles = filtro === "todas" ? pedidos : pedidos.filter((p) => categoriaDe(p.estado) === filtro);

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>
        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-6 py-12 lg:pl-16">
            <h1 className="font-display text-4xl text-carbon">Mis evaluaciones</h1>
            <p className="mt-1 font-display text-lg text-dorado-suave max-w-sm">
              Aquí puedes consultar el análisis y las recomendaciones que hemos preparado para tus recuerdos.
            </p>
            <Button href="/recuerdos/nuevo" variant="primary" className="mt-6 inline-flex items-center gap-2">
              + Solicitar una nueva evaluación
            </Button>
          </div>
          <div className="relative hidden lg:block min-h-[280px]">
            <Image src={`${ICONS}/hero.png`} alt="" fill sizes="45vw" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-greige/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filtros.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiltro(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  filtro === f.id ? "bg-borgona text-marfil" : "bg-white/70 text-carbon/70 hover:bg-white"
                }`}
              >
                <span className="relative h-3.5 w-3.5 shrink-0">
                  <Image src={`${ICONS}/${f.icono}`} alt="" fill sizes="14px" className="object-contain" unoptimized />
                </span>
                {f.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-greige/60 bg-white/70 px-4 py-2 text-sm text-carbon/70"
          >
            Más recientes
            <IconChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8 grid lg:grid-cols-[1fr_300px] gap-6">
        <div>
          {tieneEvaluaciones ? (
            <div className="space-y-4">
              {visibles.map((p) => {
                const info = ESTADO_INFO[p.estado] ?? { label: p.estado, clase: "bg-greige/40 text-carbon/60", detalle: "" };
                const foto = fotoDe(p, recuerdos);
                const proveedor = typeof p.resumen === "object" ? p.resumen?.proveedor : null;
                return (
                  <div key={p.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-greige/30">
                      {foto ? (
                        <Image src={foto} alt="" fill sizes="96px" className="object-cover" unoptimized />
                      ) : (
                        <span className="relative h-full w-full block p-5 opacity-40">
                          <Image src={`${ICONS}/icon-clipboard-sparkle.png`} alt="" fill sizes="56px" className="object-contain" unoptimized />
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-carbon">{tituloPedido(p)}</h3>
                      <p className="text-xs text-carbon/55">Solicitud enviada: {fechaCorta(p.creado_en)}</p>
                      {proveedor && <p className="text-xs text-carbon/55">Taller sugerido: {proveedor}</p>}
                    </div>
                    <div className="sm:w-56 shrink-0">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs ${info.clase}`}>{info.label}</span>
                      <p className="mt-2 text-xs text-carbon/60">{info.detalle}</p>
                      <Link
                        href={`/pedido/${p.id}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm text-borgona hover:text-borgona-dark transition-colors"
                      >
                        Ver evaluación →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-greige/50 bg-greige/20 p-10 text-center">
              <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 hidden h-64 w-56 opacity-30 md:block">
                <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
              </div>
              <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 hidden h-64 w-56 opacity-30 md:block -scale-x-100">
                <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
              </div>
              <span className="relative h-28 w-28 mx-auto block rounded-full bg-rosa/40">
                <Image src={`${ICONS}/icon-clipboard-sparkle.png`} alt="" fill sizes="112px" className="object-contain p-7" unoptimized />
              </span>
              <h2 className="mt-5 font-display text-2xl text-carbon">Aún no has solicitado evaluaciones.</h2>
              <div className="mt-2 flex items-center justify-center gap-2 text-dorado-suave">
                <span className="h-px w-10 bg-dorado-suave/40" />♡<span className="h-px w-10 bg-dorado-suave/40" />
              </div>
              <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
                Cuando quieras conservar un recuerdo, aquí podrás seguir cada solicitud, revisar recomendaciones y
                decidir el siguiente paso.
              </p>
              <Button href="/recuerdos/nuevo" variant="primary" className="mt-5 inline-flex items-center gap-2">
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={`${ICONS}/icon-hourglass.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                Solicitar mi primera evaluación
              </Button>
              <p className="mt-3">
                <Link href="/preguntas-frecuentes" className="text-sm text-borgona hover:text-borgona-dark transition-colors">
                  ¿Cómo funciona una evaluación? →
                </Link>
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-lg text-carbon">¿Cómo funciona una evaluación?</h3>
            <span className="relative mt-1 mb-3 block h-3 w-14">
              <Image src="/images/branch-sprig-v3.png" alt="" fill sizes="56px" className="object-contain" />
            </span>
            <ol className="space-y-2.5">
              {pasos.map((paso, i) => (
                <li key={paso} className="flex items-start gap-2.5 text-sm text-carbon/70">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-borgona text-[10px] text-marfil">
                    {i + 1}
                  </span>
                  {paso}
                </li>
              ))}
            </ol>
            <Button href="/preguntas-frecuentes" variant="secondary" className="mt-4 w-full justify-center">
              Más información
            </Button>
          </div>

          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="font-display text-lg text-borgona inline-flex items-center gap-2">
              <IconMessage className="h-4 w-4" />
              Hablar con Alma
            </h3>
            <p className="mt-2 text-sm text-carbon/70">
              Alma puede ayudarte a entender tu evaluación o resolver tus dudas.
            </p>
            <Link href="/chat" className="mt-2 inline-flex items-center gap-1.5 text-sm text-borgona hover:text-borgona-dark transition-colors">
              Iniciar conversación →
            </Link>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pb-16">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {beneficios.map((b) => (
            <div key={b.titulo}>
              <span className="relative h-12 w-12 mx-auto block rounded-full bg-rosa/40">
                <Image src={`${ICONS}/${b.icono}`} alt="" fill sizes="48px" className="object-contain p-3" unoptimized />
              </span>
              <h3 className="mt-2 font-display text-sm text-borgona">{b.titulo}</h3>
              <p className="mt-1 text-xs text-carbon/60">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function EvaluacionesPage() {
  return (
    <ClienteShell activeHref="/evaluaciones">
      <ContenidoEvaluaciones />
    </ClienteShell>
  );
}
