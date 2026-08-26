"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  iniciarSesion,
  obtenerPerfil,
  refrescarToken,
  registrarUsuario,
  type DatosRegistro,
  type SesionUsuario,
} from "@/lib/auth";

const STORAGE_KEY = "reviive_access_token";
const REFRESH_STORAGE_KEY = "reviive_refresh_token";

// El access token dura 30 min (ver Backend/api/config/settings.py,
// SIMPLE_JWT.ACCESS_TOKEN_LIFETIME). Se renueva 5 min antes de vencer para
// que una sesión abierta (p. ej. alguien llenando un formulario largo) no
// termine con un "token invalid or expired" a mitad de camino.
const RENOVAR_CADA_MS = 25 * 60 * 1000;

type AuthContextValue = {
  accessToken: string | null;
  usuario: SesionUsuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<SesionUsuario>;
  registrar: (datos: DatosRegistro) => Promise<SesionUsuario>;
  actualizarUsuario: (usuario: SesionUsuario) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function limpiarSesion() {
    if (timerRef.current) clearTimeout(timerRef.current);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
    setAccessToken(null);
    setUsuario(null);
  }

  function programarRenovacion() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const refresh = localStorage.getItem(REFRESH_STORAGE_KEY);
      if (!refresh) return;
      try {
        const { access } = await refrescarToken(refresh);
        localStorage.setItem(STORAGE_KEY, access);
        setAccessToken(access);
        programarRenovacion();
      } catch {
        // El refresh token también venció (7 días de inactividad) o fue
        // revocado: no hay forma de seguir, se cierra la sesión.
        limpiarSesion();
      }
    }, RENOVAR_CADA_MS);
  }

  useEffect(() => {
    const accessGuardado = localStorage.getItem(STORAGE_KEY);
    const refreshGuardado = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (!accessGuardado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restauración de sesión al montar, corre una sola vez
      setCargando(false);
      return;
    }

    obtenerPerfil(accessGuardado)
      .then((perfil) => {
        setAccessToken(accessGuardado);
        setUsuario(perfil);
        programarRenovacion();
      })
      .catch(async () => {
        // El access guardado ya venció; si todavía hay refresh token
        // vigente, se intenta renovar antes de forzar un nuevo login.
        if (!refreshGuardado) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }
        try {
          const { access } = await refrescarToken(refreshGuardado);
          const perfil = await obtenerPerfil(access);
          localStorage.setItem(STORAGE_KEY, access);
          setAccessToken(access);
          setUsuario(perfil);
          programarRenovacion();
        } catch {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(REFRESH_STORAGE_KEY);
        }
      })
      .finally(() => setCargando(false));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const tokens = await iniciarSesion(email, password);
    const perfil = await obtenerPerfil(tokens.access);
    localStorage.setItem(STORAGE_KEY, tokens.access);
    localStorage.setItem(REFRESH_STORAGE_KEY, tokens.refresh);
    setAccessToken(tokens.access);
    setUsuario(perfil);
    programarRenovacion();
    return perfil;
  }

  async function registrar(datos: DatosRegistro) {
    const respuesta = await registrarUsuario(datos);
    localStorage.setItem(STORAGE_KEY, respuesta.access);
    localStorage.setItem(REFRESH_STORAGE_KEY, respuesta.refresh);
    setAccessToken(respuesta.access);
    const perfil = respuesta.usuario ?? (await obtenerPerfil(respuesta.access));
    setUsuario(perfil);
    programarRenovacion();
    return perfil;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        usuario,
        cargando,
        login,
        registrar,
        actualizarUsuario: setUsuario,
        logout: limpiarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
