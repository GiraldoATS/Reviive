"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconMessage, IconLock } from "@/components/icons";

const ICONS = "/images/cuenta";

const accesos = [
  { icono: "icon-recuerdos.png", titulo: "Mis recuerdos", texto: "Consulta y gestiona tus recuerdos registrados.", href: "/mis-recuerdos" },
  { icono: "icon-evaluaciones.png", titulo: "Mis evaluaciones", texto: "Revisa el estado de tus evaluaciones y recomendaciones.", href: "/evaluaciones" },
  { icono: "icon-procesos.png", titulo: "Mis procesos", texto: "Haz seguimiento a la restauración, preservación o transformación.", href: "/mis-procesos" },
  { icono: "icon-envios.png", titulo: "Mis envíos", texto: "Consulta recolecciones, seguimiento y devoluciones.", href: "/envios" },
  { icono: "icon-chat.png", titulo: "Hablar con Alma", texto: "Alma está aquí para orientarte en lo que necesites.", href: "/chat" },
];

const privacidad = [
  { titulo: "Actualizar mis datos", texto: "Revisa y actualiza tu información personal y de contacto.", href: "/mi-cuenta/datos" },
  { titulo: "Configurar seguridad", texto: "Cambia tu contraseña y administra tus sesiones activas.", href: "/mi-cuenta/seguridad" },
  { titulo: "Consultar política de privacidad", texto: "Conoce cómo protegemos tus datos y tu información.", href: "/politica-privacidad" },
];

function fechaLarga(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-CO", { month: "long", year: "numeric" });
}

interface RecuerdoAPI { id: string; }
interface PedidoAPI { id: string; estado: string; }

