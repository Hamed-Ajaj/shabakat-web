import { Cable, MapPinned, Package2, UsersRound } from "lucide-react";
import { useI18n } from "../../../providers/I18nProvider";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { BoxRecord } from "../types";
import { BoxRowActions } from "./BoxRowActions";

interface BoxesListProps {
  boxes: BoxRecord[];
  canManage: boolean;
  error: string;
  isLoading: boolean;
  onEdit: (box: BoxRecord) => void;
  onView: (box: BoxRecord) => void;
}

export function BoxesList({
  boxes,
  canManage,
  error,
  isLoading,
  onEdit,
  onView,
}: Readonly<BoxesListProps>) {
  const { formatDate, t } = useI18n();

  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SectionCard key={index} className="p-5">
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-40 rounded bg-white/8" />
              <div className="h-4 w-28 rounded bg-white/8" />
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="h-8 rounded bg-white/8" />
                <div className="h-8 rounded bg-white/8" />
              </div>
              <div className="h-12 rounded bg-white/8" />
            </div>
          </SectionCard>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <SectionCard className="px-4 py-10 text-sm text-red-300">
        {error}
      </SectionCard>
    );
  }

  if (boxes.length === 0) {
    return (
      <SectionCard className="px-4 py-10 text-sm text-muted-foreground">
        {t("boxes.empty")}
      </SectionCard>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {boxes.map((box) => (
        <SectionCard
          key={box.id}
          className="border-white/8 bg-card/80 p-5 transition-colors hover:bg-card"
        >
          <div className="flex items-start gap-4">
            <Avatar name={box.name} size="md" />

            <button
              type="button"
              onClick={() => onView(box)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-base font-semibold text-foreground">
                {box.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {box.areaName}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                  <UsersRound className="h-3.5 w-3.5 text-primary" />
                  {t(box.customerCount === 1 ? "boxes.subscriberCount" : "boxes.subscriberCount_plural", { count: box.customerCount })}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                  <MapPinned className="h-3.5 w-3.5 text-primary" />
                  {box.locationNote || t("common.labels.notSet")}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <Package2 className="h-3.5 w-3.5 text-primary" />
                    {t("boxes.details.area")}
                  </div>
                  <p className="truncate text-sm text-foreground">{box.areaName}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <Cable className="h-3.5 w-3.5 text-primary" />
                    {t("boxes.details.created")}
                  </div>
                  <p className="text-sm text-foreground">{formatDate(box.createdAt)}</p>
                </div>
              </div>
            </button>

            <BoxRowActions
              canManage={canManage}
              onEdit={() => onEdit(box)}
              onView={() => onView(box)}
            />
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

