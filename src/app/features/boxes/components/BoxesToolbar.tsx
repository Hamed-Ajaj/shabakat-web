import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useI18n } from "../../../providers/I18nProvider";
import type { AreaRecord } from "../../areas/types";

interface BoxesToolbarProps {
  areas: AreaRecord[];
  areaId: string;
  canManage: boolean;
  isFetching: boolean;
  search: string;
  total: number;
  onAreaChange: (value: string) => void;
  onCreateClick: () => void;
  onSearchChange: (value: string) => void;
}

export function BoxesToolbar({
  areas,
  areaId,
  canManage,
  isFetching,
  search,
  total,
  onAreaChange,
  onCreateClick,
  onSearchChange,
}: Readonly<BoxesToolbarProps>) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <label className="min-w-60 flex-1">
            <span className="sr-only">{t("boxes.search.placeholder")}</span>
            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t("boxes.search.placeholder")}
              className="h-11 w-full rounded-xl border border-white/8 bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <label className="w-full sm:w-60">
            <span className="sr-only">{t("boxes.filters.area")}</span>
            <Select value={areaId || "all"} onValueChange={(value) => onAreaChange(value === "all" ? "" : value)}>
              <SelectTrigger className="h-11 w-full rounded-xl border-white/8 bg-card">
                <SelectValue placeholder={t("boxes.filters.allAreas")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("boxes.filters.allAreas")}</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>

        {canManage ? (
          <Button
            type="button"
            onClick={onCreateClick}
            className="rounded-xl px-4 py-2.5 text-sm font-medium"
            style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}
          >
            {t("boxes.actions.add")}
          </Button>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {t(total === 1 ? "boxes.count" : "boxes.count_plural", { count: total })}
        {isFetching ? ` · ${t("boxes.refreshing")}` : ""}
      </p>
    </div>
  );
}

