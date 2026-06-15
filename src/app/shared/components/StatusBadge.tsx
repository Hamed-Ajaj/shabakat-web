import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { Status } from "../types/domain";

export interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: Readonly<StatusBadgeProps>) {
  const styles = {
    paid: { className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400", icon: CheckCircle, label: "Paid" },
    unpaid: { className: "border-amber-400/20 bg-amber-400/10 text-amber-400", icon: Clock, label: "Unpaid" },
    overdue: { className: "border-red-400/20 bg-red-400/10 text-red-400", icon: AlertCircle, label: "Overdue" },
  }[status];

  const Icon = styles.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${styles.className}`}>
      <Icon className="h-3 w-3" />
      {styles.label}
    </span>
  );
}
