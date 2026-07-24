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
  summary: (companyId?: string, year?: number, month?: number) => ["dashboard", companyId, "summary", year, month] as const,
  paidInvoices: (companyId?: string) => ["dashboard", companyId, "paid-invoices"] as const,
  unpaidInvoices: (companyId?: string) => ["dashboard", companyId, "unpaid-invoices"] as const,
  partiallyPaidInvoices: (companyId?: string) => ["dashboard", companyId, "partially-paid-invoices"] as const,
};

export interface DashboardFilter {
  year?: number;
  month?: number;
}

export function useDashboardQueries(filter: DashboardFilter = {}) {
  const { session } = useAuth();
  const token = session?.token ?? "";
  const companyId = session?.companyId;
  const enabled = Boolean(session?.token);
  const { year, month } = filter;

  const queries = useQueries({
    queries: [
      {
        queryKey: dashboardQueryKeys.summary(companyId, year, month),
        queryFn: () => fetchDashboardSummary(token, year, month),
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
