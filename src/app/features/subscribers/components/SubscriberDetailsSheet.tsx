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
import { SectionCard } from "../../../shared/components/SectionCard";
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
        side="right"
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {subscriber?.name ?? "Subscriber Details"}
          </SheetTitle>
          <SheetDescription>
            Review account status, billing totals, subscriber metadata, and
            meter usage.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {detailQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading subscriber details...
            </p>
          ) : null}
          {detailQuery.error instanceof Error ? (
            <p className="text-sm text-red-300">{detailQuery.error.message}</p>
          ) : null}

          {subscriber ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  label="Total Billed"
                  value={`$${subscriber.totalBilled.toLocaleString()}`}
                />
                <MetricCard
                  label="Total Paid"
                  value={`$${subscriber.totalPaid.toLocaleString()}`}
                />
                <MetricCard
                  label="Outstanding"
                  value={`$${subscriber.totalOutstanding.toLocaleString()}`}
                />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow
                  icon={UserRound}
                  label="Customer Type"
                  value={subscriber.customerType}
                />
                <DetailRow
                  icon={BadgeInfo}
                  label="Plan"
                  value={`${subscriber.plan} · ${subscriber.planValue}`}
                />
                <DetailRow icon={Phone} label="Phone" value={subscriber.phone} />
                <DetailRow icon={MapPin} label="Area" value={subscriber.areaName} />
                <DetailRow
                  icon={MapPin}
                  label="Address"
                  value={subscriber.address}
                />
                <DetailRow
                  icon={Calendar}
                  label="Subscribed"
                  value={subscriber.subscriptionDate}
                />
                <DetailRow
                  icon={Calendar}
                  label="Created"
                  value={subscriber.createdAt}
                />
                <DetailRow
                  icon={CircleDollarSign}
                  label="Paid This Month"
                  value={subscriber.paidThisMonth ? "Yes" : "No"}
                />
              </SectionCard>

              {subscriber.hasPricingOverride && subscriber.pricingOverride ? (
                <SectionCard className="space-y-4 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Pricing Override
                  </h3>
                  <DetailRow
                    icon={CircleDollarSign}
                    label="Price"
                    value={`$${subscriber.pricingOverride.price.toLocaleString()}`}
                  />
                  <DetailRow
                    icon={CircleDollarSign}
                    label="Fixed Charge"
                    value={`$${subscriber.pricingOverride.fixedCharge.toLocaleString()}`}
                  />
                  <DetailRow
                    icon={BadgeInfo}
                    label="TVA"
                    value={`${subscriber.pricingOverride.tva}%`}
                  />
                </SectionCard>
              ) : null}

              {subscriber.plan === "Kilowatt" ? (
                <SectionCard className="space-y-4 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Meter Readings
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        One reading per calendar month. Backend still enforces
                        the final duplicate check.
                      </p>
                    </div>
                    <Button
                      disabled={
                        !canManageMeterReadings || Boolean(currentMonthReading)
                      }
                      onClick={() => setIsCreateMeterDialogOpen(true)}
                    >
                      Add Meter Reading
                    </Button>
                  </div>

                  {!canManageMeterReadings ? (
                    <p className="text-sm text-muted-foreground">
                      Only Owner and Admin can record meter readings.
                    </p>
                  ) : null}

                  {currentMonthReading ? (
                    <p className="text-sm text-amber-300">
                      This subscriber already has a reading saved this month.
                    </p>
                  ) : null}

                  {meterReadingsQuery.isLoading ? (
                    <p className="text-sm text-muted-foreground">
                      Loading meter readings...
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
                                Reading {formatNumber(reading.readingValue)}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Saved {reading.createdAtLabel}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              Consumption
                            </p>
                            <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                              {reading.consumption === null
                                ? "Not set"
                                : `${formatNumber(reading.consumption)} kWh`}
                            </p>
                            {canManageMeterReadings ? (
                              <Button
                                className="mt-3"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setMeterReadingToDelete({
                                    id: reading.id,
                                    label: `reading ${formatNumber(reading.readingValue)}`,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : meterReadingsQuery.isLoading ? null : (
                    <p className="text-sm text-muted-foreground">
                      No meter readings recorded yet.
                    </p>
                  )}
                </SectionCard>
              ) : subscriber.plan === "FixedKilowatt" ? (
                <SectionCard className="space-y-3 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Prepaid Counter
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    FixedKilowatt subscribers do not use the monthly
                    meter-reading endpoint. Top-ups should be created from the
                    invoice flow with payment amount and payment method.
                  </p>
                </SectionCard>
              ) : (
                <SectionCard className="space-y-3 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Meter Readings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ampere subscribers do not use meter readings.
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

function formatNumber(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}
