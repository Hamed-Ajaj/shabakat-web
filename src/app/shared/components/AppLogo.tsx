import { Zap } from "lucide-react";
import { useI18n } from "../../providers/I18nProvider";

export function AppLogo() {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
        style={{ boxShadow: "0 0 20px rgba(245,192,0,0.35)" }}
      >
        <Zap className="h-5 w-5" fill="currentColor" />
      </div>
      <div>
        <p className="text-sm font-bold leading-tight text-foreground">{t("shell.appName")}</p>
        <p className="text-xs leading-tight text-muted-foreground">{t("shell.appTagline")}</p>
      </div>
    </div>
  );
}
