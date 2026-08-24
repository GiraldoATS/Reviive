"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { useProveedor } from "@/lib/ProveedorContext";
import { API_URL } from "@/lib/api";
import { IconInfo } from "@/components/icons";

const ICONS = "/images/proveedor";

const ESTADO_INFO: Record<string, { label: string; clase: string }> = {
  borrador: { label: "Borrador", clase: "bg-greige/50 text-carbon/70" },
  enviada: { label: "Enviada", clase: "bg-dorado-suave/20 text-borgona-dark" },
  aceptada: { label: "Aceptada", clase: "bg-emerald-50 text-emerald-700" },
  rechazada: { label: "No aceptada", clase: "bg-rosa/40 text-borgona-dark" },
  vencida: { label: "Vencida", clase: "bg-greige/50 text-carbon/50" },
};

const filtros = [
  { id: "todas", label: "Todas" },
  { id: "borrador", label: "Borradores" },
  { id: "enviada", label: "Enviadas" },
  { id: "aceptada", label: "Aceptadas" },
  { id: "rechazada", label: "No aceptadas" },
  { id: "vencida", label: "Vencidas" },
] as const;

interface CotizacionAPI {
  id: string;
  recuerdo: string;
  proveedor: number;
  total: string;
  vigencia: string;
  estado: string;
  creado_en: string;
}

