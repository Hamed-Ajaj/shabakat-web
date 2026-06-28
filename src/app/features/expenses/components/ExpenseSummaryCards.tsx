import { ReceiptText, Rows3, Wallet } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import { useI18n } from "../../../providers/I18nProvider";
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
  const { t } = useI18n();

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
        description={t("expenses.summary.totalSpendDescription")}
        icon={<Wallet className="h-5 w-5 text-primary" />}
        title={t("expenses.summary.totalSpend")}
        value={totalAmount}
      />
      <SummaryCard
        description={t("expenses.summary.matchingCountDescription")}
        icon={<ReceiptText className="h-5 w-5 text-primary" />}
        title={t("expenses.summary.matchingCount")}
        value={String(totalCount)}
      />
      <SummaryCard
        description={t(currentPageCount === 1 ? "expenses.summary.currentPageDescription" : "expenses.summary.currentPageDescription_plural").replace("{{count}}", String(currentPageCount))}
        icon={<Rows3 className="h-5 w-5 text-primary" />}
        title={t("expenses.summary.currentPageSpend")}
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
