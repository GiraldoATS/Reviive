import { API_URL } from "@/lib/api";
import type { RolUsuario } from "@/types";

export interface SesionUsuario {
  id: number;
  email: string;
  rol: RolUsuario;
  estado: string;
  perfil: { nombre: string; ciudad: string } | null;
}

export interface TokensAuth {
  access: string;
  refresh: string;
}

export interface RespuestaAuth extends TokensAuth {
  usuario?: SesionUsuario;
}

async function leerError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    const primerCampo = Object.values(data ?? {})[0];
    if (Array.isArray(primerCampo)) return String(primerCampo[0]);
    return "No se pudo completar la solicitud.";
  } catch {
    return "No se pudo completar la solicitud.";
  }
}

export async function iniciarSesion(email: string, password: string): Promise<TokensAuth> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await leerError(res));
  return res.json();
}

export interface DatosRegistro {
  username: string;
  email: string;
  password: string;
  nombre: string;
  ciudad?: string;
  consentimiento_datos: boolean;
  rol?: "cliente" | "proveedor";
  nombre_taller?: string;
}

export async function registrarUsuario(datos: DatosRegistro): Promise<RespuestaAuth> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(await leerError(res));
  return res.json();
}

/** Deriva un username a partir del correo (Django lo exige, pero la UI no lo pide). */
export function sugerirUsername(email: string): string {
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const sufijo = Math.random().toString(36).slice(2, 6);
  return `${base || "usuario"}-${sufijo}`;
}

export async function obtenerPerfil(accessToken: string): Promise<SesionUsuario> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(await leerError(res));
  return res.json();
}
