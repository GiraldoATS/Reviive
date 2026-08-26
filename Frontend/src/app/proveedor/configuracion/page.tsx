"use client";

import { useState } from "react";
import Image from "next/image";
import ProveedorShell from "@/components/ProveedorShell";
import { useAuth } from "@/lib/AuthContext";
import { useProveedor } from "@/lib/ProveedorContext";
import { API_URL } from "@/lib/api";
import { actualizarPerfil } from "@/lib/auth";

const ICONS = "/images/proveedor";

// El perfil del taller (nombre/ciudad/responsable/telefono/dirección/
// descripción/años/horarios) sí persiste de verdad, vía PATCH a
// /providers/me/ y /users/me. Servicios/portafolio, información
// bancaria, notificaciones, sesiones/2FA y documentos no tienen todavía
// un modelo real detrás (no hay Pago con datos bancarios del proveedor,
// ni modelo de sesiones, ni de documentos de validación) — esas
// secciones quedan honestamente marcadas "Próximamente".

const TABS = [
  { id: "perfil", label: "Perfil del taller", icono: "cfg-icon-perfil.png" },
  { id: "servicios", label: "Servicios", icono: "cfg-icon-servicios.png" },
  { id: "pago", label: "Información de pago", icono: "cfg-icon-pago.png" },
  { id: "notificaciones", label: "Notificaciones", icono: "cfg-icon-notificaciones.png" },
  { id: "seguridad", label: "Seguridad", icono: "cfg-icon-seguridad.png" },
  { id: "documentos", label: "Documentos", icono: "cfg-icon-documentos.png" },
  { id: "cuenta", label: "Cuenta", icono: "cfg-icon-cuenta.png" },
] as const;

const especialidades = ["Restauración de madera", "Conservación de documentos", "Restauración de relojes"];
const serviciosOfrecidos = [
  { icono: "cfg-icon-paintbrush.png", label: "Restauración" },
  { icono: "cfg-icon-leaf.png", label: "Preservación" },
  { icono: "cfg-icon-sparkles.png", label: "Transformación" },
  { icono: "cfg-icon-wrench.png", label: "Mantenimiento" },
];
const materiales = [
  { icono: "cfg-icon-wood.png", label: "Madera" },
  { icono: "cfg-icon-metal.png", label: "Metal" },
  { icono: "cfg-icon-paper.png", label: "Papel" },
  { icono: "cfg-icon-vase.png", label: "Cerámica" },
  { icono: "cfg-icon-cloth.png", label: "Tela" },
  { icono: "cfg-icon-scroll.png", label: "Vidrio" },
];

const notificacionesFilas = [
  { label: "Solicitudes" },
  { label: "Cotizaciones" },
  { label: "Pedidos" },
  { label: "Evidencias" },
  { label: "Ingresos" },
  { label: "Mensajes" },
  { label: "Comunicaciones de Reviive" },
];

const portafolio = ["sol-icon-clock.png", "icon-evidencias.png", "sol-icon-caja.png", "cfg-icon-vase.png"];

