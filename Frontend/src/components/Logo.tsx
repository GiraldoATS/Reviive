type LogoProps = {
  variant?: "full" | "icon";
  className?: string;
};

export default function Logo({ variant = "full", className = "" }: LogoProps) {
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 48 48"
        className={className}
        aria-label="Reviive"
        role="img"
      >
        <path
          d="M14 10h20M14 38h20M16 10c0 8 16 8 16 16s-16 8-16 16"
          fill="none"
          stroke="var(--color-dorado)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path
          d="M14 10h20M14 38h20M16 10c0 8 16 8 16 16s-16 8-16 16"
          fill="none"
          stroke="var(--color-dorado)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-2xl leading-none text-borgona relative">
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
    </div>
  );
}
