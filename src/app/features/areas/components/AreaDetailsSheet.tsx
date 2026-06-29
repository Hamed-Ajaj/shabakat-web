import { Calendar, MapPinned, UsersRound } from "lucide-react";
import { useI18n } from "../../../providers/I18nProvider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { AreaRecord } from "../types";

interface AreaDetailsSheetProps {
  area: AreaRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AreaDetailsSheet({
  area,
  open,
  onOpenChange,
}: Readonly<AreaDetailsSheetProps>) {
  const { formatDate, isRtl, t } = useI18n();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? "right" : "left"}
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {area?.name ?? t("areas.actions.viewDetails")}
          </SheetTitle>
          <SheetDescription>
            {t("areas.details.description")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {area ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  label={t("areas.details.subscribers")}
                  value={t(area.customerCount === 1 ? "areas.subscriberCount" : "areas.subscriberCount_plural", { count: area.customerCount })}
                />
                <MetricCard label={t("areas.details.created")} value={formatDate(area.createdAt)} />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow
                  icon={MapPinned}
                  label={t("areas.details.name")}
                  value={area.name}
                />
                <DetailRow
                  icon={UsersRound}
                  label={t("areas.details.assignedSubscribers")}
                  value={t(area.customerCount === 1 ? "areas.subscriberCount" : "areas.subscriberCount_plural", { count: area.customerCount })}
                />
                <DetailRow
                  icon={Calendar}
                  label={t("areas.details.createdAt")}
                  value={formatDate(area.createdAt)}
                />
              </SectionCard>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("areas.details.empty")}
            </p>
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