function ContenidoPerfil() {
  const { usuario, accessToken } = useAuth();
  const [recuerdos, setRecuerdos] = useState<RecuerdoAPI[]>([]);
  const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [avisoCorreo, setAvisoCorreo] = useState(true);
  const [avisoProcesos, setAvisoProcesos] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };
    Promise.all([
      fetch(`${API_URL}/memories/`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/orders/`, { headers }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([r, p]) => {
        setRecuerdos(Array.isArray(r) ? r : (r.results ?? []));
        setPedidos(Array.isArray(p) ? p : (p.results ?? []));
      })
      .catch(() => {
        setRecuerdos([]);
        setPedidos([]);
      })
      .finally(() => setCargandoDatos(false));
  }, [accessToken]);

  if (cargandoDatos) {
    return <div className="min-h-[60vh]" />;
  }

  const nombre = usuario?.perfil?.nombre?.trim() || "";
  const inicial = nombre ? nombre[0].toUpperCase() : "?";
  const miembroDesde = fechaLarga(usuario?.perfil?.creado_en);
  const tieneRecuerdos = recuerdos.length > 0;

  const procesosActivos = pedidos.filter((p) => p.estado !== "entregado" && p.estado !== "cancelado").length;
  const enviosRealizados = pedidos.filter((p) => p.estado === "en_camino" || p.estado === "entregado").length;

  const stats = [
    { icono: "icon-recuerdos.png", numero: recuerdos.length, label: "Recuerdos registrados" },
    { icono: "icon-evaluaciones.png", numero: pedidos.length, label: "Evaluaciones" },
    { icono: "icon-procesos.png", numero: procesosActivos, label: "Procesos activos" },
    { icono: "icon-envios.png", numero: enviosRealizados, label: "Envíos" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="pointer-events-none absolute -left-6 top-0 hidden h-full w-40 opacity-40 lg:block">
          <Image src={`${ICONS}/rama-lateral.png`} alt="" fill sizes="160px" className="object-contain object-left-top" unoptimized />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-10 lg:pl-16">
          <h1 className="font-display text-4xl text-carbon">Mi perfil</h1>
          <p className="mt-1 text-dorado-suave">Este es el resumen de tu cuenta y tu actividad en Reviive.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-8 grid lg:grid-cols-[1.1fr_1fr] gap-6">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 h-full">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-borgona text-marfil font-display text-2xl">
              {inicial}
            </span>
            <div>
              <h2 className="font-display text-xl text-carbon">{nombre || "Cliente Reviive"}</h2>
              <p className="text-sm text-carbon/55">Cliente Reviive</p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 text-sm">
            <p className="flex items-center gap-2 text-carbon/75">
              <span className="relative h-4 w-4 shrink-0">
                <Image src={`${ICONS}/icon-correo.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
              </span>
              {usuario?.email}
              <IconLock className="h-3.5 w-3.5 text-carbon/35" />
            </p>
            {usuario?.perfil?.ciudad && (
              <p className="flex items-center gap-2 text-carbon/75">
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={`${ICONS}/icon-ciudad.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                {usuario.perfil.ciudad}
              </p>
            )}
            {usuario?.perfil?.telefono && (
              <p className="flex items-center gap-2 text-carbon/75">
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={`${ICONS}/icon-telefono.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                {usuario.perfil.telefono}
              </p>
            )}
            {miembroDesde && <p className="text-xs text-carbon/50">Miembro desde {miembroDesde}</p>}
          </div>

          <Button href="/mi-cuenta/datos" variant="secondary" className="mt-5 inline-flex items-center gap-2">
            Editar mis datos →
          </Button>
        </div>

        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 h-full flex flex-col">
          <h3 className="font-display text-lg text-carbon">Mi actividad en Reviive</h3>
          <p className="text-sm text-carbon/55">Así va tu experiencia con nosotros.</p>
          <div className="mt-3 grid grid-cols-2 gap-3 flex-1">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-greige/50 bg-marfil p-4">
                <span className="relative h-8 w-8 block">
                  <Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="32px" className="object-contain" unoptimized />
                </span>
                <p className="mt-2 font-display text-2xl text-carbon leading-none">{s.numero}</p>
                <p className="mt-1 text-xs text-carbon/60">{s.label}</p>
              </div>
            ))}
          </div>

          {!tieneRecuerdos && (
            <div className="mt-4 rounded-xl border border-greige/50 bg-marfil p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-carbon">Aún no has registrado recuerdos</p>
                <p className="text-xs text-carbon/60">Comienza tu viaje con Reviive registrando tu primer recuerdo.</p>
              </div>
              <Button href="/mis-recuerdos/nuevo" variant="primary" className="shrink-0">
                Registrar mi primer recuerdo
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-10">
        <h3 className="font-display text-lg text-carbon">Accesos rápidos</h3>
        <p className="text-sm text-carbon/55">Gestiona y consulta todo lo relacionado con tus recuerdos.</p>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {accesos.map((a) => (
            <Link key={a.titulo} href={a.href} className="rounded-2xl border border-greige/50 bg-greige/20 p-4 text-center hover:border-borgona/40 transition-colors">
              <span className="relative h-10 w-10 mx-auto block">
                <Image src={`${ICONS}/${a.icono}`} alt="" fill sizes="40px" className="object-contain" unoptimized />
              </span>
              <p className="mt-2 font-display text-sm text-borgona">{a.titulo}</p>
              <p className="mt-1 text-xs text-carbon/60">{a.texto}</p>
              <span className="mt-2 inline-block text-sm text-borgona">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 pt-10">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <h3 className="font-display text-lg text-carbon">Preferencias</h3>
          <p className="text-sm text-carbon/55">Configura tu experiencia en Reviive.</p>
          <div className="mt-4 divide-y divide-greige/50">
            <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
              <span className="text-sm text-carbon/75">
                <span className="block font-medium text-carbon">Recibir actualizaciones por correo</span>
                Noticias, novedades y recomendaciones.
              </span>
              <span className="relative inline-flex h-6 w-11 shrink-0">
                <input
                  type="checkbox"
                  checked={avisoCorreo}
                  onChange={(e) => setAvisoCorreo(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-greige/60 peer-checked:bg-borgona transition-colors" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
            <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
              <span className="text-sm text-carbon/75">
                <span className="block font-medium text-carbon">Recibir novedades sobre mis procesos</span>
                Te avisaremos sobre avances importantes.
              </span>
              <span className="relative inline-flex h-6 w-11 shrink-0">
                <input
                  type="checkbox"
                  checked={avisoProcesos}
                  onChange={(e) => setAvisoProcesos(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-greige/60 peer-checked:bg-borgona transition-colors" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
            <div className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-carbon/75">Idioma</span>
              <span className="text-carbon/50">Español (Colombia)</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-carbon/75">Ciudad principal</span>
              <span className="text-carbon/50">{usuario?.perfil?.ciudad || "No especificada"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-10">
        <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
          <h3 className="font-display text-lg text-carbon">Cuenta y privacidad</h3>
          <p className="text-sm text-carbon/55">Administra tu cuenta y protege tu información.</p>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {privacidad.map((p) => (
              <Link key={p.titulo} href={p.href} className="flex items-start gap-3 rounded-xl p-3 hover:bg-white/40 transition-colors">
                <IconMessage className="h-5 w-5 shrink-0 text-borgona mt-0.5" />
                <span>
                  <span className="block text-sm font-medium text-borgona">{p.titulo} →</span>
                  <span className="block text-xs text-carbon/60">{p.texto}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function MiPerfilPage() {
  return (
    <ClienteShell activeHref="/mi-cuenta/perfil">
      <ContenidoPerfil />
    </ClienteShell>
  );
}
