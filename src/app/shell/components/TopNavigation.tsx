import { Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { useAuth } from "../../providers/AuthProvider";
import { useI18n } from "../../providers/I18nProvider";
import { routeTitles } from "../../shared/data/mockData";
import { Avatar } from "../../shared/components/Avatar";

export function TopNavigation() {
  const { session } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const current = routeTitles[location.pathname] ?? routeTitles["/dashboard"];

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/8 bg-background/85 px-4 backdrop-blur-xl md:px-6"
      style={{ borderColor: "var(--border)" }}
    >
      <SidebarTrigger className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground md:hidden" />

      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold text-foreground">
          {t(current.titleKey)}
        </h1>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {t(current.subtitleKey, { companyName: session?.companyName ?? t("shell.appName") })}
        </p>
      </div>

      <div className="ms-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("common.labels.quickSearch")}
            className="w-60 rounded-xl border border-white/8 bg-secondary py-2 pe-4 ps-9 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>
        <Avatar name={session?.fullName ?? t("common.workspaceUser")} />
      </div>
    </header>
  );
}
