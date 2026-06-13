import type { Status } from "../../../shared/types/domain";

export interface SubscribersToolbarProps {
  search: string;
  status: "all" | Status;
  total: number;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | Status) => void;
}

export function SubscribersToolbar({
  search,
  status,
  total,
  filteredCount,
  onSearchChange,
  onStatusChange,
}: Readonly<SubscribersToolbarProps>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1">
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, area, or phone..."
            className="w-full rounded-xl border border-white/8 bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "paid", "unpaid", "overdue"] as const).map((value) => (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                status === value ? "bg-primary text-primary-foreground" : "border border-white/8 text-muted-foreground hover:text-foreground"
              }`}
            >
              {value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}
        >
          Add Subscriber
        </button>
      </div>

      <p className="text-xs text-muted-foreground">{filteredCount} of {total} subscribers</p>
    </div>
  );
}