function formatoCOP(valor: number) {
  return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function ContenidoCotizaciones() {
  const { accessToken } = useAuth();
  const { proveedor } = useProveedor();
  const [cotizaciones, setCotizaciones] = useState<CotizacionAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [enviandoAccion, setEnviandoAccion] = useState<string | null>(null);

  const [recuerdoId, setRecuerdoId] = useState("");
  const [total, setTotal] = useState("");
  const [vigencia, setVigencia] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/quotations/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCotizaciones(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => setCotizaciones([]))
      .finally(() => setCargando(false));
  }

  useEffect(cargar, [accessToken]);

  async function crearCotizacion(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !proveedor || creando) return;
    setError(null);
    setCreando(true);
    try {
      const res = await fetch(`${API_URL}/quotations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ recuerdo: recuerdoId, proveedor: proveedor.id, total, vigencia, estado: "borrador" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.mensaje || "No se pudo crear la cotización. Revisa el ID del recuerdo y los datos.");
      }
      setModalAbierto(false);
      setRecuerdoId("");
      setTotal("");
      setVigencia("");
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cotización.");
    } finally {
      setCreando(false);
    }
  }

  async function enviarCotizacion(cotizacion: CotizacionAPI) {
    if (!accessToken) return;
    setEnviandoAccion(cotizacion.id);
    try {
      await fetch(`${API_URL}/quotations/${cotizacion.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ estado: "enviada" }),
      });
      cargar();
    } finally {
      setEnviandoAccion(null);
    }
  }

  if (cargando) {
    return <div className="min-h-[60vh]" />;
  }

  const tieneCotizaciones = cotizaciones.length > 0;
  const visibles = filtro === "todas" ? cotizaciones : cotizaciones.filter((c) => c.estado === filtro);

  const stats = [
    { icono: "cot-icon-clipboard-check.png", numero: cotizaciones.filter((c) => c.estado === "borrador").length, label: "Borradores" },
    { icono: "cot-icon-paper-plane.png", numero: cotizaciones.filter((c) => c.estado === "enviada").length, label: "Enviadas" },
    { icono: "cot-icon-check-circle.png", numero: cotizaciones.filter((c) => c.estado === "aceptada").length, label: "Aceptadas" },
    { icono: "cot-icon-chat-dots.png", numero: cotizaciones.filter((c) => c.estado === "rechazada").length, label: "No aceptadas" },
    { icono: "cot-icon-hourglass.png", numero: cotizaciones.filter((c) => c.estado === "vencida").length, label: "Vencidas" },
  ];

  return (
    <div className="relative">
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Cotizaciones</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Prepara, envía y consulta las propuestas que realizas para los recuerdos que puedes atender. Cuando el
              cliente apruebe la propuesta, Reviive generará el pedido correspondiente.
            </p>
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-borgona text-marfil px-6 py-2.5 text-sm hover:bg-borgona-dark transition-colors"
            >
              + Nueva cotización
            </button>
          </div>
          <div className="relative hidden lg:block h-40">
            <Image src={`${ICONS}/cot-hero.png`} alt="" fill sizes="30vw" className="object-contain" unoptimized />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-greige/50 bg-greige/20 p-4 flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 block">
              <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="48px" className="object-contain" unoptimized />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl text-carbon leading-tight">{s.numero}</p>
              <p className="mt-0.5 text-xs text-carbon/60">{s.label}</p>
            </div>
          </div>
        ))}
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

          {!tieneCotizaciones ? (
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-greige/50 bg-greige/20 p-10 text-center">
              <span className="relative h-40 w-56 mx-auto block">
                <Image src={`${ICONS}/cot-icon-centerpiece.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
              </span>
              <h2 className="mt-4 font-display text-2xl text-carbon">Aún no tienes cotizaciones</h2>
              <p className="mt-2 text-sm text-carbon/70 max-w-md mx-auto">
                Cuando aceptes una solicitud para atenderla, podrás preparar aquí tu propuesta de servicio, tiempo
                estimado y valor.
              </p>
              <Link
                href="/proveedor/solicitudes"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-borgona text-marfil px-6 py-2.5 text-sm hover:bg-borgona-dark transition-colors"
              >
                Ver mis solicitudes
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {visibles.map((c) => {
                const info = ESTADO_INFO[c.estado] ?? { label: c.estado, clase: "bg-greige/40 text-carbon/60" };
                return (
                  <div key={c.id} className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
                    <div className="flex flex-wrap items-start gap-4">
                      <span className="relative h-16 w-16 shrink-0 rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                        <span className="relative h-8 w-8 block">
                          <Image src={`${ICONS}/cot-icon-document-check.png`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                        </span>
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-lg text-carbon">Cotización #{c.id.slice(0, 8).toUpperCase()}</p>
                          <span className={`rounded-full px-3 py-1 text-xs ${info.clase}`}>{info.label}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-carbon/45">ID de recuerdo: {c.recuerdo.slice(0, 8)}…</p>
                        <p className="mt-2 text-sm text-carbon/70">
                          Valor propuesto <strong className="ml-1 font-display text-base text-dorado-suave">{formatoCOP(Number(c.total))}</strong>
                        </p>
                      </div>

                      <div className="shrink-0 text-right text-xs text-carbon/50 space-y-0.5">
                        <p>Creada: {fechaCorta(c.creado_en)}</p>
                        <p>Vigencia: hasta {fechaCorta(c.vigencia)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      {c.estado === "borrador" && (
                        <button
                          type="button"
                          onClick={() => enviarCotizacion(c)}
                          disabled={enviandoAccion === c.id}
                          className="rounded-full bg-borgona text-marfil px-4 py-2 text-sm hover:bg-borgona-dark transition-colors disabled:opacity-60"
                        >
                          {enviandoAccion === c.id ? "Enviando…" : "Enviar cotización"}
                        </button>
                      )}
                      {c.estado === "aceptada" && (
                        <Link href="/proveedor/pedidos" className="rounded-full border border-borgona text-borgona px-4 py-2 text-sm hover:bg-borgona/5 transition-colors">
                          Ver pedido →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-8 w-8 shrink-0">
                <Image src={`${ICONS}/cot-icon-info.png`} alt="" fill sizes="32px" className="object-contain" unoptimized />
              </span>
              ¿Cómo funciona?
            </h3>
            <p className="mt-2 text-sm text-carbon/70">
              Envías tu cotización con el alcance, tiempo y valor del servicio. El cliente la revisa y decide. Si la
              aprueba, Reviive confirma el pago y el envío del objeto para que puedas iniciar el trabajo.
            </p>
          </div>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
            <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
              <span className="relative h-8 w-8 shrink-0">
                <Image src={`${ICONS}/cot-icon-hourglass.png`} alt="" fill sizes="32px" className="object-contain" unoptimized />
              </span>
              Regla del proceso
            </h3>
            <p className="mt-2 text-sm text-carbon/70">
              La cotización se prepara después de analizar la solicitud. El taller inicia el trabajo solo cuando el
              cliente aprueba, el pago está confirmado y el objeto ha sido recibido por el taller.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pb-16">
        <div className="flex items-center gap-3 mb-5">
          <span className="relative h-4 w-10 shrink-0 opacity-70">
            <Image src={`${ICONS}/cot-rama.png`} alt="" fill sizes="40px" className="object-contain" unoptimized />
          </span>
          <p className="text-sm text-carbon/60">Te recomendamos:</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <Link href="/proveedor/solicitudes" className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-start gap-3 hover:bg-white/50 transition-colors">
            <span className="relative h-11 w-11 shrink-0 rounded-full bg-rosa/40 flex items-center justify-center overflow-hidden">
              <span className="relative h-5 w-5 block">
                <Image src={`${ICONS}/cot-icon-magnifier.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
              </span>
            </span>
            <div>
              <p className="text-sm font-medium text-carbon">Revisa tus solicitudes</p>
              <p className="mt-0.5 text-xs text-carbon/60">Identifica oportunidades compatibles con tu taller.</p>
            </div>
          </Link>
          <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-start gap-3">
            <span className="relative h-11 w-11 shrink-0 rounded-full bg-dorado-suave/25 flex items-center justify-center overflow-hidden">
              <span className="relative h-5 w-5 block">
                <Image src={`${ICONS}/cot-icon-pencil.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
              </span>
            </span>
            <div>
              <p className="text-sm font-medium text-carbon">Define bien el alcance</p>
              <p className="mt-0.5 text-xs text-carbon/60">Describe claramente qué incluye tu trabajo.</p>
            </div>
          </div>
          <span
            className="rounded-2xl border border-greige/50 bg-greige/20 p-5 flex items-start gap-3 cursor-default"
            title="Próximamente"
          >
            <span className="relative h-11 w-11 shrink-0 rounded-full bg-rosa/40 flex items-center justify-center overflow-hidden">
              <span className="relative h-5 w-5 block">
                <Image src={`${ICONS}/cot-icon-calendar.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
              </span>
            </span>
            <span className="block">
              <span className="block text-sm font-medium text-carbon">Configura tu capacidad</span>
              <span className="block mt-0.5 text-xs text-carbon/60">Cotiza tiempos que realmente puedas cumplir.</span>
            </span>
          </span>
        </div>
      </section>

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} className="max-w-md">
        <form onSubmit={crearCotizacion} className="p-6 sm:p-8">
          <h3 className="font-display text-xl text-borgona">Nueva cotización</h3>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-dorado-suave/10 p-3 text-xs text-carbon/60">
            <IconInfo className="h-4 w-4 shrink-0 text-dorado-suave mt-0.5" />
            Ingresa el ID del recuerdo que el cliente te compartió al contactarte. Por ahora no existe una bandeja
            automática de solicitudes.
          </div>
          <label className="block mt-4">
            <span className="block text-sm text-carbon/75 mb-1.5">ID del recuerdo</span>
            <input
              required
              value={recuerdoId}
              onChange={(e) => setRecuerdoId(e.target.value)}
              placeholder="UUID del recuerdo"
              className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50"
            />
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Valor propuesto (COP)</span>
            <input
              required
              type="number"
              min="0"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="250000"
              className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50"
            />
          </label>
          <label className="block mt-3">
            <span className="block text-sm text-carbon/75 mb-1.5">Vigente hasta</span>
            <input
              required
              type="date"
              value={vigencia}
              onChange={(e) => setVigencia(e.target.value)}
              className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-2.5 text-sm outline-none focus:border-borgona/50"
            />
          </label>
          {error && <p className="mt-3 text-sm text-borgona">{error}</p>}
          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{creando ? "Guardando…" : "Guardar borrador"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function CotizacionesPage() {
  return (
    <ProveedorShell activeHref="/proveedor/cotizaciones">
      <ContenidoCotizaciones />
    </ProveedorShell>
  );
}
