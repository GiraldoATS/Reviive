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
