import { Calendar, Clock3, UsersRound, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { AmpereScheduleRecord } from "../types";

interface AmpereScheduleDetailsSheetProps {
  open: boolean;
  schedule: AmpereScheduleRecord | null;
  onOpenChange: (open: boolean) => void;
}

export function AmpereScheduleDetailsSheet({
  open,
  schedule,
  onOpenChange,
}: Readonly<AmpereScheduleDetailsSheetProps>) {
  const { formatDate, isRtl, t } = useI18n();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? "right" : "left"}
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {schedule?.name ?? t("ampereSchedules.actions.viewDetails")}
          </SheetTitle>
          <SheetDescription>{t("ampereSchedules.details.description")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {schedule ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  label={t("ampereSchedules.details.customers")}
                  value={t(
                    schedule.customerCount === 1
                      ? "ampereSchedules.customerCount"
                      : "ampereSchedules.customerCount_plural",
                    { count: schedule.customerCount },
                  )}
                />
                <MetricCard
                  label={t("ampereSchedules.details.pricePerAmp")}
                  value={t("ampereSchedules.pricePerAmpValue", { value: schedule.pricePerAmp })}
                />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow icon={Clock3} label={t("ampereSchedules.details.hoursPerDay")} value={t("ampereSchedules.hoursPerDayValue", { count: schedule.hoursPerDay })} />
                <DetailRow icon={Zap} label={t("ampereSchedules.details.pricePerAmp")} value={t("ampereSchedules.pricePerAmpValue", { value: schedule.pricePerAmp })} />
                <DetailRow
                  icon={UsersRound}
                  label={t("ampereSchedules.details.assignedCustomers")}
                  value={t(
                    schedule.customerCount === 1
                      ? "ampereSchedules.customerCount"
                      : "ampereSchedules.customerCount_plural",
                    { count: schedule.customerCount },
                  )}
                />
                <DetailRow icon={Calendar} label={t("ampereSchedules.details.createdAt")} value={formatDate(schedule.createdAt)} />
              </SectionCard>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t("ampereSchedules.details.empty")}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetricCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <SectionCard className="p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </SectionCard>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: Readonly<{ icon: typeof Calendar; label: string; value: string }>) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
