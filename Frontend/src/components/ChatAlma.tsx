"use client";

import { useState } from "react";
import Image from "next/image";
import type { Mensaje } from "@/types";
import { respuestasAlma } from "@/data/mock";
import { IconEnviar } from "@/components/icons";

const sugerencias = [
  { texto: "Quiero iniciar un proyecto", clave: "proyecto" },
  { texto: "Consultar el estado de mi pedido", clave: "estado" },
  { texto: "Tener recomendaciones", clave: "recomendaciones" },
  { texto: "Hablar con un asesor", clave: "asesor" },
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

export default function ChatAlma() {
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

  function enviar(contenido: string, clave?: string) {
    if (!contenido.trim()) return;
    const mensajeUsuario: Mensaje = {
      id: nextId(),
      rol: "usuario",
      contenido,
      hora: horaActual(),
    };
    const respuesta: Mensaje = {
      id: nextId(),
      rol: "alma",
      contenido:
        (clave && respuestasAlma[clave]) || respuestasAlma.default,
      hora: horaActual(),
    };
    setMensajes((prev) => [...prev, mensajeUsuario, respuesta]);
    setTexto("");
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
      </div>

      <div className="px-5 py-3 flex flex-wrap gap-2 border-t border-greige/60">
        {sugerencias.map((s) => (
          <button
            key={s.clave}
            onClick={() => enviar(s.texto, s.clave)}
            className="text-xs rounded-full border border-borgona/40 text-borgona px-3 py-1.5 hover:bg-borgona/5 transition-colors"
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
          className="flex-1 rounded-full border border-greige/70 bg-marfil px-4 py-2 text-sm outline-none focus:border-borgona/50"
        />
        <button
          type="submit"
          className="h-9 w-9 shrink-0 rounded-full bg-borgona text-marfil flex items-center justify-center"
          aria-label="Enviar mensaje"
        >
          <IconEnviar className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
