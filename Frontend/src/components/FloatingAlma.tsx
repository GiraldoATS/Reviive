import Link from "next/link";
import { IconTiempo } from "./icons";

export default function FloatingAlma() {
  return (
    <Link
      href="/chat"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-borgona pl-3 pr-4 py-2.5 text-marfil shadow-lg shadow-borgona/20 hover:bg-borgona-dark transition-colors"
      aria-label="Hablar con Alma"
    >
      <span className="h-7 w-7 rounded-full bg-marfil/15 flex items-center justify-center">
        <IconTiempo className="h-4 w-4" />
      </span>
      <span className="text-sm">Hablar con Alma</span>
    </Link>
  );
}
