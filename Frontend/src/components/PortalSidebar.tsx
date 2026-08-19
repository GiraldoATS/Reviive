import Link from "next/link";

type PortalSidebarProps = {
  title: string;
  items: { href: string; label: string; active?: boolean }[];
  userLabel: string;
};

export default function PortalSidebar({ title, items, userLabel }: PortalSidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-borgona text-marfil/90 flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-marfil/15">
        <span className="font-display text-xl text-marfil">Reviive</span>
        <p className="text-[11px] uppercase tracking-widest text-rosa/80 mt-1">
          {title}
        </p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
              item.active
                ? "bg-marfil/15 text-marfil font-medium"
                : "text-marfil/75 hover:bg-marfil/10 hover:text-marfil"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-marfil/15 text-xs text-marfil/70">
        {userLabel}
      </div>
    </aside>
  );
}
