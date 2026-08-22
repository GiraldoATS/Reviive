"use client";

import { useCallback, useRef, useState } from "react";
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
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden select-none touch-none cursor-ew-resize ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <Image src={after} alt={`${alt} — después`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" unoptimized />
      <span className="absolute right-2.5 top-2.5 rounded-full bg-borgona/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-marfil backdrop-blur">
        Después
      </span>

      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`${alt} — antes`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover grayscale-[45%] sepia-[20%]" unoptimized />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-carbon/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-marfil backdrop-blur">
          Antes
        </span>
      </div>

      <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-marfil pointer-events-none" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-dorado-suave bg-marfil text-borgona shadow-lg">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 7 3 12l5 5M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>

      <label className="sr-only" htmlFor={`slider-${alt}`}>
        Comparar antes y después
      </label>
      <input
        id={`slider-${alt}`}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-2.5 mx-auto w-3/4 cursor-pointer opacity-0 focus-visible:opacity-100"
      />
    </div>
  );
}
