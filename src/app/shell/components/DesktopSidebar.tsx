import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { navigationItems } from "../../shared/data/mockData";
import { AppLogo } from "../../shared/components/AppLogo";
import { Avatar } from "../../shared/components/Avatar";

export function DesktopSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-dvh w-64 flex-col border-r border-white/8 bg-sidebar px-4 py-5">
      <AppLogo />

      <div className="mt-8 flex-1 space-y-6">
        <div>
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Main Menu
          </p>
          <nav className="space-y-1.5">
            {navigationItems.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                    {badge ? (
                      <span
                        className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                          isActive ? "bg-black/15 text-primary-foreground" : "bg-red-500 text-white"
                        }`}
                      >
                        {badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/8 pt-4">
        <div className="flex items-center gap-3">
          <Avatar name="Karim El-Nour" size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">Karim El-Nour</p>
            <p className="text-xs text-muted-foreground">Owner · Hamra</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
