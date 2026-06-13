import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigationItems } from "../../shared/data/mockData";
import { AppLogo } from "../../shared/components/AppLogo";

export interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: Readonly<MobileSidebarProps>) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close sidebar"
      />
      <aside className="relative z-10 flex h-full w-72 flex-col bg-sidebar px-4 py-5">
        <div className="flex items-center justify-between">
          <AppLogo />
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 space-y-1.5">
          {navigationItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {badge ? <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">{badge}</span> : null}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
