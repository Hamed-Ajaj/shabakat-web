import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardSummary } from "../types";
import { SectionCard } from "../../../shared/components/SectionCard";

interface RevenueChartCardProps {
  summary: DashboardSummary;
}

const chartColors = ["#f5c000", "#22c55e", "#fb7185", "#60a5fa", "#c084fc"];

export function RevenueChartCard({ summary }: Readonly<RevenueChartCardProps>) {
  const chartData = [
    { label: "Billed", value: summary.totalBilledAllTime },
    { label: "Collected", value: summary.totalCollectedAllTime },
    { label: "Outstanding", value: summary.totalOutstandingAllTime },
    { label: "Expenses", value: summary.totalExpensesAllTime },
    { label: "Net", value: summary.netIncomeAllTime },
  ];

  const expenseData = [
    { label: "Fuel", value: summary.expensesByType.fuel },
    { label: "Maintenance", value: summary.expensesByType.maintenance },
    { label: "Employees", value: summary.expensesByType.employees },
    { label: "Other", value: summary.expensesByType.other },
  ];

  return (
    <SectionCard className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Finance Snapshot</h2>
          <p className="text-xs text-muted-foreground">All-time billing, collection, expense, and net totals for the current company.</p>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Revenue vs cash flow</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: "#7a7a9a", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7a7a9a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: 16,
              boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
              color: "var(--foreground)",
            }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            itemStyle={{ color: "var(--foreground)" }}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={entry.label} fill={chartColors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {expenseData.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground">{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}
