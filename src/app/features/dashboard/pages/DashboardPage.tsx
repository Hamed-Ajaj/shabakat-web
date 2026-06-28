import { Suspense, lazy, useMemo } from "react";
import { AlertCircle, ArrowUpRight, DollarSign, UserCheck, Users } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import { MetricCard } from "../components/MetricCard";
import { RecentPaymentsPanel, UpcomingDuePanel } from "../components/PaymentsPanels";
import { formatCurrencyEn } from "../formatters";
import { useDashboardQueries } from "../queries";

const RevenueChartCard = lazy(async () => {
  const module = await import("../components/RevenueChartCard");
  return { default: module.RevenueChartCard };
});

export default function DashboardPage() {
  const { t } = useI18n();
  const {
    summaryQuery,
    paidInvoicesQuery,
    unpaidInvoicesQuery,
    partiallyPaidInvoicesQuery,
  } = useDashboardQueries();

  const recentPaidInvoices = useMemo(
    () =>
      [...(paidInvoicesQuery.data ?? [])]
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 5),
    [paidInvoicesQuery.data],
  );

  const upcomingDueInvoices = useMemo(
    () =>
      [...(unpaidInvoicesQuery.data ?? []), ...(partiallyPaidInvoicesQuery.data ?? [])]
        .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime())
        .slice(0, 5),
    [partiallyPaidInvoicesQuery.data, unpaidInvoicesQuery.data],
  );

  return (
    <div className="space-y-5">
      {summaryQuery.isError ? (
        <SectionCard className="border-red-400/20 bg-red-400/10 p-5 text-red-200">
          <h2 className="text-lg font-semibold">{t("dashboard.error.failedToLoad")}</h2>
          <p className="mt-1 text-sm text-red-200/80">{summaryQuery.error.message}</p>
        </SectionCard>
      ) : summaryQuery.isLoading || !summaryQuery.data ? (
        <DashboardMetricsSkeleton />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={t("dashboard.metric.totalSubscribers")}
              value={summaryQuery.data.customers.total}
              hint={t("dashboard.metric.subscribersHint", {
                active: summaryQuery.data.customers.active,
                suspended: summaryQuery.data.customers.suspended,
              })}
              icon={Users}
              accentClassName="text-foreground"
            />
            <MetricCard
              label={t("dashboard.metric.collectedAllTime")}
              value={formatCurrencyEn(summaryQuery.data.totalCollectedAllTime)}
              hint={t("dashboard.metric.collectedHint", {
                rate: summaryQuery.data.collectionRate.toFixed(0),
                amount: formatCurrencyEn(summaryQuery.data.totalBilledAllTime),
              })}
              icon={UserCheck}
              accentClassName="text-emerald-400"
            />
            <MetricCard
              label={t("dashboard.metric.outstandingInvoices")}
              value={summaryQuery.data.invoices.unpaidCount + summaryQuery.data.invoices.partiallyPaidCount}
              hint={t("dashboard.metric.outstandingHint", {
                unpaid: summaryQuery.data.invoices.unpaidCount,
                partial: summaryQuery.data.invoices.partiallyPaidCount,
              })}
              icon={AlertCircle}
              accentClassName="text-red-400"
            />

            <SectionCard className="border-primary/30 bg-primary p-5 text-primary-foreground shadow-[0_0_30px_rgba(245,192,0,0.18)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">{t("dashboard.metric.netIncomeAllTime")}</p>
                  <p className="mt-2 font-mono text-3xl font-bold">{formatCurrencyEn(summaryQuery.data.netIncomeAllTime)}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/70">
                    <ArrowUpRight className="h-3 w-3" />
                    {t("dashboard.metric.outstandingValueHint", {
                      amount: formatCurrencyEn(summaryQuery.data.totalOutstandingAllTime),
                    })}
                  </p>
                </div>
                <div className="rounded-xl bg-black/10 p-2.5">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </SectionCard>
          </div>

          <Suspense fallback={<DashboardChartSkeleton />}>
            <RevenueChartCard summary={summaryQuery.data} />
          </Suspense>
        </>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <RecentPaymentsPanel
          items={recentPaidInvoices}
          loading={paidInvoicesQuery.isLoading}
          error={paidInvoicesQuery.error instanceof Error ? paidInvoicesQuery.error.message : undefined}
        />
        <UpcomingDuePanel
          items={upcomingDueInvoices}
          loading={unpaidInvoicesQuery.isLoading || partiallyPaidInvoicesQuery.isLoading}
          error={resolvePanelError(unpaidInvoicesQuery.error, partiallyPaidInvoicesQuery.error)}
        />
      </div>
    </div>
  );
}

function DashboardMetricsSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SectionCard key={index} className="p-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-9 w-24" />
            <Skeleton className="mt-3 h-3 w-36" />
          </SectionCard>
        ))}
      </div>
      <DashboardChartSkeleton />
    </>
  );
}

function DashboardChartSkeleton() {
  return (
    <SectionCard className="p-5">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-2 h-3 w-72" />
      <Skeleton className="mt-6 h-60 w-full rounded-2xl" />
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    </SectionCard>
  );
}

function resolvePanelError(...errors: Array<Error | null>) {
  const error = errors.find(Boolean);
  return error ? error.message : undefined;
}
