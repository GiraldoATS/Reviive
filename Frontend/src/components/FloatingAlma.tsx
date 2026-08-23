"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconChevronDown, IconMessage } from "./icons";

export default function FloatingAlma() {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Hablar con Alma"
        className="fixed bottom-16 right-5 z-50 h-14 w-14 rounded-full shadow-lg shadow-borgona/20 hover:scale-105 transition-transform"
      >
        <span className="relative block h-full w-full rounded-full overflow-hidden ring-2 ring-marfil/60">
          <Image src="/images/alma-chat-v2.png" alt="Alma" fill sizes="56px" className="object-cover" />
        </span>
        <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-marfil" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-16 right-5 z-50 flex items-center gap-2 rounded-full bg-borgona pl-2 pr-2 py-2 text-marfil shadow-lg shadow-borgona/20">
      <Link href="/chat" className="flex items-center gap-3 hover:opacity-90 transition-opacity" aria-label="Hablar con Alma">
        <span className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 ring-2 ring-marfil/30">
          <Image src="/images/alma-chat-v2.png" alt="Alma" fill sizes="40px" className="object-cover" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-borgona" />
        </span>
        <span className="leading-tight pr-1">
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconMessage className="h-3.5 w-3.5" />
            Alma
          </span>
          <span className="block text-[11px] text-marfil/75">Tu asistente de confianza</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => setAbierto(false)}
        aria-label="Cerrar"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
      >
        <IconChevronDown className="h-4 w-4 text-marfil/70" />
      </button>
    </div>
  );
}
