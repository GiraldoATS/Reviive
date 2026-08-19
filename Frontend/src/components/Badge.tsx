import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "success" | "progress" | "pending" | "neutral";
};

const tones: Record<string, string> = {
  success: "bg-[#e3ead9] text-[#3f5c2b]",
  progress: "bg-rosa/60 text-borgona-dark",
  pending: "bg-greige/70 text-carbon",
  neutral: "bg-marfil text-carbon border border-greige",
};

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
