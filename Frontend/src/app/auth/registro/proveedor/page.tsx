"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { destinoPorRol, sugerirUsername } from "@/lib/auth";
import { IconStar, IconBox, IconChevronDown } from "@/components/icons";

const ICONS = "/images/auth/registro-proveedor";
const ICONS_CLIENTE = "/images/auth/registro-cliente";

function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result as string);
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}

const beneficios = [
  { icono: `${ICONS_CLIENTE}/icon-shield-check.png`, titulo: "Visibilidad para tu taller", texto: "Muestra tu experiencia y destaca lo que te hace único." },
  { icono: `${ICONS_CLIENTE}/icon-heart.png`, titulo: "Comunidad y confianza", texto: "Sé parte de una red de expertos que valoran la autenticidad." },
  { icono: `${ICONS_CLIENTE}/icon-hourglass.png`, titulo: "Proyectos con propósito", texto: "Participa en restauraciones significativas que preservan nuestra historia." },
];

function Divider() {
  return (
    <span className="relative mx-auto my-4 block h-8 w-40">
      <Image src={`${ICONS}/divider-hoja.png`} alt="" fill sizes="160px" className="object-contain" unoptimized />
    </span>
  );
}

function CampoTexto({
  label,
  icono,
  ...props
}: { label: string; icono: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-sm text-carbon/80 mb-1.5">
        {label} <span className="text-borgona">*</span>
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4">
          <Image src={`${ICONS_CLIENTE}/${icono}`} alt="" fill sizes="16px" className="object-contain" unoptimized />
        </span>
        <input
          required
          {...props}
          className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 pl-10 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
        />
      </div>
    </label>
  );
}

