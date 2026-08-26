"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ClienteShell from "@/components/ClienteShell";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";
import { IconCheckCircle } from "@/components/icons";

interface ArchivoApi {
  id: string;
  url: string;
}
interface ObjetoMemoriaApi {
  id: string;
  tipo: string;
  categoria: string;
  marca: string;
  anio_aproximado: string;
  material: string;
  estado: string;
  nivel_transformacion: string;
  archivos: ArchivoApi[];
  fotos_base64: string[];
}
interface RecuerdoApi {
  id: string;
  cliente_nombre: string;
  persona_recordada: string;
  historia: string;
  privacidad: string;
  objetos: ObjetoMemoriaApi[];
  recomendaciones_resumen: { total: number; requiere_revision_humana: boolean };
  creado_en: string;
  actualizado_en: string;
}

const PRIVACIDAD_LABEL: Record<string, string> = {
  privado: "Privado",
  compartido: "Compartido",
  publico: "Público",
};

function fechaLarga(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
}

function fotosDe(objeto: ObjetoMemoriaApi): string[] {
  const deArchivos = (objeto.archivos ?? []).map((a) => a.url).filter(Boolean);
  const deBase64 = objeto.fotos_base64 ?? [];
  return [...deArchivos, ...deBase64];
}

export default function DetalleRecuerdoPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [recuerdo, setRecuerdo] = useState<RecuerdoApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/memories/${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (res.status === 404 || res.status === 403) throw new Error("No encontramos ese recuerdo, o no tienes acceso a él.");
        if (!res.ok) throw new Error("No se pudo cargar el recuerdo.");
        return res.json();
      })
      .then(setRecuerdo)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion, id]);

  return (
    <ClienteShell activeHref="/mis-recuerdos">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {!cargandoSesion && !accessToken && (
          <p className="text-center text-carbon/70 py-14">
            Inicia sesión para ver este recuerdo.{" "}
            <Link href="/auth/login" className="text-borgona underline">Iniciar sesión →</Link>
          </p>
        )}

        {error && <p className="text-center text-borgona py-14">{error}</p>}

        {!error && !recuerdo && (accessToken || cargandoSesion) && (
          <p className="text-center text-carbon/50 py-14">Cargando tu recuerdo…</p>
        )}

        {recuerdo && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <Link href="/mis-recuerdos" className="text-xs text-borgona hover:text-borgona-dark transition-colors">
                  ← Volver a mis recuerdos
                </Link>
                <h1 className="mt-2 font-display text-3xl text-carbon">{recuerdo.persona_recordada || "Recuerdo"}</h1>
                <p className="mt-1 text-sm text-carbon/55">
                  Registrado el {fechaLarga(recuerdo.creado_en)} · {PRIVACIDAD_LABEL[recuerdo.privacidad] ?? recuerdo.privacidad}
                </p>
              </div>
              {recuerdo.recomendaciones_resumen.total > 0 && (
                <Link
                  href={`/recomendaciones?recuerdo=${recuerdo.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 text-xs"
                >
                  <IconCheckCircle className="h-3.5 w-3.5" />
                  {recuerdo.recomendaciones_resumen.total} recomendación(es) generadas →
                </Link>
              )}
            </div>

            {recuerdo.historia && (
              <div className="rounded-2xl border border-greige/50 bg-greige/20 p-6 mb-6">
                <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">La historia</h2>
                <p className="text-sm text-carbon/75 whitespace-pre-line">{recuerdo.historia}</p>
              </div>
            )}

            <h2 className="font-display text-xl text-carbon mb-3">
              Objeto{recuerdo.objetos.length !== 1 ? "s" : ""} registrado{recuerdo.objetos.length !== 1 ? "s" : ""}
            </h2>

            {recuerdo.objetos.length === 0 ? (
              <p className="text-sm text-carbon/50">Este recuerdo todavía no tiene objetos registrados.</p>
            ) : (
              <div className="space-y-5">
                {recuerdo.objetos.map((objeto) => {
                  const fotos = fotosDe(objeto);
                  return (
                    <div key={objeto.id} className="rounded-2xl border border-greige/50 bg-greige/20 overflow-hidden">
                      {fotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-0.5 bg-greige/40">
                          {fotos.slice(0, 3).map((src, i) => (
                            <div key={i} className="relative aspect-square">
                              <Image src={src} alt="" fill sizes="200px" className="object-cover" unoptimized />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="p-5 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <p><span className="text-carbon/50">Tipo:</span> <span className="text-carbon">{objeto.tipo || "—"}</span></p>
                        <p><span className="text-carbon/50">Categoría:</span> <span className="text-carbon">{objeto.categoria || "—"}</span></p>
                        {objeto.marca && <p><span className="text-carbon/50">Marca:</span> <span className="text-carbon">{objeto.marca}</span></p>}
                        {objeto.anio_aproximado && <p><span className="text-carbon/50">Año aproximado:</span> <span className="text-carbon">{objeto.anio_aproximado}</span></p>}
                        {objeto.material && <p><span className="text-carbon/50">Material:</span> <span className="text-carbon">{objeto.material}</span></p>}
                        {objeto.nivel_transformacion && <p><span className="text-carbon/50">Transformación deseada:</span> <span className="text-carbon">{objeto.nivel_transformacion}</span></p>}
                        {objeto.estado && (
                          <p className="sm:col-span-2">
                            <span className="text-carbon/50">Estado actual:</span> <span className="text-carbon">{objeto.estado}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`/recomendaciones?recuerdo=${recuerdo.id}`} variant="primary">Ver recomendaciones</Button>
              <Button href="/mis-cotizaciones" variant="secondary">Ver mis cotizaciones</Button>
            </div>
          </>
        )}
      </div>
    </ClienteShell>
  );
}
