import { useMemo, useState } from "react";
import {
  BadgeInfo,
  Calendar,
  CircleDollarSign,
  Gauge,
  MapPin,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import { getSubscriberCustomerTypeLabel, getSubscriberPlanLabel } from "../subscriberLabels";
import { useSubscriberDetailQuery, useSubscriberMeterReadingsQuery } from "../queries";
import { CreateMeterReadingDialog } from "./CreateMeterReadingDialog";
import { DeleteMeterReadingDialog } from "./DeleteMeterReadingDialog";

interface SubscriberDetailsSheetProps {
  open: boolean;
  subscriberId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function SubscriberDetailsSheet({
  open,
  subscriberId,
  onOpenChange,
}: Readonly<SubscriberDetailsSheetProps>) {
  const { session } = useAuth();
  const { formatCurrency, formatDate, formatNumber, isRtl, t } = useI18n();
  const detailQuery = useSubscriberDetailQuery(subscriberId ?? undefined);
  const subscriber = detailQuery.data;
  const [isCreateMeterDialogOpen, setIsCreateMeterDialogOpen] = useState(false);
  const [meterReadingToDelete, setMeterReadingToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const canManageMeterReadings =
    session?.role === "Owner" || session?.role === "Admin";
  const meterReadingsQuery = useSubscriberMeterReadingsQuery(
    subscriberId ?? undefined,
    subscriber?.plan === "Kilowatt",
  );
  const currentMonthReading = useMemo(
    () =>
      (meterReadingsQuery.data ?? []).find((reading) =>
        isCurrentMonth(reading.createdAt),
      ),
    [meterReadingsQuery.data],
  );

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setIsCreateMeterDialogOpen(false);
      setMeterReadingToDelete(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isRtl ? "right" : "left"}
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {subscriber?.name ?? t("subscribers.actions.viewDetails")}
          </SheetTitle>
          <SheetDescription>
            {t("subscribers.details.description")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {detailQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("subscribers.details.loading")}
            </p>
          ) : null}
          {detailQuery.error instanceof Error ? (
            <p className="text-sm text-red-300">{detailQuery.error.message}</p>
          ) : null}

          {subscriber ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  label={t("subscribers.details.totalBilled")}
                  value={formatCurrency(subscriber.totalBilled)}
                />
                <MetricCard
                  label={t("subscribers.details.totalPaid")}
                  value={formatCurrency(subscriber.totalPaid)}
                />
                <MetricCard
                  label={t("subscribers.details.totalOutstanding")}
                  value={formatCurrency(subscriber.totalOutstanding)}
                />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow
                  icon={UserRound}
                  label={t("subscribers.customerType.label")}
                  value={t(getSubscriberCustomerTypeLabel(subscriber.customerType))}
                />
                <DetailRow
                  icon={BadgeInfo}
                  label={t("subscribers.details.plan")}
                  value={`${t(getSubscriberPlanLabel(subscriber.plan))} · ${formatNumber(subscriber.planValue)}`}
                />
                <DetailRow icon={Phone} label={t("subscribers.details.phone")} value={subscriber.phone ?? t("subscribers.notSet")} />
                <DetailRow icon={MapPin} label={t("subscribers.details.area")} value={subscriber.areaName ?? t("subscribers.unassigned")} />
                <DetailRow
                  icon={MapPin}
                  label={t("subscribers.details.address")}
                  value={subscriber.address ?? t("subscribers.notSet")}
                />
                <DetailRow
                  icon={Calendar}
                  label={t("subscribers.details.subscribed")}
                  value={formatDate(subscriber.subscriptionDate)}
                />
                <DetailRow
                  icon={Calendar}
                  label={t("subscribers.details.created")}
                  value={formatDate(subscriber.createdAt)}
                />
                <DetailRow
                  icon={CircleDollarSign}
                  label={t("subscribers.details.paidThisMonth")}
                  value={subscriber.paidThisMonth ? t("subscribers.status.yes") : t("subscribers.status.no")}
                />
              </SectionCard>

              {subscriber.hasPricingOverride && subscriber.pricingOverride ? (
                <SectionCard className="space-y-4 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {t("subscribers.details.pricingOverride")}
                  </h3>
                  <DetailRow
                    icon={CircleDollarSign}
                    label={t("subscribers.form.usePricingOverride.overridePrice")}
                    value={formatCurrency(subscriber.pricingOverride.price)}
                  />
                  <DetailRow
                    icon={CircleDollarSign}
                    label={t("subscribers.form.usePricingOverride.fixedCharge")}
                    value={formatCurrency(subscriber.pricingOverride.fixedCharge)}
                  />
                  <DetailRow
                    icon={BadgeInfo}
                    label={t("subscribers.form.usePricingOverride.tva")}
                    value={`${subscriber.pricingOverride.tva}%`}
                  />
                </SectionCard>
              ) : null}

              {subscriber.plan === "Kilowatt" ? (
                <SectionCard className="space-y-4 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {t("subscribers.details.meterReadings")}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t("subscribers.details.monthlyReadingHint")}
                      </p>
                    </div>
                    <Button
                      disabled={
                        !canManageMeterReadings || Boolean(currentMonthReading)
                      }
                      onClick={() => setIsCreateMeterDialogOpen(true)}
                    >
                      {t("subscribers.actions.addMeterReading")}
                    </Button>
                  </div>

                  {!canManageMeterReadings ? (
                    <p className="text-sm text-muted-foreground">
                      {t("subscribers.details.onlyManagersMeter")}
                    </p>
                  ) : null}

                  {currentMonthReading ? (
                    <p className="text-sm text-amber-300">
                      {t("subscribers.details.thisMonthExists")}
                    </p>
                  ) : null}

                  {meterReadingsQuery.isLoading ? (
                    <p className="text-sm text-muted-foreground">
                      {t("subscribers.details.loading")}
                    </p>
                  ) : null}

                  {meterReadingsQuery.error instanceof Error ? (
                    <p className="text-sm text-red-300">
                      {meterReadingsQuery.error.message}
                    </p>
                  ) : null}

                  {meterReadingsQuery.data?.length ? (
                    <div className="space-y-3">
                      {meterReadingsQuery.data.map((reading) => (
                        <div
                          key={reading.id}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-primary">
                              <Gauge className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {t("subscribers.details.reading", { value: formatNumber(reading.readingValue) })}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {t("subscribers.details.readingSaved", { date: formatDate(reading.createdAt) })}
                              </p>
                            </div>
                          </div>
                          <div className="text-end">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {t("subscribers.meterReading.consumption")}
                            </p>
                            <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                              {reading.consumption === null
                                ? t("subscribers.meterReading.consumptionMissing")
                                : t("subscribers.meterReading.kwh", { value: formatNumber(reading.consumption) })}
                            </p>
                            {canManageMeterReadings ? (
                              <Button
                                className="mt-3"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setMeterReadingToDelete({
                                    id: reading.id,
                                    label: t("subscribers.details.reading", { value: formatNumber(reading.readingValue) }),
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                                {t("subscribers.actions.delete")}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : meterReadingsQuery.isLoading ? null : (
                    <p className="text-sm text-muted-foreground">
                      {t("subscribers.details.emptyMeterReadings")}
                    </p>
                  )}
                </SectionCard>
              ) : subscriber.plan === "FixedKilowatt" ? (
                <SectionCard className="space-y-3 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {t("subscribers.details.fixedKilowattTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("subscribers.details.fixedKilowattBody")}
                  </p>
                </SectionCard>
              ) : (
                <SectionCard className="space-y-3 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {t("subscribers.details.meterReadings")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("subscribers.details.noMeterForAmpere")}
                  </p>
                </SectionCard>
              )}
            </>
          ) : null}
        </div>
      </SheetContent>

      {subscriberId && subscriber ? (
        <>
          <CreateMeterReadingDialog
            customerId={subscriberId}
            customerName={subscriber.name}
            open={isCreateMeterDialogOpen}
            onOpenChange={setIsCreateMeterDialogOpen}
          />
          <DeleteMeterReadingDialog
            customerId={subscriberId}
            open={Boolean(meterReadingToDelete)}
            readingId={meterReadingToDelete?.id ?? null}
            readingLabel={meterReadingToDelete?.label ?? ""}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                setMeterReadingToDelete(null);
              }
            }}
          />
        </>
      ) : null}
    </Sheet>
  );
}

function MetricCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <SectionCard className="p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </SectionCard>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: Readonly<{ icon: typeof UserRound; label: string; value: string }>) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function isCurrentMonth(value: string) {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}
