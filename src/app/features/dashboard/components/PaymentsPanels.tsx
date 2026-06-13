import { Link } from "react-router-dom";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { subscribers } from "../../../shared/data/mockData";

export function RecentPaymentsPanel() {
  const paidSubscribers = subscribers.filter((subscriber) => subscriber.status === "paid").slice(0, 5);

  return (
    <SectionCard className="p-5 lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Payments</h2>
        <Link to="/subscribers" className="text-xs font-medium text-primary transition-opacity hover:opacity-75">
          View all
        </Link>
      </div>

      <div>
        {paidSubscribers.map((subscriber) => (
          <div key={subscriber.id} className="flex items-center gap-3 border-b border-white/8 py-3 last:border-b-0">
            <Avatar name={subscriber.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{subscriber.name}</p>
              <p className="text-xs text-muted-foreground">{subscriber.area} · {subscriber.ampere}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold text-foreground">${subscriber.amount}</p>
              <p className="text-xs text-muted-foreground">{subscriber.dueDate}</p>
            </div>
            <StatusBadge status={subscriber.status} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function UpcomingDuePanel() {
  const pendingSubscribers = subscribers.filter((subscriber) => subscriber.status !== "paid").slice(0, 5);

  return (
    <SectionCard className="p-5 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Due</h2>
        <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2 py-0.5 text-xs font-medium text-red-400">
          {pendingSubscribers.length} pending
        </span>
      </div>

      <div>
        {pendingSubscribers.map((subscriber) => (
          <div key={subscriber.id} className="flex items-center gap-3 border-b border-white/8 py-3 last:border-b-0">
            <Avatar name={subscriber.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{subscriber.name}</p>
              <p className="text-xs text-muted-foreground">{subscriber.dueDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground">${subscriber.amount}</span>
              <StatusBadge status={subscriber.status} />
            </div>
          </div>
        ))}
      </div>

      <LinkButton to="/notifications">Send reminders</LinkButton>
    </SectionCard>
  );
}

function LinkButton({ to, children }: Readonly<{ to: string; children: React.ReactNode }>) {
  return (
    <Link
      to={to}
      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      style={{ boxShadow: "0 0 16px rgba(245,192,0,0.2)" }}
    >
      {children}
    </Link>
  );
}
