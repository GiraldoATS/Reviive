"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { iniciarSesion, obtenerPerfil, type SesionUsuario } from "@/lib/auth";

const STORAGE_KEY = "reviive_access_token";

type AuthContextValue = {
  accessToken: string | null;
  usuario: SesionUsuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (!guardado) {
      setCargando(false);
      return;
    }
    obtenerPerfil(guardado)
      .then((perfil) => {
        setAccessToken(guardado);
        setUsuario(perfil);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setCargando(false));
  }, []);

  async function login(email: string, password: string) {
    const tokens = await iniciarSesion(email, password);
    const perfil = await obtenerPerfil(tokens.access);
    localStorage.setItem(STORAGE_KEY, tokens.access);
    setAccessToken(tokens.access);
    setUsuario(perfil);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setAccessToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
