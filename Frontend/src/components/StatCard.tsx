import type { ReactNode } from "react";

type Tone = "borgona" | "dorado" | "rosa" | "verde" | "greige";

const toneStyles: Record<Tone, string> = {
  borgona: "bg-borgona/10 text-borgona",
  dorado: "bg-dorado/15 text-dorado-suave",
  rosa: "bg-rosa/40 text-borgona-dark",
  verde: "bg-[#e3ead9] text-[#3f5c2b]",
  greige: "bg-greige/50 text-carbon/70",
};

type StatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
  trend?: string;
  trendTone?: "up" | "down" | "neutral";
  tone?: Tone;
};

export default function StatCard({
  icon,
  value,
  label,
  trend,
  trendTone = "neutral",
  tone = "borgona",
}: StatCardProps) {
  const trendColor =
    trendTone === "up"
      ? "text-[#3f5c2b]"
      : trendTone === "down"
      ? "text-[#a64b4b]"
      : "text-carbon/45";

  return (
    <div className="rounded-2xl border border-greige/70 bg-white/60 p-5 flex gap-4 items-start">
      <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center ${toneStyles[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl text-carbon leading-none">{value}</p>
        <p className="mt-1.5 text-xs text-carbon/55">{label}</p>
        {trend && <p className={`mt-1 text-[11px] ${trendColor}`}>{trend}</p>}
      </div>
    </div>
  );
}
