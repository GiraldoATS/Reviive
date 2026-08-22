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

export function IconBell(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 16v-4.5a6 6 0 0 1 12 0V16l1.5 2.5h-15Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6" />
    </svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5.4" />
    </svg>
  );
}

export function IconAlertTriangle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 22 20H2Z" />
      <path d="M12 10v4M12 17.2v.1" />
    </svg>
  );
}

export function IconWifiOff(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 3l18 18" />
      <path d="M5 9.5a13 13 0 0 1 4-2.3M9.5 6.2A13 13 0 0 1 21 9.5M7.8 12.8a8 8 0 0 1 3-1.7M12.5 11a8 8 0 0 1 4.7 1.8" />
      <path d="M10.3 16.1a4 4 0 0 1 3.6.1" />
      <circle cx="12" cy="19.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBox(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
      <path d="M3 8.5V17l9 4.5 9-4.5V8.5M12 13v8.5" />
    </svg>
  );
}

export function IconClockAlert(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 1.5M9 2.5h6" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9.5" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <path d="M12 15v2.5" />
    </svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5h16v11H9.5L5 20v-3.5H4Z" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 19c1.1-3.3 3.3-5 6.5-5s5.4 1.7 6.5 5" />
      <circle cx="17" cy="8.5" r="2.3" />
      <path d="M16 11.2c2.4.2 4 1.7 4.8 4" />
    </svg>
  );
}

export function IconWallet(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6.5" width="18" height="12" rx="1.8" />
      <path d="M3 10.5h18" />
      <circle cx="16.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h10v9H3z" />
      <path d="M13 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5Z" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3.5 2.6 5.4 5.9.7-4.3 4.1 1 5.9L12 16.7l-5.2 2.9 1-5.9-4.3-4.1 5.9-.7Z" />
    </svg>
  );
}

export function IconFlag(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3v18" />
      <path d="M6 4h11l-2.5 3.5L17 11H6" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function IconPencil(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m15 4.5 4.5 4.5-10 10L4 20l1-5.5Z" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5h16L14 13v6l-4 2v-8L4 5.5Z" />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15.5V4M8 8l4-4 4 4" />
      <path d="M4.5 15.5V19a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-3.5" />
    </svg>
  );
}

export function IconMicrofono(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21M9 21h6" />
    </svg>
  );
}

export function IconVideo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="12" height="12" rx="1.5" />
      <path d="M15 10.5 21 7.5v9L15 13.5" />
    </svg>
  );
}

export function IconStop(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7.5-4.6-9.7-9.3C.8 7.4 2.6 4 6 4c2 0 3.5 1.1 4.3 2.5C11.2 5.1 12.7 4 14.7 4c3.4 0 5.2 3.4 3.7 6.7C16.2 15.4 12 20 12 20Z" />
    </svg>
  );
}

export function IconFrame(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <circle cx="9.5" cy="10" r="1.5" />
      <path d="m5 18 5-5.5L13 15l3-4 3 4.5" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconDots(props: IconProps) {
  return (
    <svg {...base} {...props} strokeWidth={2.4}>
      <path d="M12 5.2v.1M12 12v.1M12 18.8v.1" />
    </svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9 6.3 6.3" />
    </svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

export function IconPeluche(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="7.5" cy="6" r="2" />
      <circle cx="16.5" cy="6" r="2" />
      <circle cx="12" cy="13" r="7" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <path d="M10 16c.6.6 1.4.9 2 .9s1.4-.3 2-.9" />
    </svg>
  );
}

export function IconAlmohada(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" />
      <path d="M9 9c1 1 1 2 0 3M15 9c-1 1-1 2 0 3" />
    </svg>
  );
}

export function IconLibro(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6c-1.8-1.3-4-2-6.5-2v13c2.5 0 4.7.7 6.5 2 1.8-1.3 4-2 6.5-2V4c-2.5 0-4.7.7-6.5 2Z" />
      <path d="M12 6v13" />
    </svg>
  );
}

