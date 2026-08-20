import type { ReactNode } from "react";
import Button from "./Button";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: "neutral" | "success" | "danger";
};

const toneBg: Record<string, string> = {
  neutral: "bg-greige/40 text-carbon/60",
  success: "bg-[#e3ead9] text-[#3f5c2b]",
  danger: "bg-rosa/50 text-borgona-dark",
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
  tone = "neutral",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className={`h-16 w-16 rounded-full flex items-center justify-center ${toneBg[tone]}`}>
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl text-carbon">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-carbon/60">{description}</p>
      <div className="mt-6 flex flex-col items-center gap-2">
        {actionLabel && actionHref && (
          <Button href={actionHref} variant="primary">
            {actionLabel}
          </Button>
        )}
        {secondaryLabel && secondaryHref && (
          <Button href={secondaryHref} variant="ghost" className="text-xs">
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
