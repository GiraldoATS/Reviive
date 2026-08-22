"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Mensaje } from "@/types";
import { IconEnviar } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL ??
  "http://127.0.0.1:5678/webhook/reviive/conversations/message";

const sugerencias = [
  { texto: "Quiero iniciar un proyecto" },
  { texto: "Consultar el estado de mi pedido" },
  { texto: "Tener recomendaciones" },
  { texto: "Hablar con un asesor" },
];

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

function horaActual() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

interface RespuestaWebhookAlma {
  conversacion_id: string;
  run_id: string;
  reply: string;
  estado: string;
}

export default function ChatAlma() {
  const { accessToken, cargando } = useAuth();
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "seed-1",
      rol: "alma",
      contenido:
        "¡Hola! Soy Alma, estoy aquí para acompañarte en cada paso de tu experiencia Reviive. ¿En qué puedo ayudarte hoy?",
      hora: horaActual(),
    },
  ]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const conversacionId = useRef<string | null>(null);
  const creandoConversacion = useRef(false);

  useEffect(() => {
    async function asegurarConversacion() {
      if (!accessToken || conversacionId.current || creandoConversacion.current) return;
      creandoConversacion.current = true;
      try {
        const res = await fetch(`${API_URL}/conversations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ canal: "web" }),
        });
        if (res.ok) {
          const data = await res.json();
          conversacionId.current = data.id;
        }
      } catch {
        // Se reintenta en el próximo envío si falla ahora.
      } finally {
        creandoConversacion.current = false;
      }
    }
    asegurarConversacion();
  }, [accessToken]);

  async function enviar(contenido: string) {
    if (!contenido.trim() || enviando || !accessToken) return;

    const mensajeUsuario: Mensaje = {
      id: nextId(),
      rol: "usuario",
      contenido,
      hora: horaActual(),
    };
    setMensajes((prev) => [...prev, mensajeUsuario]);
    setTexto("");
    setEnviando(true);

    try {
      if (!conversacionId.current) {
        const res = await fetch(`${API_URL}/conversations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ canal: "web" }),
        });
        if (!res.ok) throw new Error("No se pudo iniciar la conversación.");
        const data = await res.json();
        conversacionId.current = data.id;
      }

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          conversacion_id: conversacionId.current,
          mensaje: contenido,
        }),
      });
      if (!res.ok) throw new Error("Alma no respondió a tiempo.");
      const data: RespuestaWebhookAlma = await res.json();

      setMensajes((prev) => [
        ...prev,
        {
          id: nextId(),
          rol: "alma",
          contenido: data.reply || "No pude generar una respuesta, intenta de nuevo.",
          hora: horaActual(),
        },
      ]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        {
          id: nextId(),
          rol: "alma",
          contenido:
            "No pude conectarme en este momento. Verifica tu conexión e intenta de nuevo en unos segundos.",
          hora: horaActual(),
        },
      ]);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return (
      <div className="mx-auto max-w-lg border border-greige/70 rounded-2xl bg-white/70 shadow-sm flex items-center justify-center h-[640px] text-sm text-carbon/50">
        Cargando…
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="mx-auto max-w-lg border border-greige/60 rounded-[2.5rem] bg-marfil shadow-sm flex flex-col items-center justify-center h-[640px] gap-5 px-10 text-center">
        <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-rosa/30">
          <Image src="/images/alma-chat-v2.png" alt="Alma" fill sizes="128px" className="object-cover" />
        </div>
        <p className="font-display text-2xl text-borgona">Inicia sesión para hablar con Alma</p>
        <p className="text-sm text-carbon/60 max-w-xs">
          Alma acompaña tu recuerdo desde el registro hasta la entrega; para eso necesita saber quién eres.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-full bg-borgona text-marfil px-8 py-3 text-sm hover:bg-borgona-dark transition-colors"
        >
          Iniciar sesión →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg border border-greige/70 rounded-2xl bg-white/70 shadow-sm flex flex-col h-[640px] overflow-hidden">
      <div className="flex items-center gap-3 border-b border-greige/60 px-5 py-4 bg-marfil">
        <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0">
          <Image src="/images/alma-chat-v2.png" alt="Alma" fill sizes="36px" className="object-cover" />
        </div>
        <div>
          <p className="font-display text-borgona leading-none">Alma</p>
          <p className="text-xs text-carbon/55">Asistente de Reviive</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {mensajes.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.rol === "usuario" ? "justify-end" : ""}`}>
            {m.rol === "alma" && (
              <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0">
                <Image src="/images/alma-chat-v2.png" alt="Alma" fill sizes="24px" className="object-cover" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.rol === "alma"
                  ? "bg-marfil border border-greige/70 text-carbon"
                  : "bg-borgona text-marfil"
              }`}
            >
              <p>{m.contenido}</p>
              <p
                className={`mt-1 text-[10px] ${
                  m.rol === "alma" ? "text-carbon/40" : "text-marfil/60"
                }`}
              >
                {m.hora}
              </p>
            </div>
          </div>
        ))}
        {enviando && (
          <div className="flex items-end gap-2">
            <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0">
              <Image src="/images/alma-chat-v2.png" alt="Alma" fill sizes="24px" className="object-cover" />
            </div>
            <div className="rounded-2xl px-4 py-2.5 text-sm bg-marfil border border-greige/70 text-carbon/50">
              Alma está pensando…
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-3 flex flex-wrap gap-2 border-t border-greige/60">
        {sugerencias.map((s) => (
          <button
            key={s.texto}
            onClick={() => enviar(s.texto)}
            disabled={enviando}
            className="text-xs rounded-full border border-borgona/40 text-borgona px-3 py-1.5 hover:bg-borgona/5 transition-colors disabled:opacity-50"
          >
            {s.texto}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
        className="flex items-center gap-2 border-t border-greige/60 px-4 py-3"
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={enviando}
          className="flex-1 rounded-full border border-greige/70 bg-marfil px-4 py-2 text-sm outline-none focus:border-borgona/50 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={enviando}
          className="h-9 w-9 shrink-0 rounded-full bg-borgona text-marfil flex items-center justify-center disabled:opacity-50"
          aria-label="Enviar mensaje"
        >
          <IconEnviar className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
