import { MapPinned, UsersRound } from "lucide-react";
import { useI18n } from "../../../providers/I18nProvider";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { AreaRecord } from "../types";
import { AreaRowActions } from "./AreaRowActions";

interface AreasListProps {
  areas: AreaRecord[];
  canManage: boolean;
  error: string;
  isLoading: boolean;
  onDelete: (area: AreaRecord) => void;
  onEdit: (area: AreaRecord) => void;
  onView: (area: AreaRecord) => void;
}

export function AreasList({
  areas,
  canManage,
  error,
  isLoading,
  onDelete,
  onEdit,
  onView,
}: Readonly<AreasListProps>) {
  const { formatDate, t } = useI18n();

  if (isLoading) {
    return (
      <SectionCard className="px-4 py-10 text-sm text-muted-foreground">
        {t("areas.loading")}
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard className="px-4 py-10 text-sm text-red-300">
        {error}
      </SectionCard>
    );
  }

  if (areas.length === 0) {
    return (
      <SectionCard className="px-4 py-10 text-sm text-muted-foreground">
        {t("areas.empty")}
      </SectionCard>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {areas.map((area) => (
        <SectionCard
          key={area.id}
          className="border-white/8 bg-card/80 p-5 transition-colors hover:bg-card"
        >
          <div className="flex items-start gap-4">
            <Avatar name={area.name} size="md" />

            <button
              type="button"
              onClick={() => onView(area)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-base font-semibold text-foreground">
                {area.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("areas.createdAt", { date: formatDate(area.createdAt) })}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                  <UsersRound className="h-3.5 w-3.5 text-primary" />
                  {t(area.customerCount === 1 ? "areas.subscriberCount" : "areas.subscriberCount_plural", { count: area.customerCount })}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                  <MapPinned className="h-3.5 w-3.5 text-primary" />
                  {t("areas.label.area")}
                </span>
              </div>
            </button>

            <AreaRowActions
              canManage={canManage}
              onDelete={() => onDelete(area)}
              onEdit={() => onEdit(area)}
              onView={() => onView(area)}
            />
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
