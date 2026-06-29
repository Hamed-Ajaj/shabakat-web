import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchExpenseDetail, fetchExpenses } from "./expensesApi";
import type { ExpensesQueryFilters } from "./types";

export const expenseQueryKeys = {
  all: ["expenses"] as const,
  company: (companyId?: string, filters?: ExpensesQueryFilters) => ["expenses", companyId, filters] as const,
  detail: (id?: string) => ["expense-detail", id] as const,
};

export function useExpensesQuery(filters: ExpensesQueryFilters) {
  const { session } = useAuth();

  return useQuery({
    queryKey: expenseQueryKeys.company(session?.companyId, filters),
    queryFn: () => fetchExpenses(filters, session?.token ?? ""),
    enabled: Boolean(session?.token),
    placeholderData: keepPreviousData,
  });
}

export function useExpenseDetailQuery(id?: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: expenseQueryKeys.detail(id),
    queryFn: () => fetchExpenseDetail(id ?? "", session?.token ?? ""),
    enabled: Boolean(session?.token && id),
  });
}
