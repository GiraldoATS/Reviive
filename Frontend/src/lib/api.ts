import type { Producto } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ProductoApi {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio_base: string;
  icono: string;
  imagen_url: string;
  activo: boolean;
}

function mapProducto(p: ProductoApi): Producto {
  return {
    id: String(p.id),
    nombre: p.nombre,
    categoria: p.categoria,
    descripcion: p.descripcion,
    precioBase: Number(p.precio_base),
    imagen: p.icono,
    imagenUrl: p.imagen_url,
    activo: p.activo,
  };
}

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/products/`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`No se pudo cargar el catálogo (status ${res.status})`);
  }
  const data: Paginated<ProductoApi> = await res.json();
  return data.results.map(mapProducto);
}

export interface ProductoExplorado {
  id: string;
  nombre: string;
  categoria: string;
  icono: string;
  imagenUrl: string;
  vecesRecomendado: number;
}

/**
 * "Lo que más están explorando": no es una lista fija — corre el
 * clasificador de ML (Backend/ml) sobre los objetos reales que los
 * clientes ya registraron y devuelve los productos que el modelo más
 * recomendó. Si todavía no hay objetos registrados, devuelve [] (sin
 * relleno falso).
 */
export async function getMasExplorados(): Promise<ProductoExplorado[]> {
  const res = await fetch(`${API_URL}/ml/mas-explorados`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data: {
    id: number;
    nombre: string;
    categoria: string;
    icono: string;
    imagen_url: string;
    veces_recomendado: number;
  }[] = await res.json();
  return data.map((p) => ({
    id: String(p.id),
    nombre: p.nombre,
    categoria: p.categoria,
    icono: p.icono,
    imagenUrl: p.imagen_url,
    vecesRecomendado: p.veces_recomendado,
  }));
}

export interface DatosMensajeContacto {
  nombre: string;
  correo: string;
  telefono?: string;
  motivo?: string;
  mensaje: string;
  foto_base64?: string;
}

async function leerErrorApi(res: Response, generico: string): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.error?.mensaje === "string") return data.error.mensaje;
  } catch {
    // sin cuerpo JSON legible; se mantiene el mensaje genérico
  }
  return generico;
}

export async function enviarMensajeContacto(datos: DatosMensajeContacto): Promise<void> {
  const res = await fetch(`${API_URL}/contacto/mensajes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(await leerErrorApi(res, "No se pudo enviar tu mensaje."));
}

export interface DatosSolicitudEvaluacion {
  historia: string;
  objeto: {
    tipo: string;
    categoria?: string;
    estado?: string;
    nivel_transformacion?: string;
    fotos_base64?: string[];
  };
}

export async function crearSolicitudEvaluacion(
  accessToken: string,
  datos: DatosSolicitudEvaluacion
): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/memories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      historia: datos.historia,
      privacidad: "privado",
      objetos: [datos.objeto],
    }),
  });
  if (!res.ok) throw new Error(await leerErrorApi(res, "No se pudo enviar tu solicitud."));
  return res.json();
}
