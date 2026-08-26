"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

export interface CapacidadProveedorAPI {
  id: number;
  producto: number;
  material: string;
  ciudad: string;
  tiempo_estimado_dias: number;
}

export interface DiaBloqueadoAPI {
  id: number;
  fecha: string;
}

export interface ProveedorAPI {
  id: number;
  nombre_taller: string;
  ciudad: string;
  estado_validacion: "pendiente" | "validado" | "suspendido";
  calificacion: string;
  capacidades: CapacidadProveedorAPI[];
  direccion: string;
  descripcion: string;
  anios_experiencia: string;
  horario_atencion: string;
  capacidad_maxima: number;
  disponible: boolean;
  dias_bloqueados: DiaBloqueadoAPI[];
}

interface ProveedorContextValue {
  proveedor: ProveedorAPI | null;
  cargandoProveedor: boolean;
  refrescarProveedor: () => void;
}

const ProveedorContext = createContext<ProveedorContextValue>({
  proveedor: null,
  cargandoProveedor: true,
  refrescarProveedor: () => {},
});

export function ProveedorProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [proveedor, setProveedor] = useState<ProveedorAPI | null>(null);
  const [cargandoProveedor, setCargandoProveedor] = useState(true);

  function cargar() {
    if (!accessToken) return;
    fetch(`${API_URL}/providers/me/`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then(setProveedor)
      .catch(() => setProveedor(null))
      .finally(() => setCargandoProveedor(false));
  }

  useEffect(cargar, [accessToken]);

  return (
    <ProveedorContext.Provider value={{ proveedor, cargandoProveedor, refrescarProveedor: cargar }}>
      {children}
    </ProveedorContext.Provider>
  );
}

export function useProveedor(): ProveedorContextValue {
  return useContext(ProveedorContext);
}