function CampoIcono({
  label,
  icono,
  helper,
  ...props
}: { label: string; icono: React.ComponentType<{ className?: string }>; helper?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const Icono = icono;
  return (
    <label className="block">
      <span className="block text-sm text-carbon/80 mb-1.5">
        {label} <span className="text-borgona">*</span>
      </span>
      <div className="relative">
        <Icono className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dorado-suave" />
        <input
          required
          {...props}
          className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 pl-10 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
        />
      </div>
      {helper && <p className="mt-1 text-xs text-carbon/45">{helper}</p>}
    </label>
  );
}

function CampoPassword({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <label className="block">
      <span className="block text-sm text-carbon/80 mb-1.5">
        {label} <span className="text-borgona">*</span>
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4">
          <Image src={`${ICONS_CLIENTE}/icon-lock.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
        </span>
        <input
          type={mostrar ? "text" : "password"}
          required
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 pl-10 pr-10 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
        />
        <button
          type="button"
          onClick={() => setMostrar((v) => !v)}
          aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
        >
          <Image src={`${ICONS_CLIENTE}/icon-eye.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
        </button>
      </div>
    </label>
  );
}

function CampoArchivo({
  label,
  icono,
  aceptar,
  formatos,
  archivo,
  onSeleccionar,
}: {
  label: string;
  icono: string;
  aceptar: string;
  formatos: string;
  archivo: File | null;
  onSeleccionar: (f: File | null) => void;
}) {
  return (
    <label className="block cursor-pointer">
      <span className="block text-sm text-carbon/80 mb-1.5">
        {label} <span className="text-borgona">*</span>
      </span>
      <div className="rounded-xl border border-dashed border-greige/70 bg-marfil px-4 py-6 text-center hover:border-borgona/40 transition-colors">
        <span className="relative h-10 w-10 mx-auto block">
          <Image src={`${ICONS}/${icono}`} alt="" fill sizes="40px" className="object-contain" unoptimized />
        </span>
        <p className="mt-2 text-sm text-carbon">{archivo ? archivo.name : `Subir ${label.toLowerCase()}`}</p>
        <p className="mt-1 text-xs text-carbon/45">{formatos}</p>
        <input
          type="file"
          accept={aceptar}
          className="hidden"
          onChange={(e) => onSeleccionar(e.target.files?.[0] ?? null)}
        />
      </div>
    </label>
  );
}

export default function RegistroProveedorPage() {
  const router = useRouter();
  const { registrar } = useAuth();
  const [nombreTaller, setNombreTaller] = useState("");
  const [nombreResponsable, setNombreResponsable] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [especialidades, setEspecialidades] = useState("");
  const [materiales, setMateriales] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [portafolio, setPortafolio] = useState<File | null>(null);
  const [documentos, setDocumentos] = useState<File | null>(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!aceptaTerminos) {
      setError("Debes aceptar los Términos y la Política de Privacidad para continuar.");
      return;
    }
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      const documentosBase64 = (
        await Promise.all(
          [
            portafolio ? { archivo: portafolio, tipo: "portafolio" as const } : null,
            documentos ? { archivo: documentos, tipo: "documento_legal" as const } : null,
          ].map(async (item) => {
            if (!item) return null;
            const base64 = await archivoABase64(item.archivo);
            return { tipo: item.tipo, nombre: item.archivo.name, base64 };
          })
        )
      ).filter((d): d is { tipo: "portafolio" | "documento_legal"; nombre: string; base64: string } => d !== null);

      const perfil = await registrar({
        username: sugerirUsername(email),
        email,
        password,
        nombre: nombreResponsable,
        nombre_taller: nombreTaller,
        ciudad: ciudad || undefined,
        telefono: telefono || undefined,
        consentimiento_datos: aceptaTerminos,
        rol: "proveedor",
        documentos: documentosBase64,
      });
      router.push(destinoPorRol(perfil.rol));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-marfil flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-xl grid lg:grid-cols-2 bg-marfil">
        <div className="relative hidden lg:flex flex-col overflow-hidden" style={{ backgroundColor: "#f2e7dd" }}>
          <div className="pointer-events-none absolute -left-6 -top-6 h-56 w-56 opacity-70">
            <Image src={`${ICONS}/rama-esquina.png`} alt="" fill sizes="224px" className="object-contain" unoptimized />
          </div>

          <div className="relative px-10 pt-10">
            <div className="flex items-center gap-3">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={`${ICONS_CLIENTE}/icon-hourglass.png`} alt="" fill sizes="36px" className="object-contain" unoptimized />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl tracking-wide text-borgona-dark">REVIIVE</span>
                <span className="block text-[9px] tracking-[0.2em] text-dorado-suave">MEMORIAS QUE VIVEN PARA SIEMPRE</span>
              </span>
            </div>

            <div className="mt-10 max-w-xs">
              <h1 className="font-display text-4xl leading-tight text-borgona-dark">
                Tu oficio merece el lugar que inspira <span className="text-dorado-suave">confianza.</span>
              </h1>
              <div className="flex items-center gap-3 my-5">
                <span className="h-px w-14 bg-dorado-suave/50" />
                <span className="relative h-5 w-5 shrink-0">
                  <Image src={`${ICONS_CLIENTE}/icon-hourglass.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
                </span>
                <span className="h-px w-14 bg-dorado-suave/50" />
              </div>
              <p className="text-base text-carbon font-medium">
                En Reviive conectamos a personas que valoran la autenticidad con talleres, artesanos y
                especialistas en restauración que mantienen vivo el patrimonio.
              </p>
            </div>
          </div>

          <div className="relative mt-8 flex-1 w-full">
            <Image src={`${ICONS}/hero-objetos.png`} alt="" fill sizes="50vw" className="object-cover object-top" unoptimized />
          </div>
        </div>

        <div className="px-6 py-10 sm:px-12 sm:py-12">
          <p className="text-center text-xs font-medium tracking-[0.2em] text-borgona">REGISTRO DE PROVEEDOR</p>
          <Divider />
          <h2 className="text-center font-display text-3xl text-carbon">Únete a Reviive</h2>
          <p className="mt-2 text-center text-sm text-carbon/70">
            Talleres, artesanos y especialistas en restauración
          </p>

          <form className="mt-7 space-y-4" onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <CampoTexto
                label="Nombre del taller o empresa"
                icono="icon-persona.png"
                placeholder="Ej. Taller Arte y Memoria"
                value={nombreTaller}
                onChange={(e) => setNombreTaller(e.target.value)}
              />
              <CampoTexto
                label="Nombre del responsable"
                icono="icon-persona.png"
                placeholder="Ej. María Fernanda López"
                value={nombreResponsable}
                onChange={(e) => setNombreResponsable(e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <CampoTexto
                label="Correo electrónico"
                icono="icon-envelope.png"
                type="email"
                placeholder="ejemplo@taller.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CampoTexto
                label="Teléfono"
                icono="icon-telefono.png"
                type="tel"
                placeholder="+57 300 123 4567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <label className="block">
              <span className="block text-sm text-carbon/80 mb-1.5">
                Ciudad <span className="text-borgona">*</span>
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4">
                  <Image src={`${ICONS_CLIENTE}/icon-mappin.png`} alt="" fill sizes="16px" className="object-contain" unoptimized />
                </span>
                <select
                  required
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 pl-10 pr-10 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50"
                >
                  <option value="" disabled>Selecciona tu ciudad</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Cali">Cali</option>
                  <option value="Barranquilla">Barranquilla</option>
                  <option value="Cartagena">Cartagena</option>
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/50" />
              </div>
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <CampoIcono
                label="Especialidades"
                icono={IconStar}
                placeholder="Ej. Restauración de muebles, dorado..."
                helper="Puedes seleccionar varias"
                value={especialidades}
                onChange={(e) => setEspecialidades(e.target.value)}
              />
              <CampoIcono
                label="Tipo de materiales que trabaja"
                icono={IconBox}
                placeholder="Ej. Madera, metal, tela, papel..."
                helper="Puedes seleccionar varias"
                value={materiales}
                onChange={(e) => setMateriales(e.target.value)}
              />
            </div>

            <label className="block">
              <span className="block text-sm text-carbon/80 mb-1.5">
                Experiencia <span className="text-borgona">*</span>
              </span>
              <textarea
                required
                maxLength={500}
                rows={3}
                placeholder="Cuéntanos sobre tu trayectoria, años de experiencia y proyectos destacados."
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
                className="w-full rounded-xl border border-greige/70 bg-marfil px-3.5 py-3 text-sm text-carbon/80 outline-none transition-colors focus:border-borgona/50 resize-none"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-carbon/45">
                <span>Máximo 500 caracteres</span>
                <span>{experiencia.length}/500</span>
              </div>
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <CampoPassword label="Contraseña" value={password} onChange={setPassword} placeholder="Crea una contraseña segura" />
              <CampoPassword
                label="Confirmar contraseña"
                value={confirmarPassword}
                onChange={setConfirmarPassword}
                placeholder="Confirma tu contraseña"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <CampoArchivo
                label="Portafolio de trabajos"
                icono="icon-upload-imagen.png"
                aceptar="image/*,.pdf"
                formatos="PNG, JPG o PDF. Máx. 10MB por archivo"
                archivo={portafolio}
                onSeleccionar={setPortafolio}
              />
              <CampoArchivo
                label="Documentos"
                icono="icon-upload-documento.png"
                aceptar=".pdf,.jpg,.jpeg,.png"
                formatos="PDF, JPG o PNG. Máx. 10MB por archivo"
                archivo={documentos}
                onSeleccionar={setDocumentos}
              />
            </div>

            <label className="flex items-start gap-2.5 text-sm text-carbon/70">
              <input
                type="checkbox"
                className="accent-borgona mt-0.5 shrink-0"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <span>
                Acepto los{" "}
                <Link href="/terminos" className="text-borgona underline">Términos y Condiciones</Link> y la{" "}
                <Link href="/politica-privacidad" className="text-borgona underline">Política de Privacidad</Link>.
              </span>
            </label>

            {error && <p className="text-sm text-borgona">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-full bg-borgona text-marfil px-6 py-3.5 text-sm inline-flex items-center justify-center gap-2.5 hover:bg-borgona-dark transition-colors disabled:opacity-60"
            >
              <span className="relative h-5 w-5 shrink-0">
                <Image src={`${ICONS_CLIENTE}/icon-hourglass.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
              </span>
              {enviando ? "Enviando…" : "Solicitar registro"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-px w-16 bg-dorado-suave/50" />
            <span className="relative h-5 w-5 shrink-0">
              <Image src={`${ICONS_CLIENTE}/icon-heart.png`} alt="" fill sizes="20px" className="object-contain" unoptimized />
            </span>
            <span className="h-px w-16 bg-dorado-suave/50" />
          </div>

          <p className="text-center text-sm">
            <Link href="/auth/login" className="text-borgona hover:text-borgona-dark transition-colors">
              Ya tengo cuenta →
            </Link>
          </p>

          <div className="mt-6 rounded-2xl border border-greige/50 bg-greige/20 p-5 grid sm:grid-cols-3 gap-5 text-center">
            {beneficios.map((b) => (
              <div key={b.titulo}>
                <span className="relative h-8 w-8 mx-auto block">
                  <Image src={b.icono} alt="" fill sizes="32px" className="object-contain" unoptimized />
                </span>
                <h3 className="mt-2 font-display text-sm text-borgona">{b.titulo}</h3>
                <p className="mt-1 text-xs text-carbon/60">{b.texto}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-carbon/40">
            © 2026 Reviive. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
