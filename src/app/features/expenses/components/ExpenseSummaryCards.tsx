import { ReceiptText, Rows3, Wallet } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import { SectionCard } from "../../../shared/components/SectionCard";

interface ExpenseSummaryCardsProps {
  currentPageCount: number;
  isLoading: boolean;
  pageAmount: string;
  totalAmount: string;
  totalCount: number;
}

export function ExpenseSummaryCards({
  currentPageCount,
  isLoading,
  pageAmount,
  totalAmount,
  totalCount,
}: Readonly<ExpenseSummaryCardsProps>) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SectionCard key={index} className="p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-32" />
            <Skeleton className="mt-3 h-3 w-40" />
          </SectionCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        description="Across all server-matched rows, not only current page."
        icon={<Wallet className="h-5 w-5 text-primary" />}
        title="Total Matching Spend"
        value={totalAmount}
      />
      <SummaryCard
        description="Count of rows matching current backend filters."
        icon={<ReceiptText className="h-5 w-5 text-primary" />}
        title="Matching Expenses"
        value={String(totalCount)}
      />
      <SummaryCard
        description={`Current page holds ${currentPageCount} row${currentPageCount === 1 ? "" : "s"}.`}
        icon={<Rows3 className="h-5 w-5 text-primary" />}
        title="Current Page Spend"
        value={pageAmount}
      />
    </div>
  );
}

function SummaryCard({
  description,
  icon,
  title,
  value,
}: Readonly<{ description: string; icon: React.ReactNode; title: string; value: string }>) {
  return (
    <SectionCard className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-2">{icon}</div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </SectionCard>
  );
}
