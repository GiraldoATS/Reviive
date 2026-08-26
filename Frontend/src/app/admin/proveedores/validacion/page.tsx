"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ProveedorApi {
  id: number;
  nombre_taller: string;
  ciudad: string;
  estado_validacion: "pendiente" | "validado" | "suspendido";
}

interface DocumentoApi {
  id: number;
  tipo: string;
  tipo_display: string;
  nombre_archivo: string;
  archivo_base64: string;
  estado_revision: "pendiente" | "aprobado" | "rechazado";
}

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  pendiente: "progress",
  validado: "success",
  suspendido: "pending",
  aprobado: "success",
  rechazado: "pending",
};

const labelByEstado: Record<string, string> = {
  pendiente: "Pendiente",
  validado: "Validado",
  suspendido: "Suspendido/Rechazado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

function FilaProveedor({ proveedor, onDecidido }: { proveedor: ProveedorApi; onDecidido: () => void }) {
  const { accessToken } = useAuth();
  const [documentos, setDocumentos] = useState<DocumentoApi[] | null>(null);
  const [procesando, setProcesando] = useState(false);

  function cargarDocumentos() {
    if (!accessToken) return;
    fetch(`${API_URL}/providers/${proveedor.id}/documentos/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then(setDocumentos)
      .catch(() => setDocumentos([]));
  }

  useEffect(cargarDocumentos, [accessToken, proveedor.id]);

  async function revisarDocumento(docId: number, estado: "aprobado" | "rechazado") {
    if (!accessToken) return;
    await fetch(`${API_URL}/providers/${proveedor.id}/documentos/${docId}/revisar/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ estado_revision: estado }),
    });
    cargarDocumentos();
  }

  async function decidirProveedor(accion: "aprobar" | "rechazar") {
    if (!accessToken) return;
    setProcesando(true);
    try {
      await fetch(`${API_URL}/providers/${proveedor.id}/validar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ accion }),
      });
      onDecidido();
    } finally {
      setProcesando(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg text-carbon">{proveedor.nombre_taller}</h2>
          <p className="text-sm text-carbon/55">{proveedor.ciudad}</p>
        </div>
        <Badge tone={toneByEstado[proveedor.estado_validacion]}>{labelByEstado[proveedor.estado_validacion]}</Badge>
      </div>

      <div className="grid md:grid-cols-[1fr_260px] gap-6">
        <div>
          <h3 className="text-xs uppercase tracking-wide text-carbon/50 mb-3">Documentos enviados</h3>
          {!documentos ? (
            <p className="text-sm text-carbon/50">Cargando…</p>
          ) : documentos.length === 0 ? (
            <p className="text-sm text-carbon/50">Este proveedor no ha subido documentos todavía.</p>
          ) : (
            <ul className="divide-y divide-greige/50">
              {documentos.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <a href={d.archivo_base64} download={d.nombre_archivo || d.tipo_display} className="shrink-0">
                      <span className="relative block h-10 w-10 rounded-lg overflow-hidden border border-greige/60 bg-marfil">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={d.archivo_base64} alt="" className="h-full w-full object-cover" />
                      </span>
                    </a>
                    <div className="min-w-0">
                      <p className="text-sm text-carbon truncate">{d.tipo_display}</p>
                      <p className="text-xs text-carbon/45 truncate">{d.nombre_archivo || "archivo sin nombre"}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Badge tone={toneByEstado[d.estado_revision]}>{labelByEstado[d.estado_revision]}</Badge>
                    {d.estado_revision === "pendiente" && (
                      <>
                        <button onClick={() => revisarDocumento(d.id, "aprobado")} className="text-xs text-emerald-700 hover:underline">
                          Aprobar
                        </button>
                        <button onClick={() => revisarDocumento(d.id, "rechazado")} className="text-xs text-borgona hover:underline">
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Card className="h-fit space-y-3">
          <h3 className="text-xs uppercase tracking-wide text-carbon/50">Decisión</h3>
          <Button variant="primary" className="w-full justify-center" onClick={() => decidirProveedor("aprobar")} disabled={procesando}>
            Aprobar proveedor
          </Button>
          <Button variant="ghost" className="w-full justify-center text-[#a64b4b]" onClick={() => decidirProveedor("rechazar")} disabled={procesando}>
            Rechazar / suspender
          </Button>
        </Card>
      </div>
    </Card>
  );
}

function ContenidoValidacion() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const proveedorId = searchParams.get("proveedor");
  const [proveedores, setProveedores] = useState<ProveedorApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const soloOne = !!proveedorId;

  function cargar() {
    if (!accessToken) return;
    const url = proveedorId ? `${API_URL}/providers/${proveedorId}/` : `${API_URL}/providers/`;
    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar la información de validación.");
        return r.json();
      })
      .then((data) => {
        if (proveedorId) {
          setProveedores([data]);
        } else {
          const todos: ProveedorApi[] = data.results ?? data;
          setProveedores(todos.filter((p) => p.estado_validacion === "pendiente"));
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }

  useEffect(() => {
    if (cargandoSesion) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, cargandoSesion, proveedorId]);

  return (
    <RolePortalShell role="admin" crumbs={["Administración", "Proveedores", "Validación"]}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-carbon">Validación de proveedores</h1>
          <p className="text-sm text-carbon/55">
            {soloOne ? "Revisa este proveedor y decide." : "Talleres pendientes de aprobación."}
          </p>
        </div>
        {soloOne && (
          <button onClick={() => router.push("/admin/proveedores/validacion")} className="text-xs text-borgona hover:underline">
            Ver toda la cola →
          </button>
        )}
      </div>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!proveedores && !error && <p className="text-sm text-carbon/50">Cargando…</p>}
      {proveedores && proveedores.length === 0 && (
        <p className="text-sm text-carbon/50">No hay proveedores pendientes de validación en este momento.</p>
      )}

      <div className="space-y-6">
        {proveedores?.map((p) => (
          <FilaProveedor key={p.id} proveedor={p} onDecidido={cargar} />
        ))}
      </div>
    </RolePortalShell>
  );
}

export default function ValidacionProveedorAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ContenidoValidacion />
    </Suspense>
  );
}
