import { NavLink } from "react-router-dom";
import { useI18n } from "../../providers/I18nProvider";
import { mobileNavigationItems } from "../../shared/data/mockData";

export function BottomNavigation() {
  const { t } = useI18n();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-card md:hidden">
      <div className="flex items-center">
        {mobileNavigationItems.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-[10px] transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
