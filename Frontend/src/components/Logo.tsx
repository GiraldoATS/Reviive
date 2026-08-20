type LogoProps = {
  variant?: "full" | "icon";
  tone?: "borgona" | "marfil";
  tagline?: string;
  className?: string;
};

function HourglassMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {/* ramita de hojas */}
      <path
        d="M6 20c2-3 2-7 0-11M6 20c3 1 6-1 8-4M6 20c1 3-1 6-4 8"
        fill="none"
        stroke="var(--color-dorado)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* marco del reloj de arena */}
      <path
        d="M15 8h14M15 32h14"
        stroke="var(--color-dorado)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16.5 8v3.2c0 2.6 1.6 4.5 5.5 8.8-3.9 4.3-5.5 6.2-5.5 8.8V32M27.5 8v3.2c0 2.6-1.6 4.5-5.5 8.8 3.9 4.3 5.5 6.2 5.5 8.8V32"
        fill="none"
        stroke="var(--color-dorado)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* arena */}
      <path
        d="M18 9.6c0 1.9 1.2 3.3 4 6.4 2.8-3.1 4-4.5 4-6.4Z"
        fill="var(--color-dorado)"
        opacity="0.35"
      />
      <path
        d="M19.3 30.4c.4-1.6 1.3-2.9 2.7-4.6 1.4 1.7 2.3 3 2.7 4.6Z"
        fill="var(--color-dorado)"
        opacity="0.55"
      />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  tone = "borgona",
  tagline,
  className = "",
}: LogoProps) {
  const wordmarkColor = tone === "marfil" ? "text-marfil" : "text-borgona";
  const taglineColor = tone === "marfil" ? "text-marfil/75" : "text-carbon/55";

  if (variant === "icon") {
    return <HourglassMark className={className || "h-8 w-8"} />;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <HourglassMark className="h-8 w-8 shrink-0" />
      <div className="leading-none">
        <span className={`font-display text-2xl relative ${wordmarkColor}`}>
          Reviive
          <span
            className="absolute -top-2 left-[52%] h-1.5 w-1.5 rounded-full bg-dorado"
            aria-hidden="true"
          />
          <span
            className="absolute -top-2 left-[64%] h-1.5 w-1.5 rounded-full bg-dorado"
            aria-hidden="true"
          />
        </span>
        {tagline && (
          <p className={`mt-0.5 text-[10px] italic ${taglineColor}`}>{tagline}</p>
        )}
      </div>
    </div>
  );
}
