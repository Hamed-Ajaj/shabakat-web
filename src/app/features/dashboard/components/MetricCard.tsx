import type { LucideIcon } from "lucide-react";
import { SectionCard } from "../../../shared/components/SectionCard";

export interface MetricCardProps {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  accentClassName: string;
}

export function MetricCard({ label, value, hint, icon: Icon, accentClassName }: Readonly<MetricCardProps>) {
  return (
    <SectionCard className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
          <p className={`mt-2 text-3xl font-bold font-mono ${accentClassName}`}>{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-2.5">
          <Icon className={`h-5 w-5 ${accentClassName}`} />
        </div>
      </div>
    </SectionCard>
  );
}
