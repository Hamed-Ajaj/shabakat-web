import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { revenueData } from "../../../shared/data/mockData";
import { SectionCard } from "../../../shared/components/SectionCard";

export function RevenueChartCard() {
  return (
    <SectionCard className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Revenue Overview</h2>
          <p className="text-xs text-muted-foreground">Dec 2024 to May 2025</p>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Billed</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Collected</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={revenueData} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenue-billed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f5c000" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#f5c000" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revenue-collected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: "#7a7a9a", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7a7a9a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: 16,
              boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
            }}
          />
          <Area type="monotone" dataKey="billed" name="Billed" stroke="#f5c000" strokeWidth={2} fill="url(#revenue-billed)" />
          <Area type="monotone" dataKey="collected" name="Collected" stroke="#22c55e" strokeWidth={2} fill="url(#revenue-collected)" />
        </AreaChart>
      </ResponsiveContainer>
    </SectionCard>
  );
}
