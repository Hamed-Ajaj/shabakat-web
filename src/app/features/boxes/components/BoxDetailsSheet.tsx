import { Calendar, MapPinned, NotebookPen, Package2, UsersRound } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { BoxRecord } from "../types";

interface BoxDetailsSheetProps {
  box: BoxRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoxDetailsSheet({
  box,
  open,
  onOpenChange,
}: Readonly<BoxDetailsSheetProps>) {
  const { formatDate, isRtl, t } = useI18n();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? "right" : "left"}
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {box?.name ?? t("boxes.actions.viewDetails")}
          </SheetTitle>
          <SheetDescription>{t("boxes.details.description")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {box ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  label={t("boxes.details.subscribers")}
                  value={t(box.customerCount === 1 ? "boxes.subscriberCount" : "boxes.subscriberCount_plural", { count: box.customerCount })}
                />
                <MetricCard label={t("boxes.details.created")} value={formatDate(box.createdAt)} />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow icon={Package2} label={t("boxes.details.name")} value={box.name} />
                <DetailRow icon={MapPinned} label={t("boxes.details.area")} value={box.areaName} />
                <DetailRow
                  icon={MapPinned}
                  label={t("boxes.details.locationNote")}
                  value={box.locationNote || t("common.labels.notSet")}
                />
                <DetailRow
                  icon={NotebookPen}
                  label={t("boxes.details.notes")}
                  value={box.notes || t("common.labels.notSet")}
                />
                <DetailRow
                  icon={UsersRound}
                  label={t("boxes.details.assignedSubscribers")}
                  value={t(box.customerCount === 1 ? "boxes.subscriberCount" : "boxes.subscriberCount_plural", { count: box.customerCount })}
                />
                <DetailRow icon={Calendar} label={t("boxes.details.createdAt")} value={formatDate(box.createdAt)} />
              </SectionCard>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("boxes.details.empty")}
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

