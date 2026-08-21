"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({
  before,
  after,
  alt = "",
  className = "",
}: {
  before: string;
  after: string;
  alt?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  function updateFromClientX(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden select-none cursor-ew-resize touch-none ${className}`}
      onMouseMove={(e) => {
        if (e.buttons === 1) updateFromClientX(e.clientX);
      }}
      onMouseDown={(e) => updateFromClientX(e.clientX)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
      onTouchStart={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      <Image src={after} alt={alt} fill sizes="260px" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={alt} fill sizes="260px" className="object-cover grayscale-[45%] sepia-[20%]" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-marfil pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-marfil shadow-sm flex items-center justify-center text-borgona">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>
      <span className="absolute bottom-1.5 left-1.5 text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-black/40 text-white pointer-events-none">
        Antes
      </span>
      <span className="absolute bottom-1.5 right-1.5 text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-black/40 text-white pointer-events-none">
        Después
      </span>
    </div>
  );
}
