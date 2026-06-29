import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../providers/I18nProvider";

export interface SettingsScaffoldProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsScaffold({ title, children }: Readonly<SettingsScaffoldProps>) {
  const { isRtl, t } = useI18n();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/settings"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.04]"
          aria-label={t("common.actions.backToSettings")}
        >
          <BackIcon className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="rounded-[28px] border border-black/6 bg-card p-4 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:border-white/8 dark:shadow-none sm:p-6">
        {children}
      </div>
    </div>
  );
}
