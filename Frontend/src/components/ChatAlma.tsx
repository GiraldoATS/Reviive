"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Mensaje } from "@/types";
import { IconEnviar, IconCamara, IconMicrofono, IconStop, IconVideo } from "@/components/icons";
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

function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result as string);
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}

type TipoAdjunto = "imagen" | "audio" | "video";

interface Adjunto {
  tipo: TipoAdjunto;
  base64: string;
  nombre: string;
  previewUrl?: string;
}

interface RespuestaWebhookAlma {
  conversacion_id: string;
  run_id: string;
  reply: string;
  estado: string;
  reply_audio_base64?: string;
  preview_imagen_base64?: string;
}

export default function ChatAlma({ mensajeInicial }: { mensajeInicial?: string }) {
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
  const [adjunto, setAdjunto] = useState<Adjunto | null>(null);
  const [grabando, setGrabando] = useState(false);
  const [avisoLimite, setAvisoLimite] = useState<string | null>(null);
  const conversacionId = useRef<string | null>(null);
  const creandoConversacion = useRef(false);
  const inputImagenRef = useRef<HTMLInputElement>(null);
  const inputVideoRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksAudioRef = useRef<Blob[]>([]);
  const audioReproductorRef = useRef<HTMLAudioElement | null>(null);

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

  const mensajeInicialEnviado = useRef(false);
  useEffect(() => {
    if (!mensajeInicial || mensajeInicialEnviado.current || !accessToken) return;
    mensajeInicialEnviado.current = true;
    enviar(mensajeInicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajeInicial, accessToken]);

  async function elegirArchivo(tipo: "imagen" | "video", archivo: File | undefined) {
    if (!archivo) return;
    const base64 = await archivoABase64(archivo);
    setAdjunto({
      tipo,
      base64,
      nombre: archivo.name,
      previewUrl: tipo === "imagen" ? base64 : undefined,
    });
  }

  async function iniciarGrabacion() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const grabador = new MediaRecorder(stream);
      chunksAudioRef.current = [];
      grabador.ondataavailable = (e) => chunksAudioRef.current.push(e.data);
      grabador.onstop = async () => {
        const blob = new Blob(chunksAudioRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        const base64 = await archivoABase64(new File([blob], "nota-de-voz.webm", { type: "audio/webm" }));
        setAdjunto({ tipo: "audio", base64, nombre: "nota-de-voz.webm" });
      };
      grabador.start();
      mediaRecorderRef.current = grabador;
      setGrabando(true);
    } catch {
      setAvisoLimite("No pude acceder al micrófono. Revisa los permisos del navegador.");
    }
  }

  function detenerGrabacion() {
    mediaRecorderRef.current?.stop();
    setGrabando(false);
  }

  async function enviar(contenido: string) {
    if (enviando || !accessToken) return;
    if (!contenido.trim() && !adjunto) return;

    const adjuntoActual = adjunto;
    const etiquetaAdjunto =
      adjuntoActual?.tipo === "imagen"
        ? "Imagen adjunta"
        : adjuntoActual?.tipo === "audio"
        ? "Nota de voz"
        : adjuntoActual?.tipo === "video"
        ? "Video adjunto"
        : "";

    const mensajeUsuario: Mensaje = {
      id: nextId(),
      rol: "usuario",
      contenido: contenido.trim() || etiquetaAdjunto,
      hora: horaActual(),
    };
    setMensajes((prev) => [...prev, mensajeUsuario]);
    setTexto("");
    setAdjunto(null);
    setAvisoLimite(null);
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
          adjunto: adjuntoActual
            ? { tipo: adjuntoActual.tipo, base64: adjuntoActual.base64, nombre: adjuntoActual.nombre }
            : null,
        }),
      });

      if (!res.ok) throw new Error("Alma no respondió a tiempo.");
      const data: RespuestaWebhookAlma = await res.json();

      // "agrupado": este mensaje llegó en medio de una ráfaga y quedó
      // absorbido en la respuesta que Alma ya le dará al último mensaje
      // del grupo; no hay nada propio que mostrar aquí.
      if (data.estado === "agrupado") return;

      setMensajes((prev) => [
        ...prev,
        {
          id: nextId(),
          rol: "alma",
          contenido: data.reply || "No pude generar una respuesta, intenta de nuevo.",
          hora: horaActual(),
          imagenPreview: data.preview_imagen_base64 || undefined,
        },
      ]);

      if (data.reply_audio_base64 && audioReproductorRef.current) {
        audioReproductorRef.current.src = `data:audio/mpeg;base64,${data.reply_audio_base64}`;
        audioReproductorRef.current.play().catch(() => {
          // Autoplay puede estar bloqueado por el navegador; no es critico.
        });
      }
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
              {m.imagenPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.imagenPreview}
                  alt="Vista previa de cómo podría quedar el objeto restaurado"
                  className="mt-2 rounded-xl max-w-full"
                />
              )}
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

      <audio ref={audioReproductorRef} className="hidden" />

      {avisoLimite && (
        <div className="px-5 py-2 text-xs text-borgona bg-rosa/20 border-t border-greige/60">{avisoLimite}</div>
      )}

      {adjunto && (
        <div className="px-5 py-2 border-t border-greige/60 flex items-center gap-2 bg-marfil">
          {adjunto.tipo === "imagen" && adjunto.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={adjunto.previewUrl} alt="" className="h-10 w-10 rounded object-cover" />
          ) : (
            <span className="text-xs text-carbon/60">
              {adjunto.tipo === "audio" ? "Nota de voz lista" : "Video listo"}: {adjunto.nombre}
            </span>
          )}
          <button
            type="button"
            onClick={() => setAdjunto(null)}
            className="ml-auto text-xs text-carbon/50 hover:text-borgona"
          >
            Quitar
          </button>
        </div>
      )}

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
        className="flex items-center gap-1.5 border-t border-greige/60 px-3 py-3"
      >
        <input
          ref={inputImagenRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => elegirArchivo("imagen", e.target.files?.[0])}
        />
        <input
          ref={inputVideoRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => elegirArchivo("video", e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputImagenRef.current?.click()}
          disabled={enviando}
          className="h-8 w-8 shrink-0 rounded-full text-carbon/50 hover:text-borgona hover:bg-borgona/5 flex items-center justify-center disabled:opacity-50"
          aria-label="Adjuntar imagen"
          title="Adjuntar imagen"
        >
          <IconCamara className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => inputVideoRef.current?.click()}
          disabled={enviando}
          className="h-8 w-8 shrink-0 rounded-full text-carbon/50 hover:text-borgona hover:bg-borgona/5 flex items-center justify-center disabled:opacity-50"
          aria-label="Adjuntar video"
          title="Adjuntar video"
        >
          <IconVideo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={grabando ? detenerGrabacion : iniciarGrabacion}
          disabled={enviando}
          className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center disabled:opacity-50 ${
            grabando ? "text-marfil bg-borgona" : "text-carbon/50 hover:text-borgona hover:bg-borgona/5"
          }`}
          aria-label={grabando ? "Detener grabación" : "Grabar nota de voz"}
          title={grabando ? "Detener grabación" : "Grabar nota de voz"}
        >
          {grabando ? <IconStop className="h-4 w-4" /> : <IconMicrofono className="h-4 w-4" />}
        </button>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={adjunto ? "Agrega un mensaje (opcional)…" : "Escribe tu mensaje..."}
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
