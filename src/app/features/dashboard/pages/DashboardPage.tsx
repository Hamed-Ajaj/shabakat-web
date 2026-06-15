import { AlertCircle, ArrowUpRight, DollarSign, UserCheck, Users } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { RecentPaymentsPanel, UpcomingDuePanel } from "../components/PaymentsPanels";
import { RevenueChartCard } from "../components/RevenueChartCard";
import { subscribers } from "../../../shared/data/mockData";
import { SectionCard } from "../../../shared/components/SectionCard";

export default function DashboardPage() {
  const paid = subscribers.filter((subscriber) => subscriber.status === "paid").length;
  const unpaid = subscribers.filter((subscriber) => subscriber.status !== "paid").length;
  const overdue = subscribers.filter((subscriber) => subscriber.status === "overdue").length;
  const totalRevenue = subscribers.reduce((sum, subscriber) => sum + subscriber.amount, 0);
  const outstanding = subscribers
    .filter((subscriber) => subscriber.status !== "paid")
    .reduce((sum, subscriber) => sum + subscriber.amount, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Subscribers" value={subscribers.length} hint="+12 this month" icon={Users} accentClassName="text-foreground" />
        <MetricCard label="Paid This Month" value={paid} hint={`${Math.round((paid / subscribers.length) * 100)}% collection rate`} icon={UserCheck} accentClassName="text-emerald-400" />
        <MetricCard label="Unpaid Invoices" value={unpaid} hint={`${overdue} overdue accounts`} icon={AlertCircle} accentClassName="text-red-400" />

        <SectionCard className="border-primary/30 bg-primary p-5 text-primary-foreground shadow-[0_0_30px_rgba(245,192,0,0.18)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">Monthly Revenue</p>
              <p className="mt-2 font-mono text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/70">
                <ArrowUpRight className="h-3 w-3" />
                ${outstanding} outstanding
              </p>
            </div>
            <div className="rounded-xl bg-black/10 p-2.5">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </SectionCard>
      </div>

      <RevenueChartCard />

      <div className="grid gap-4 lg:grid-cols-5">
        <RecentPaymentsPanel />
        <UpcomingDuePanel />
      </div>
    </div>
  );
}
