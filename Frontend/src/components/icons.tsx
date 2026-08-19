import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconReloj(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9v4l3 2" />
      <path d="M9.5 2.5h5M12 2.5v2" />
    </svg>
  );
}

export function IconJoya(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4h12l3 5-9 11L3 9l3-5Z" />
      <path d="M3 9h18M9 4l-1.5 5L12 20l4.5-11L15 4" />
    </svg>
  );
}

export function IconCamara(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.4" />
    </svg>
  );
}

export function IconEscritura(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19h14" />
      <path d="M6 8h12M6 12h9M6 16h12" />
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
    </svg>
  );
}

export function IconFotografia(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 16 4.5-4.5L12 15l3-3 5 4" />
    </svg>
  );
}

export function IconAntiguedad(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="7" cy="8" r="3.2" />
      <path d="m9.3 10.3 9.2 9.2M15 15l2-2M18 18l2-2" />
    </svg>
  );
}

export function IconTextil(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="7" r="3.2" />
      <path d="M12 10.2c-3 2-3 4 0 6s3 4 0 6" />
    </svg>
  );
}

export function IconMadera(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 6l9 4.5v8L12 23l-9-4.5v-8Z" />
      <path d="M3 10.5 12 15l9-4.5M12 15v8" />
    </svg>
  );
}

export function IconCuidado(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.4-9-9c-1.3-3 .8-6 3.9-6 1.9 0 3.4 1 5.1 3 1.7-2 3.2-3 5.1-3 3.1 0 5.2 3 3.9 6-2 4.6-9 9-9 9Z" />
    </svg>
  );
}

export function IconConfianza(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconTrazable(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.5 9.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

export function IconSeguro(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export function IconTiempo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" />
    </svg>
  );
}

export function IconEnviar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12 20 4l-6 16-3-7-7-1Z" />
    </svg>
  );
}

export const productIcons: Record<string, (props: IconProps) => React.ReactElement> = {
  reloj: IconReloj,
  joya: IconJoya,
  camara: IconCamara,
  escritura: IconEscritura,
  fotografia: IconFotografia,
  antiguedad: IconAntiguedad,
  textil: IconTextil,
  madera: IconMadera,
  trazable: IconTrazable,
  tiempo: IconTiempo,
};

export function ProductIcon({
  icono,
  className = "h-8 w-8",
}: {
  icono: string;
  className?: string;
}) {
  const Comp = productIcons[icono] ?? IconTiempo;
  return <Comp className={className} />;
}