export function IconCompartido(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 18s-5.3-3.3-6.7-6.7C1.7 8.7 3.5 6 6 6c1.3 0 2.4.7 3.5 2" />
      <path d="M14.5 18s5.3-3.3 6.7-6.7C22.3 8.7 20.5 6 18 6c-1.3 0-2.4.7-3.5 2" />
      <path d="M9.5 18 12 20l2.5-2" />
    </svg>
  );
}

export function IconMemorial(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M9 21h6M12 17v4" />
      <path d="M8 13c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
    </svg>
  );
}

export function IconAnillo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="15" r="5.5" />
      <path d="M9 9.5 12 4l3 5.5" />
    </svg>
  );
}

export function IconVasija(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4h6M10 4v3.5c0 1-3 3-3 7.5a5 5 0 0 0 10 0c0-4.5-3-6.5-3-7.5V4" />
    </svg>
  );
}

export function IconBolso(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 9h14l-1 11H6Z" />
      <path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    </svg>
  );
}

export function IconSilla(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4v9M18 4v9M6 13h12v3H6ZM7 16l-1 5M17 16l1 5" />
    </svg>
  );
}

export function IconManosCorazon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 17.5c-.5-3.6 1.5-6.6 4.8-7.1" />
      <path d="M19 17.5c.5-3.6-1.5-6.6-4.8-7.1" />
      <path d="M12 10.3c-.9-1.7-3-2.3-4.1-1-1.1 1.2-1 3 .2 4.1C9.2 14.5 12 16.5 12 16.5s2.8-2 3.9-3.1c1.2-1.1 1.3-2.9.2-4.1-1.1-1.3-3.2-.7-4.1 1Z" />
    </svg>
  );
}

export function IconMedalla(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="5" />
      <path d="m9.5 13.5-1.8 6.5 4.3-2.2 4.3 2.2-1.8-6.5" />
      <path d="m10 9 1.4 1.4L14.5 7" />
    </svg>
  );
}

export function IconBrote(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21v-9" />
      <path d="M12 12c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" />
      <path d="M12 15c0-2.8-2-5-5-5 0 2.8 2 5 5 5Z" />
      <path d="M6.5 21h11" />
    </svg>
  );
}

export function IconRelojArena(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h10" />
      <path d="M7 21h10" />
      <path d="M7.5 3.5c0 3 .5 4.7 3 6.5.7.5.7 1.5 0 2-2.5 1.8-3 3.5-3 6.5" />
      <path d="M16.5 3.5c0 3-.5 4.7-3 6.5-.7.5-.7 1.5 0 2 2.5 1.8 3 3.5 3 6.5" />
    </svg>
  );
}

export function IconManos(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13c0-3 2-5 4-5s3 2 3 4v3M17 13c0-3-2-5-4-5" />
      <path d="M11 15v2a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-4c0-2-1-4-3-4" />
      <path d="M4 13v2a2 2 0 0 0 2 2h1" />
    </svg>
  );
}

export function IconUserCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="2.8" />
      <path d="M6.5 18c1.1-2.6 3-3.8 5.5-3.8s4.4 1.2 5.5 3.8" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.3" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M14.5 21v-7.6h2.6l.4-3h-3V8.4c0-.9.2-1.5 1.6-1.5h1.6V4.2c-.6-.1-1.6-.2-2.7-.2-2.7 0-4.5 1.6-4.5 4.6v2.6H8v3h2.5V21h4Z" />
    </svg>
  );
}

export function IconTikTok(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M14.2 3h2.6c.2 1.5 1.1 2.8 2.5 3.5.6.3 1.3.5 2 .5v2.7c-1.5 0-2.9-.4-4.1-1.2v6.8c0 3.1-2.5 5.6-5.6 5.6S5.9 17.4 5.9 14.3c0-3 2.3-5.4 5.2-5.6v2.7a2.9 2.9 0 1 0 2.9 2.9V3Z" />
    </svg>
  );
}

export function IconCorreo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

