import { Calendar, MapPinned, UsersRound } from "lucide-react";
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {area?.name ?? "Area Details"}
          </SheetTitle>
          <SheetDescription>
            Review subscriber usage and creation metadata for this area.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {area ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  label="Subscribers"
                  value={String(area.customerCount)}
                />
                <MetricCard label="Created" value={area.createdAtLabel} />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow
                  icon={MapPinned}
                  label="Area Name"
                  value={area.name}
                />
                <DetailRow
                  icon={UsersRound}
                  label="Assigned Subscribers"
                  value={`${area.customerCount}`}
                />
                <DetailRow
                  icon={Calendar}
                  label="Created At"
                  value={area.createdAtLabel}
                />
              </SectionCard>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select an area to view its details.
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