function Campo({
  icono,
  label,
  value,
  onChange,
  multiline = false,
  readOnly = false,
}: {
  icono: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="relative h-4 w-4 shrink-0 mt-1 opacity-60">
        <Image src={`${ICONS}/${icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
      </span>
      <div className="flex-1">
        <p className="text-xs text-carbon/50">{label}{readOnly && <span className="ml-1 text-carbon/30">(no editable)</span>}</p>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            rows={2}
            className={`w-full bg-transparent text-sm border-b border-transparent focus:border-borgona/40 outline-none py-0.5 resize-none ${readOnly ? "text-carbon/50" : "text-carbon"}`}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className={`w-full bg-transparent text-sm border-b border-transparent focus:border-borgona/40 outline-none py-0.5 ${readOnly ? "text-carbon/50" : "text-carbon"}`}
          />
        )}
      </div>
    </div>
  );
}

function ContenidoConfiguracion() {
  const { usuario, accessToken, actualizarUsuario } = useAuth();
  const { proveedor, cargandoProveedor, refrescarProveedor } = useProveedor();

  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("perfil");

  const [nombreTaller, setNombreTaller] = useState("");
  const [responsable, setResponsable] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [anios, setAnios] = useState("");
  const [horarios, setHorarios] = useState("");
  const [camposListos, setCamposListos] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  if (!camposListos && !cargandoProveedor) {
    setNombreTaller(proveedor?.nombre_taller ?? "");
    setCiudad(proveedor?.ciudad ?? "");
    setResponsable(usuario?.perfil?.nombre ?? "");
    setTelefono(usuario?.perfil?.telefono ?? "");
    setDireccion(proveedor?.direccion ?? "");
    setDescripcion(proveedor?.descripcion ?? "");
    setAnios(proveedor?.anios_experiencia ?? "");
    setHorarios(proveedor?.horario_atencion ?? "");
    setCamposListos(true);
  }

  async function guardarPerfil() {
    if (!accessToken) return;
    setGuardando(true);
    setGuardado(false);
    try {
      await fetch(`${API_URL}/providers/me/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          direccion,
          descripcion,
          anios_experiencia: anios,
          horario_atencion: horarios,
        }),
      });
      const perfilActualizado = await actualizarPerfil(accessToken, { nombre: responsable, telefono });
      actualizarUsuario(perfilActualizado);
      refrescarProveedor();
      setGuardado(true);
    } finally {
      setGuardando(false);
    }
  }

  const [notifs, setNotifs] = useState<Record<string, { reviive: boolean; correo: boolean }>>(
    Object.fromEntries(notificacionesFilas.map((f) => [f.label, { reviive: true, correo: f.label !== "Evidencias" && f.label !== "Ingresos" && f.label !== "Mensajes" && f.label !== "Comunicaciones de Reviive" }]))
  );

  function toggleNotif(label: string, canal: "reviive" | "correo") {
    setNotifs((prev) => ({ ...prev, [label]: { ...prev[label], [canal]: !prev[label][canal] } }));
  }

  const verificado = proveedor?.estado_validacion === "validado";

  return (
    <>
      <section className="relative overflow-hidden bg-greige/15">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-4">
          <div className="px-6 py-10 lg:pl-16">
            <h1 className="font-display text-4xl text-borgona">Configuración</h1>
            <p className="mt-1 text-sm text-carbon/70 max-w-md">
              Administra la información de tu taller, preferencias, seguridad y datos necesarios para operar dentro
              de Reviive.
            </p>
          </div>
          <div className="relative hidden lg:block h-40">
            <Image src={`${ICONS}/dashboard-hero.png`} alt="" fill sizes="26vw" className="object-contain" unoptimized />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl w-full px-6 py-8">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                tab === t.id ? "bg-borgona text-marfil" : "bg-white/60 text-carbon/70 hover:bg-white"
              }`}
            >
              <span className="relative h-4 w-4 shrink-0">
                <Image src={`${ICONS}/${t.icono}`} alt="" fill sizes="16px" className={`object-contain ${tab === t.id ? "invert brightness-0" : ""}`} unoptimized />
              </span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "perfil" && (
          <div className="mt-6 grid lg:grid-cols-[1.6fr_1fr] gap-5 items-start">
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6">
              <h3 className="font-display text-base text-borgona">Información del taller</h3>
              <div className="mt-4 grid sm:grid-cols-[140px_1fr_1fr] gap-6">
                <div>
                  <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-rosa/30 flex items-center justify-center">
                    <span className="font-display text-4xl text-borgona">{(nombreTaller || "T")[0]}</span>
                    <span className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow cursor-default" title="Próximamente">
                      <span className="relative h-3.5 w-3.5"><Image src={`${ICONS}/cfg-icon-editar.png`} alt="" fill sizes="14px" className="object-contain" unoptimized /></span>
                    </span>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-greige/60 px-3 py-1.5 text-xs text-carbon/50 cursor-default" title="Próximamente">
                    <span className="relative h-3.5 w-3.5"><Image src={`${ICONS}/cfg-icon-camara.png`} alt="" fill sizes="14px" className="object-contain" unoptimized /></span>
                    Cambiar logo
                  </span>
                </div>
                <div className="space-y-3">
                  <Campo icono="cfg-icon-perfil.png" label="Nombre del taller" value={nombreTaller} onChange={setNombreTaller} readOnly />
                  <Campo icono="cfg-icon-persona.png" label="Responsable" value={responsable} onChange={setResponsable} />
                  <Campo icono="cfg-icon-telefono.png" label="Teléfono" value={telefono} onChange={setTelefono} />
                  <Campo icono="cfg-icon-pin.png" label="Ciudad" value={ciudad} onChange={setCiudad} readOnly />
                </div>
                <div className="space-y-3">
                  <Campo icono="cfg-icon-pin.png" label="Dirección" value={direccion} onChange={setDireccion} />
                  <Campo icono="cfg-icon-document-lines.png" label="Descripción" value={descripcion} onChange={setDescripcion} multiline />
                  <Campo icono="cfg-icon-medal.png" label="Años de experiencia" value={anios} onChange={setAnios} />
                  <Campo icono="cfg-icon-calendar-clock.png" label="Horarios de atención" value={horarios} onChange={setHorarios} multiline />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="inline-flex items-center gap-2 font-display text-base text-carbon">
                <span className="relative h-4 w-4"><Image src={`${ICONS}/cfg-icon-lock.png`} alt="" fill sizes="16px" className="object-contain" unoptimized /></span>
                Correo de acceso
              </h3>
              <p className="mt-2 text-sm text-carbon">{usuario?.email}</p>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-dorado-suave/10 p-3 text-xs text-carbon/60">
                <span className="relative h-4 w-4 shrink-0 mt-0.5"><Image src={`${ICONS}/cfg-icon-info.png`} alt="" fill sizes="16px" className="object-contain" unoptimized /></span>
                Este correo identifica tu cuenta y no puede modificarse desde esta sección.
              </div>
              <button
                type="button"
                onClick={guardarPerfil}
                disabled={guardando}
                className="mt-5 w-full rounded-full bg-borgona text-marfil px-4 py-2.5 text-sm hover:bg-borgona-dark transition-colors disabled:opacity-60"
              >
                {guardando ? "Guardando…" : "Guardar cambios"}
              </button>
              {guardado && <p className="mt-2 text-xs text-emerald-700 text-center">Cambios guardados.</p>}
            </div>
          </div>
        )}

        {tab === "servicios" && (
          <div className="mt-6 grid lg:grid-cols-2 gap-5 items-start">
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-base text-borgona">Especialidades y servicios</h3>
              <p className="mt-3 text-xs text-carbon/50">Especialidades</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {especialidades.map((e) => (
                  <span key={e} className="rounded-full bg-white/70 px-3 py-1.5 text-xs text-carbon/75">{e}</span>
                ))}
              </div>
              <p className="mt-4 text-xs text-carbon/50">Servicios ofrecidos</p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {serviciosOfrecidos.map((s) => (
                  <span key={s.label} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs text-carbon/75">
                    <span className="relative h-3.5 w-3.5 shrink-0"><Image src={`${ICONS}/${s.icono}`} alt="" fill sizes="14px" className="object-contain" unoptimized /></span>
                    {s.label}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-carbon/50">Materiales que trabaja</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {materiales.map((m) => (
                  <span key={m.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs text-carbon/75">
                    <span className="relative h-3.5 w-3.5 shrink-0"><Image src={`${ICONS}/${m.icono}`} alt="" fill sizes="14px" className="object-contain" unoptimized /></span>
                    {m.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-base text-borgona">Portafolio del taller</h3>
              <p className="mt-1 text-xs text-carbon/55">Muestra tu trabajo para que los clientes conozcan tu experiencia y calidad.</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {portafolio.map((p, i) => (
                  <span key={i} className="relative h-16 w-full rounded-xl bg-white/70 flex items-center justify-center overflow-hidden">
                    <span className="relative h-8 w-8"><Image src={`${ICONS}/${p}`} alt="" fill sizes="32px" className="object-contain" unoptimized /></span>
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-block text-sm text-borgona cursor-default" title="Próximamente">Ver mi portafolio →</span>
            </div>
          </div>
        )}

        {tab === "pago" && (
          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-5 max-w-xl">
            <h3 className="font-display text-base text-borgona">Información para recibir pagos</h3>
            <p className="mt-3 text-sm text-carbon/60">
              Todavía no has registrado tu información bancaria. Mientras tanto, tus pagos se calculan y quedan
              pendientes en <a href="/proveedor/ingresos" className="text-borgona hover:underline">Ingresos</a>.
            </p>
            <span className="mt-4 inline-block text-sm text-carbon/40 cursor-default" title="Próximamente">Agregar información de pago →</span>
          </div>
        )}

        {tab === "notificaciones" && (
          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-5 max-w-xl">
            <h3 className="font-display text-base text-borgona">Notificaciones</h3>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-xs text-carbon/50">
                  <th className="text-left pb-2">Recibir notificaciones sobre:</th>
                  <th className="pb-2">En Reviive</th>
                  <th className="pb-2">Correo</th>
                </tr>
              </thead>
              <tbody>
                {notificacionesFilas.map((f) => (
                  <tr key={f.label} className="border-t border-greige/40">
                    <td className="py-2.5 text-carbon/75">{f.label}</td>
                    {(["reviive", "correo"] as const).map((canal) => (
                      <td key={canal} className="text-center">
                        <button
                          type="button"
                          onClick={() => toggleNotif(f.label, canal)}
                          className={`relative h-5 w-9 rounded-full shrink-0 transition-colors ${notifs[f.label][canal] ? "bg-borgona" : "bg-greige/60"}`}
                        >
                          <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${notifs[f.label][canal] ? "translate-x-4" : "translate-x-0"}`} />
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "seguridad" && (
          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-5 max-w-xl">
            <h3 className="font-display text-base text-borgona">Seguridad</h3>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon">Contraseña</p>
                <p className="text-xs text-carbon/50">Última actualización: 10 ago 2026</p>
              </div>
              <span className="rounded-full border border-borgona text-borgona px-4 py-2 text-sm cursor-default" title="Próximamente">Cambiar contraseña</span>
            </div>
            <div className="mt-4 flex items-start gap-2.5">
              <span className="relative h-4 w-4 shrink-0 mt-0.5"><Image src={`${ICONS}/cfg-icon-monitor.png`} alt="" fill sizes="16px" className="object-contain" unoptimized /></span>
              <div className="flex-1">
                <p className="text-sm text-carbon">Sesiones activas</p>
                <p className="text-xs text-carbon/50">Dispositivo actual · Chrome en Windows · Medellín, Colombia · Hoy, 9:15 a. m.</p>
                <span className="inline-block mt-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px]">Este dispositivo</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-carbon">Verificación en dos pasos</p>
              <span className="text-sm text-borgona cursor-default" title="Próximamente">Activar</span>
            </div>
            <span className="mt-3 inline-block text-sm text-borgona cursor-default" title="Próximamente">Ver todas las sesiones →</span>
          </div>
        )}

        {tab === "documentos" && (
          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-5 max-w-xl">
            <h3 className="font-display text-base text-borgona">Documentos del proveedor</h3>
            <p className="mt-3 text-sm text-carbon/60">
              {verificado
                ? "Tu taller ya está validado por el equipo de Reviive."
                : "Tu taller está pendiente de validación por el equipo de Reviive."}
            </p>
            <span className="mt-4 inline-block text-sm text-carbon/40 cursor-default" title="Próximamente">Subir documentos de validación →</span>
          </div>
        )}

        {tab === "cuenta" && (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-base text-borgona">Preferencias generales</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-carbon/50">Idioma</span><span className="text-carbon">Español</span></li>
                <li className="flex justify-between"><span className="text-carbon/50">Zona horaria</span><span className="text-carbon">Colombia (UTC-5)</span></li>
                <li className="flex justify-between"><span className="text-carbon/50">Formato de moneda</span><span className="text-carbon">COP - Peso colombiano</span></li>
              </ul>
            </div>
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-base text-borgona">Términos y privacidad</h3>
              <ul className="mt-3 space-y-2 text-sm text-borgona">
                <li>Términos y condiciones para proveedores →</li>
                <li>Política de privacidad →</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-greige/50 bg-greige/20 p-5">
              <h3 className="font-display text-base text-borgona">Estado de la cuenta</h3>
              <p className={`mt-2 inline-flex items-center gap-1.5 text-sm ${verificado ? "text-emerald-700" : "text-carbon/60"}`}>
                {verificado ? "✓ Proveedor verificado" : "Pendiente de validación"}
              </p>
              <p className="mt-1 text-xs text-carbon/55">Tu cuenta está habilitada para recibir solicitudes compatibles con tus servicios y disponibilidad.</p>
              <p className="mt-4 text-xs text-carbon/50">Administración de cuenta</p>
              <div className="mt-1.5 space-y-2">
                <span className="block rounded-full border border-borgona text-borgona px-4 py-2 text-sm text-center cursor-default" title="Próximamente">Solicitar desactivación temporal</span>
                <span className="block rounded-full border border-borgona text-borgona px-4 py-2 text-sm text-center cursor-default" title="Próximamente">Solicitar cierre de cuenta</span>
              </div>
              <p className="mt-3 text-[11px] text-carbon/40">
                Al cerrar tu cuenta se conservará el historial de pedidos, pagos y evidencias según nuestras políticas.
              </p>
            </div>
          </div>
        )}

        <p className="mt-8 flex items-start gap-2 text-xs text-carbon/45">
          <span className="relative h-4 w-4 shrink-0 mt-0.5"><Image src={`${ICONS}/cfg-icon-info.png`} alt="" fill sizes="16px" className="object-contain" unoptimized /></span>
          Recuerda mantener tu información actualizada para ofrecer la mejor experiencia a tus clientes y recibir más
          oportunidades.
        </p>
      </section>
    </>
  );
}

export default function ConfiguracionPage() {
  return (
    <ProveedorShell activeHref="/proveedor/configuracion">
      <ContenidoConfiguracion />
    </ProveedorShell>
  );
}
