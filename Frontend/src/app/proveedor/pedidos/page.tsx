"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconCheck } from "@/components/icons";

const ICONS = "/images/proveedor";

const PASOS_PEDIDO = [
  { estado: "recibido", label: "Objeto recibido", icono: "ped-icon-box.png" },
  { estado: "en_evaluacion", label: "Evaluación", icono: "ped-icon-document.png" },
  { estado: "en_proceso", label: "En producción", icono: "ped-icon-wrench.png" },
  { estado: "control_de_calidad", label: "Control de calidad", icono: "ped-icon-shield.png" },
  { estado: "en_camino", label: "En camino", icono: "ped-icon-truck.png" },
  { estado: "entregado", label: "Entregado", icono: "ped-icon-check.png" },
] as const;

const ESTADO_LABEL: Record<string, string> = {
  recibido: "Objeto recibido",
  en_evaluacion: "En evaluación",
  en_proceso: "En producción",
  control_de_calidad: "En control de calidad",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const filtros = [
  { id: "todos", label: "Todos" },
  { id: "recibido", label: "Objeto recibido" },
  { id: "en_evaluacion", label: "Evaluación" },
  { id: "en_proceso", label: "En producción" },
  { id: "control_de_calidad", label: "Control de calidad" },
  { id: "en_camino", label: "En camino" },
  { id: "entregado", label: "Entregados" },
] as const;

interface ResumenPedidoAPI {
  objeto?: string;
  historia?: string;
  proveedor?: string;
}
interface EventoPedidoAPI {
  id: number;
  estado: string;
  fecha: string;
  descripcion: string;
}
interface PedidoAPI {
  id: string;
  codigo: string;
  resumen: ResumenPedidoAPI | string | null;
  estado: string;
  total: string;
  eventos: EventoPedidoAPI[];
  creado_en: string;
}

function tituloPedido(p: PedidoAPI): string {
  if (typeof p.resumen === "string" && p.resumen) return p.resumen;
  if (p.resumen && typeof p.resumen === "object") {
    if (p.resumen.objeto) return p.resumen.objeto;
    if (p.resumen.historia) return p.resumen.historia;
  }
  return p.codigo;
}

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function descripcionEstado(p: PedidoAPI): string {
  const evento = p.eventos?.find((e) => e.estado === p.estado);
  const fecha = evento ? fechaCorta(evento.fecha) : null;
  switch (p.estado) {
    case "recibido":
      return fecha ? `Objeto recibido el: ${fecha}` : "Objeto recibido";
    case "en_evaluacion":
      return fecha ? `En evaluación desde: ${fecha}` : "En evaluación";
    case "en_proceso":
      return fecha ? `Iniciado el: ${fecha}` : "En producción";
    case "control_de_calidad":
      return fecha ? `En control de calidad desde: ${fecha}` : "En control de calidad";
    case "en_camino":
      return fecha ? `Enviado el: ${fecha}` : "En camino";
    case "entregado":
      return fecha ? `Entregado el: ${fecha}` : "Entregado";
    case "cancelado":
      return "Cancelado";
    default:
      return "";
  }
}

function ContenidoPedidos() {
  const { accessToken } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"recientes" | "antiguos">("recientes");
  const [pedidoModal, setPedidoModal] = useState<PedidoAPI | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/orders/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPedidos(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => setPedidos([]))
      .finally(() => setCargando(false));
  }

  useEffect(cargar, [accessToken]);

  function abrirAvance(p: PedidoAPI) {
    setPedidoModal(p);
    setDescripcion("");
  }

  async function confirmarAvance() {
    if (!accessToken || !pedidoModal || enviando) return;
    const idx = PASOS_PEDIDO.findIndex((p) => p.estado === pedidoModal.estado);
    const siguiente = PASOS_PEDIDO[idx + 1];
    if (!siguiente) return;
    setEnviando(true);
    try {
      await fetch(`${API_URL}/orders/${pedidoModal.id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ estado: siguiente.estado, descripcion: descripcion || `Avance a: ${siguiente.label}` }),
      });
      setPedidoModal(null);
      cargar();
    } finally {
      setEnviando(false);
    }
  }

  const visibles = useMemo(() => {
    let lista = filtro === "todos" ? pedidos : pedidos.filter((p) => p.estado === filtro);
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter((p) => tituloPedido(p).toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q));
    }
    lista = [...lista].sort((a, b) => {
      const da = new Date(a.creado_en).getTime();
      const db = new Date(b.creado_en).getTime();
      return orden === "recientes" ? db - da : da - db;
    });
    return lista;
  }, [pedidos, filtro, busqueda, orden]);

  if (cargando) {
    return <div className="min-h-[60vh]" />;
  }

  const tienePedidos = pedidos.length > 0;

  const stats = [
    { icono: "ped-icon-box.png", numero: pedidos.filter((p) => p.estado === "recibido").length, label: "Objeto recibido" },
    { icono: "ped-icon-document.png", numero: pedidos.filter((p) => p.estado === "en_evaluacion").length, label: "En evaluación" },
    { icono: "ped-icon-wrench.png", numero: pedidos.filter((p) => p.estado === "en_proceso").length, label: "En producción" },
    { icono: "ped-icon-shield.png", numero: pedidos.filter((p) => p.estado === "control_de_calidad").length, label: "En control de calidad" },
    { icono: "ped-icon-truck.png", numero: pedidos.filter((p) => p.estado === "en_camino").length, label: "Listos para envío" },
    { icono: "ped-icon-check.png", numero: pedidos.filter((p) => p.estado === "entregado").length, label: "Finalizados" },
  ];

  const siguientePaso = pedidoModal
    ? PASOS_PEDIDO[PASOS_PEDIDO.findIndex((p) => p.estado === pedidoModal.estado) + 1]
    : null;

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_0.85fr_0.9fr] items-center gap-4">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Pedidos</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Gestiona los trabajos aprobados y sigue cada etapa desde la confirmación del pago hasta la entrega
              final.
            </p>
          </div>
          <div
            className="relative hidden lg:block h-48"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 65% 65% at center, black 45%, transparent 100%)",
            }}
          >
            <Image src={`${ICONS}/ped-hero.png`} alt="" fill sizes="26vw" className="object-contain" unoptimized />
          </div>
          <div className="hidden lg:block rounded-2xl border border-greige/50 bg-white/60 p-5 mr-6">
            <h3 className="inline-flex items-center gap-2 font-display text-sm text-carbon">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS}/ped-icon-bulb.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              ¿Cómo funciona?
            </h3>
            <p className="mt-2 text-xs text-carbon/65">
              Un pedido se crea cuando el cliente acepta tu cotización. Debes esperar la confirmación del pago y
              registrar la recepción del objeto para iniciar el trabajo.
            </p>
            <Link href="/preguntas-frecuentes" className="mt-2 inline-block text-xs text-borgona hover:text-borgona-dark transition-colors">
              Ver proceso completo →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 block">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="48px" className="object-contain" unoptimized />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xl text-carbon leading-tight">{s.numero}</p>
              <p className="mt-0.5 text-xs text-carbon/60">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8">
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

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 block">
              <Image src={`${ICONS}/ped-icon-magnifier.png`} alt="" fill sizes="16px" className="object-contain opacity-60" unoptimized />
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por objeto o pedido..."
              className="w-full rounded-xl border border-greige/70 bg-white/70 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-borgona/50"
            />
          </div>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as "recientes" | "antiguos")}
            className="rounded-xl border border-greige/70 bg-white/70 px-3.5 py-2.5 text-sm text-carbon/70 outline-none focus:border-borgona/50"
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
        </div>

        {tienePedidos && (
          <p className="mt-3 text-xs text-carbon/45">
            Mostrando {visibles.length} de {pedidos.length} pedido{pedidos.length === 1 ? "" : "s"}
          </p>
        )}

        {!tienePedidos ? (
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-greige/50 bg-greige/20 p-10 text-center">
            <span className="relative h-24 w-24 mx-auto block opacity-80">
              <Image src={`${ICONS}/icon-caja-ilustracion.png`} alt="" fill sizes="96px" className="object-contain" unoptimized />
            </span>
            <h2 className="mt-4 font-display text-2xl text-carbon">Aún no tienes pedidos activos.</h2>
            <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
              Los pedidos aparecerán aquí cuando un cliente apruebe tu cotización, el pago esté confirmado y el
              objeto sea recibido por tu taller.
            </p>
          </div>
        ) : visibles.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-8 text-center text-sm text-carbon/60">
            No tienes pedidos en este estado.
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {visibles.map((p) => {
              const idx = PASOS_PEDIDO.findIndex((paso) => paso.estado === p.estado);
              const puedeAvanzar = idx >= 0 && idx < PASOS_PEDIDO.length - 1 && p.estado !== "cancelado";
              return (
                <div key={p.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="relative h-14 w-14 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                        <span className="relative h-7 w-7 block">
                          <Image src={`${ICONS}/${PASOS_PEDIDO.find((paso) => paso.estado === p.estado)?.icono ?? "ped-icon-box.png"}`} alt="" fill sizes="28px" className="object-contain" unoptimized />
                        </span>
                      </span>
                      <div>
                        <p className="font-display text-lg text-carbon">Pedido #{p.codigo}</p>
                        <p className="text-sm text-carbon/70">{tituloPedido(p)}</p>
                        {typeof p.resumen === "object" && p.resumen?.proveedor && (
                          <p className="text-xs text-carbon/45 mt-0.5">Taller: {p.resumen.proveedor}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="rounded-full bg-dorado-suave/20 px-3 py-1 text-xs text-borgona-dark">
                        {ESTADO_LABEL[p.estado] ?? p.estado}
                      </span>
                      <p className="mt-1.5 text-xs text-carbon/45">{descripcionEstado(p)}</p>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-carbon/70">
                    Valor aprobado: <strong className="text-dorado-suave">{formatoCOP(Number(p.total))}</strong>
                    <span className="text-carbon/40"> · Registrado: {fechaCorta(p.creado_en)}</span>
                  </div>

                  <div className="relative mt-6 flex justify-between max-w-2xl">
                    <div className="absolute left-0 right-0 top-4 h-px bg-greige/60" />
                    {PASOS_PEDIDO.map((paso, i) => {
                      const evento = p.eventos?.find((e) => e.estado === paso.estado);
                      return (
                        <div key={paso.estado} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-marfil ${
                              i < idx
                                ? "border-borgona"
                                : i === idx
                                  ? "border-dorado-suave"
                                  : "border-greige/60 opacity-40"
                            }`}
                          >
                            {i < idx ? (
                              <IconCheck className="h-3.5 w-3.5 text-borgona" />
                            ) : (
                              <span className="relative h-4 w-4 block">
                                <Image src={`${ICONS}/${paso.icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                              </span>
                            )}
                          </span>
                          <span className="text-[9px] text-carbon/55 text-center leading-tight">{paso.label}</span>
                          <span className="text-[9px] text-carbon/35">{evento ? fechaCorta(evento.fecha) : "—"}</span>
                        </div>
                      );
                    })}
                  </div>

                  {puedeAvanzar && (
                    <div className="mt-5">
                      <Button type="button" variant="primary" onClick={() => abrirAvance(p)}>
                        Marcar: {PASOS_PEDIDO[idx + 1].label} →
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icono: "ped-icon-clipboard.png", titulo: "Seguimiento claro", texto: "Consulta el estado de cada pedido en tiempo real." },
            { icono: "ped-icon-gear.png", titulo: "Proceso ordenado", texto: "Cada etapa está definida para trabajar sin contratiempos." },
            { icono: "ped-icon-shield.png", titulo: "Trazabilidad", texto: "Registro completo de cada paso de tu trabajo." },
            { icono: "ped-icon-box-shield.png", titulo: "Entrega segura", texto: "Aseguramos que cada pieza llegue en perfectas condiciones." },
          ].map((tip) => (
            <div key={tip.titulo} className="flex items-start gap-3">
              <span className="relative h-9 w-9 shrink-0 block">
                <Image src={`${ICONS}/${tip.icono}`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              <div>
                <p className="text-sm font-medium text-carbon">{tip.titulo}</p>
                <p className="mt-0.5 text-xs text-carbon/60">{tip.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal open={pedidoModal !== null} onClose={() => setPedidoModal(null)} className="max-w-md">
        {pedidoModal && siguientePaso && (
          <div className="p-6 sm:p-8">
            <h3 className="font-display text-xl text-borgona">Actualizar estado del pedido</h3>
            <p className="mt-2 text-sm text-carbon/70">
              Pedido #{pedidoModal.codigo} pasará a <strong>{siguientePaso.label}</strong>.
            </p>
            <label className="block mt-4">
              <span className="block text-sm text-carbon/75 mb-1.5">Descripción (opcional)</span>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Trabajo finalizado y listo para control de calidad."
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50 resize-none"
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setPedidoModal(null)}>Cancelar</Button>
              <Button type="button" variant="primary" onClick={confirmarAvance}>
                {enviando ? "Guardando…" : "Confirmar"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default function PedidosPage() {
  return (
    <ProveedorShell activeHref="/proveedor/pedidos">
      <ContenidoPedidos />
    </ProveedorShell>
  );
}
