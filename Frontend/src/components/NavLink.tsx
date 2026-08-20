"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }: { href: string; children: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`group relative pb-1 transition-colors hover:text-borgona hover:font-medium ${
        active ? "text-borgona font-medium" : "text-carbon/80"
      }`}
    >
      {children}
      <span
        className={`absolute left-0 -bottom-0.5 h-px bg-borgona transition-all ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}
