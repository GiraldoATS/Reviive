import { IconBell, IconSearch } from "./icons";

type PortalTopbarProps = {
  crumbs?: string[];
  userName: string;
  userRole: string;
  notifications?: number;
};

export default function PortalTopbar({
  crumbs,
  userName,
  userRole,
  notifications = 0,
}: PortalTopbarProps) {
  return (
    <header className="border-b border-greige/60 bg-marfil/95 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4 px-8 py-4">
        <div className="flex-1 max-w-md">
          {crumbs && crumbs.length > 0 && (
            <p className="text-[11px] uppercase tracking-widest text-carbon/45 mb-1">
              {crumbs.join(" / ")}
            </p>
          )}
          <label className="flex items-center gap-2 rounded-full border border-greige/70 bg-white/60 px-4 py-2 text-sm text-carbon/50">
            <IconSearch className="h-4 w-4 shrink-0" />
            <span>Buscar en Reviive...</span>
          </label>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <IconBell className="h-5 w-5 text-carbon/60" />
            {notifications > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-dorado px-1 text-[9px] font-medium text-borgona-dark">
                {notifications}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 border-l border-greige/70 pl-4">
            <div className="h-8 w-8 rounded-full bg-borgona text-marfil flex items-center justify-center text-xs font-medium">
              {userName.charAt(0)}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-carbon">{userName}</p>
              <p className="text-[11px] text-carbon/50">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
