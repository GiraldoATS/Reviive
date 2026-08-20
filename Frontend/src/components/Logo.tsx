import Image from "next/image";

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
  const taglineColor = tone === "marfil" ? "text-marfil/75" : "text-carbon/55";

  if (variant === "icon") {
    return <HourglassMark className={className || "h-8 w-8"} />;
  }

  // El logo real (recortado de la guía de marca) sólo existe en tinta
  // borgoña/dorado, así que se usa sobre fondos claros. Sobre fondos
  // oscuros (sidebars internos) se conserva la marca dibujada en dorado.
  if (tone === "marfil") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <HourglassMark className="h-8 w-8 shrink-0" />
        <div className="leading-none">
          <span className="font-display text-2xl relative text-marfil">
            Reviive
            <span className="absolute -top-2 left-[52%] h-1.5 w-1.5 rounded-full bg-dorado" aria-hidden="true" />
            <span className="absolute -top-2 left-[64%] h-1.5 w-1.5 rounded-full bg-dorado" aria-hidden="true" />
          </span>
          {tagline && <p className={`mt-0.5 text-[10px] italic ${taglineColor}`}>{tagline}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-12 w-[184px] shrink-0">
        <Image src="/images/logo.png" alt="Reviive" fill sizes="184px" className="object-contain object-left" priority />
      </div>
      {tagline && <p className={`text-[11px] italic ${taglineColor} -ml-1`}>{tagline}</p>}
    </div>
  );
}
