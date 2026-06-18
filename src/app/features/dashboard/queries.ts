import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "../../providers/AuthProvider";
import {
  fetchDashboardSummary,
  fetchPaidInvoices,
  fetchPartiallyPaidInvoices,
  fetchUnpaidInvoices,
} from "./dashboardApi";
import type { DashboardInvoiceItem, DashboardSummary } from "./types";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: (companyId?: string) => ["dashboard", companyId, "summary"] as const,
  paidInvoices: (companyId?: string) => ["dashboard", companyId, "paid-invoices"] as const,
  unpaidInvoices: (companyId?: string) => ["dashboard", companyId, "unpaid-invoices"] as const,
  partiallyPaidInvoices: (companyId?: string) => ["dashboard", companyId, "partially-paid-invoices"] as const,
};

export function useDashboardQueries() {
  const { session } = useAuth();
  const token = session?.token ?? "";
  const companyId = session?.companyId;
  const enabled = Boolean(session?.token);

  const queries = useQueries({
    queries: [
      {
        queryKey: dashboardQueryKeys.summary(companyId),
        queryFn: () => fetchDashboardSummary(token),
        enabled,
        staleTime: 1000 * 60,
      },
      {
        queryKey: dashboardQueryKeys.paidInvoices(companyId),
        queryFn: () => fetchPaidInvoices(token),
        enabled,
        staleTime: 1000 * 60,
      },
      {
        queryKey: dashboardQueryKeys.unpaidInvoices(companyId),
        queryFn: () => fetchUnpaidInvoices(token),
        enabled,
        staleTime: 1000 * 60,
      },
      {
        queryKey: dashboardQueryKeys.partiallyPaidInvoices(companyId),
        queryFn: () => fetchPartiallyPaidInvoices(token),
        enabled,
        staleTime: 1000 * 60,
      },
    ],
  });

  return useMemo(
    () => ({
      summaryQuery: queries[0] as UseQueryResult<DashboardSummary, Error>,
      paidInvoicesQuery: queries[1] as UseQueryResult<DashboardInvoiceItem[], Error>,
      unpaidInvoicesQuery: queries[2] as UseQueryResult<DashboardInvoiceItem[], Error>,
      partiallyPaidInvoicesQuery: queries[3] as UseQueryResult<DashboardInvoiceItem[], Error>,
    }),
    [queries],
  );
}