export function IconEscudoCorazon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.8 7.4 7 9 4.2-1.6 7-4.8 7-9V6l-7-2.5Z" />
      <path d="M12 9.3c-.8-1.4-2.6-1.9-3.5-.8-.9 1-.8 2.5.2 3.4C9.6 12.8 12 14.5 12 14.5s2.4-1.7 3.3-2.6c1-1 1.1-2.4.2-3.4-.9-1.1-2.7-.6-3.5.8Z" />
    </svg>
  );
}

export function IconPincel(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4c1.2-1.2 3-1.2 4 0s1.2 3 0 4L9 17l-4 1 1-4Z" />
      <path d="M13 6l4 4" />
    </svg>
  );
}

export function IconCalendario(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.8" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.1" />
    </svg>
  );
}

export function IconCamisa(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4 5 6.5l2 3.2 2.2-1.4" />
      <path d="M15 4l4 2.5-2 3.2-2.2-1.4" />
      <path d="M9 4c1 1.2 2 1.8 3 1.8s2-.6 3-1.8" />
      <path d="M8.6 7.8V20h6.8V7.8" />
    </svg>
  );
}

export function IconTag(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11.5 3.5h5.8a1.2 1.2 0 0 1 1.2 1.2v5.8a1.2 1.2 0 0 1-.35.85l-8.3 8.3a1.2 1.2 0 0 1-1.7 0l-5.75-5.75a1.2 1.2 0 0 1 0-1.7l8.3-8.3c.22-.22.53-.35.8-.35Z" />
      <circle cx="15" cy="9" r="1.4" />
    </svg>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 8.5 4.8L12 12.6 3.5 7.8Z" />
      <path d="m3.5 12 8.5 4.8 8.5-4.8" />
      <path d="m3.5 16.2 8.5 4.8 8.5-4.8" />
    </svg>
  );
}

export function IconColumna(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8.5 12 4l8.5 4.5" />
      <path d="M4.5 8.5v10.5M8 8.5v10.5M12 8.5v10.5M16 8.5v10.5M19.5 8.5v10.5" />
      <path d="M3 19.5h18" />
    </svg>
  );
}

export function IconRegalo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="9.5" width="16" height="10.5" rx="1" />
      <path d="M4 13.5h16M12 9.5v10.5" />
      <path d="M12 9.5C9.5 9.5 8 8.3 8 6.8 8 5.5 9 4.5 10.2 4.5c1.6 0 1.8 2.5 1.8 5Z" />
      <path d="M12 9.5c2.5 0 4-1.2 4-2.7 0-1.3-1-2.3-2.2-2.3-1.6 0-1.8 2.5-1.8 5Z" />
    </svg>
  );
}

export function IconClipboard(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5.5" y="4.5" width="13" height="16" rx="1.5" />
      <rect x="9" y="3" width="6" height="3" rx="1" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4.5" />
    </svg>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 8.5h2.3l1.1-2h8.2l1.1 2h2.3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.3" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5 9 17l10.5-11" />
    </svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.7-5.4L19.5 8.8" />
      <path d="M19.5 4.8v4h-4" />
      <path d="M19.5 12a7.5 7.5 0 0 1-12.7 5.4L4.5 15.2" />
      <path d="M4.5 19.2v-4h4" />
    </svg>
  );
}

export function IconLightbulb(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18h6M9.5 21h5" />
      <path d="M12 3a6.5 6.5 0 0 0-3.8 11.8c.6.45 1 1.15 1 1.95v.25h5.6v-.25c0-.8.4-1.5 1-1.95A6.5 6.5 0 0 0 12 3Z" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
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
  peluche: IconPeluche,
  almohada: IconAlmohada,
  cuadro: IconFotografia,
  caja: IconMadera,
  libro: IconLibro,
  restauracion: IconSparkle,
  compartido: IconCompartido,
  memorial: IconMemorial,
};

export const productPhotos: Record<string, string> = {
  peluche: "/images/products/peluche.png",
  almohada: "/images/products/almohada.png",
  cuadro: "/images/products/cuadro.png",
  caja: "/images/products/caja.png",
  libro: "/images/products/libro.png",
  restauracion: "/images/products/restauracion.png",
  compartido: "/images/products/compartido.png",
  memorial: "/images/products/memorial.png",
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
