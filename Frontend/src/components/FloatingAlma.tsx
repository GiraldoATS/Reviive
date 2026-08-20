import Link from "next/link";
import Image from "next/image";
import { IconChevronDown } from "./icons";

export default function FloatingAlma() {
  return (
    <Link
      href="/chat"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-borgona pl-2 pr-4 py-2 text-marfil shadow-lg shadow-borgona/20 hover:bg-borgona-dark transition-colors"
      aria-label="Hablar con Alma"
    >
      <span className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 ring-2 ring-marfil/30">
        <Image src="/images/alma.png" alt="Alma" fill sizes="40px" className="object-cover" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-borgona" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-medium">Alma</span>
        <span className="block text-[11px] text-marfil/75">Tu asistente de confianza</span>
      </span>
      <IconChevronDown className="h-4 w-4 rotate-180 text-marfil/70" />
    </Link>
  );
}
