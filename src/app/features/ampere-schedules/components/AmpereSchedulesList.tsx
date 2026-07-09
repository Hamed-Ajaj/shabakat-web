import { Calendar, Clock3, UsersRound, Zap } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import { useI18n } from "../../../providers/I18nProvider";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { AmpereScheduleRecord } from "../types";
import { AmpereScheduleRowActions } from "./AmpereScheduleRowActions";

interface AmpereSchedulesListProps {
  canManage: boolean;
  error: string;
  isLoading: boolean;
  schedules: AmpereScheduleRecord[];
  onDelete: (schedule: AmpereScheduleRecord) => void;
  onEdit: (schedule: AmpereScheduleRecord) => void;
  onView: (schedule: AmpereScheduleRecord) => void;
}

export function AmpereSchedulesList({
  canManage,
  error,
  isLoading,
  schedules,
  onDelete,
  onEdit,
  onView,
}: Readonly<AmpereSchedulesListProps>) {
  const { formatDate, t } = useI18n();

  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SectionCard key={index} className="border-white/8 bg-card/80 p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-28" />

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Skeleton className="h-7 w-28 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>

              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </SectionCard>
        ))}
      </div>
    );
  }

  if (error) {
    return <SectionCard className="px-4 py-10 text-sm text-red-300">{error}</SectionCard>;
  }

  if (schedules.length === 0) {
    return (
      <SectionCard className="px-4 py-10 text-sm text-muted-foreground">
        {t("ampereSchedules.empty")}
      </SectionCard>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {schedules.map((schedule) => (
        <SectionCard
          key={schedule.id}
          className="border-white/8 bg-card/80 p-5 transition-colors hover:bg-card"
        >
          <div className="flex items-start gap-4">
            <Avatar name={schedule.name} size="md" />

            <button
              type="button"
              onClick={() => onView(schedule)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-base font-semibold text-foreground">{schedule.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("ampereSchedules.hoursPerDayValue", { count: schedule.hoursPerDay })}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                  <UsersRound className="h-3.5 w-3.5 text-primary" />
                  {t(
                    schedule.customerCount === 1
                      ? "ampereSchedules.customerCount"
                      : "ampereSchedules.customerCount_plural",
                    { count: schedule.customerCount },
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  {t("ampereSchedules.pricePerAmpValue", { value: schedule.pricePerAmp })}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5 text-primary" />
                    {t("ampereSchedules.details.hoursPerDay")}
                  </div>
                  <p className="truncate text-sm text-foreground">
                    {t("ampereSchedules.hoursPerDayValue", { count: schedule.hoursPerDay })}
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {t("ampereSchedules.details.created")}
                  </div>
                  <p className="text-sm text-foreground">{formatDate(schedule.createdAt)}</p>
                </div>
              </div>
            </button>

            <AmpereScheduleRowActions
              canManage={canManage}
              onDelete={() => onDelete(schedule)}
              onEdit={() => onEdit(schedule)}
              onView={() => onView(schedule)}
            />
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
