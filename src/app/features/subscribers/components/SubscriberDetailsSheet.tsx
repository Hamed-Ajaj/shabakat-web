import { BadgeInfo, Calendar, CircleDollarSign, MapPin, Phone, UserRound } from "lucide-react";
import { SectionCard } from "../../../shared/components/SectionCard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useSubscriberDetailQuery } from "../queries";

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
  const detailQuery = useSubscriberDetailQuery(subscriberId ?? undefined);
  const subscriber = detailQuery.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {subscriber?.name ?? "Subscriber Details"}
          </SheetTitle>
          <SheetDescription>
            Review account status, billing totals, and subscriber metadata.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {detailQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading subscriber details...</p> : null}
          {detailQuery.error instanceof Error ? (
            <p className="text-sm text-red-300">{detailQuery.error.message}</p>
          ) : null}

          {subscriber ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard label="Total Billed" value={`$${subscriber.totalBilled.toLocaleString()}`} />
                <MetricCard label="Total Paid" value={`$${subscriber.totalPaid.toLocaleString()}`} />
                <MetricCard label="Outstanding" value={`$${subscriber.totalOutstanding.toLocaleString()}`} />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow icon={UserRound} label="Customer Type" value={subscriber.customerType} />
                <DetailRow icon={BadgeInfo} label="Plan" value={`${subscriber.plan} · ${subscriber.planValue}`} />
                <DetailRow icon={Phone} label="Phone" value={subscriber.phone} />
                <DetailRow icon={MapPin} label="Area" value={subscriber.areaName} />
                <DetailRow icon={MapPin} label="Address" value={subscriber.address} />
                <DetailRow icon={Calendar} label="Subscribed" value={subscriber.subscriptionDate} />
                <DetailRow icon={Calendar} label="Created" value={subscriber.createdAt} />
                <DetailRow icon={CircleDollarSign} label="Paid This Month" value={subscriber.paidThisMonth ? "Yes" : "No"} />
              </SectionCard>

              {subscriber.hasPricingOverride && subscriber.pricingOverride ? (
                <SectionCard className="space-y-4 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Pricing Override
                  </h3>
                  <DetailRow icon={CircleDollarSign} label="Price" value={`$${subscriber.pricingOverride.price.toLocaleString()}`} />
                  <DetailRow icon={CircleDollarSign} label="Fixed Charge" value={`$${subscriber.pricingOverride.fixedCharge.toLocaleString()}`} />
                  <DetailRow icon={BadgeInfo} label="TVA" value={`${subscriber.pricingOverride.tva}%`} />
                </SectionCard>
              ) : null}
            </>
          ) : null}
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
}: Readonly<{ icon: typeof UserRound; label: string; value: string }>) {
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
