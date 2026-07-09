import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";

interface AmpereSchedulesToolbarProps {
  canManage: boolean;
  isFetching: boolean;
  search: string;
  total: number;
  onCreateClick: () => void;
  onSearchChange: (value: string) => void;
}

export function AmpereSchedulesToolbar({
  canManage,
  isFetching,
  search,
  total,
  onCreateClick,
  onSearchChange,
}: Readonly<AmpereSchedulesToolbarProps>) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="min-w-60 flex-1">
          <span className="sr-only">{t("ampereSchedules.search.placeholder")}</span>
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("ampereSchedules.search.placeholder")}
            className="h-11 w-full rounded-xl border border-white/8 bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </label>

        {canManage ? (
          <Button
            type="button"
            onClick={onCreateClick}
            className="rounded-xl px-4 py-2.5 text-sm font-medium"
            style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}
          >
            {t("ampereSchedules.actions.add")}
          </Button>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {t(total === 1 ? "ampereSchedules.count" : "ampereSchedules.count_plural", { count: total })}
        {isFetching ? ` · ${t("ampereSchedules.refreshing")}` : ""}
      </p>
    </div>
  );
}
