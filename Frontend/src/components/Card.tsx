import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-greige/70 bg-white/60 p-6 shadow-[0_1px_2px_rgba(43,43,43,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}
