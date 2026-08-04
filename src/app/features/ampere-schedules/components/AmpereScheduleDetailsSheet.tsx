import { Calendar, Clock3, Phone, UsersRound } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useI18n } from "../../../providers/I18nProvider";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { getSubscriberPlanLabel } from "../../subscribers/subscriberLabels";
import { useAmpereScheduleSubscribersQuery } from "../../subscribers/queries";
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
  const { formatCurrency, formatDate, isRtl, t } = useI18n();
  const subscribersQuery = useAmpereScheduleSubscribersQuery(
    schedule?.id,
    schedule?.customerCount ?? 0,
    open && Boolean(schedule),
  );
  const subscribers = subscribersQuery.data?.data ?? [];

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
                  label={t("ampereSchedules.details.hoursPerDay")}
                  value={t("ampereSchedules.hoursPerDayValue", { count: schedule.hoursPerDay })}
                />
              </div>

              <SectionCard className="space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("ampereSchedules.details.pricingTitle")}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PricingTile label={t("ampereSchedules.form.pricingTierBase")} value={schedule.pricePerAmp} />
                  <PricingTile label={t("ampereSchedules.form.pricingTierResidential")} value={schedule.residentialPricePerAmp} />
                  <PricingTile label={t("ampereSchedules.form.pricingTierCommercial")} value={schedule.commercialPricePerAmp} />
                  <PricingTile label={t("ampereSchedules.form.pricingTierIndustrial")} value={schedule.industrialPricePerAmp} />
                </div>
              </SectionCard>

              <SectionCard className="space-y-4 p-5">
                <DetailRow icon={Clock3} label={t("ampereSchedules.details.hoursPerDay")} value={t("ampereSchedules.hoursPerDayValue", { count: schedule.hoursPerDay })} />
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

              <SectionCard className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {t("ampereSchedules.details.assignedCustomers")}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("ampereSchedules.details.assignedCustomersDescription")}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                    {t(subscribers.length === 1 ? "ampereSchedules.customerCount" : "ampereSchedules.customerCount_plural", {
                      count: subscribers.length,
                    })}
                  </Badge>
                </div>

                {subscribersQuery.isLoading ? <SubscribersSkeleton /> : null}
                {subscribersQuery.error instanceof Error ? <p className="text-sm text-red-300">{subscribersQuery.error.message}</p> : null}
                {!subscribersQuery.isLoading && !subscribers.length ? <p className="text-sm text-muted-foreground">{t("ampereSchedules.details.noCustomers")}</p> : null}

                {subscribers.length ? (
                  <div className="space-y-3">
                    {subscribers.map((subscriber) => (
                      <div key={subscriber.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <Avatar name={subscriber.name} />
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-semibold text-foreground">{subscriber.name}</p>
                                <p className="text-xs text-muted-foreground">{t(getSubscriberPlanLabel(subscriber.plan))} · {subscriber.planValue}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge status={subscriber.status} />
                                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">{formatDate(subscriber.subscriptionDate)}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("subscribers.table.amountDue")}</p>
                            <p className="mt-2 text-base font-semibold text-foreground">{formatCurrency(subscriber.amountDue)}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="font-mono">{subscriber.phone ?? t("subscribers.notSet")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
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

function PricingTile({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value.toFixed(2)}</p>
    </div>
  );
}

function SubscribersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
            <div className="space-y-2"><div className="h-3 w-16 animate-pulse rounded-full bg-white/10" /><div className="h-5 w-20 animate-pulse rounded-full bg-white/10" /></div>
          </div>
          <div className="mt-4 h-4 w-28 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}
