import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import {
  calculateFixedKilowatt,
  fetchInvoiceCustomerOptions,
  fetchInvoiceDetail,
  fetchInvoices,
  type FixedKilowattCalculatePayload,
} from "./invoicesApi";
import type { InvoicesQueryFilters } from "./types";

export const invoiceQueryKeys = {
  all: ["invoices"] as const,
  company: (companyId?: string, filters?: InvoicesQueryFilters) =>
    ["invoices", companyId, filters] as const,
  detail: (id?: string) => ["invoice-detail", id] as const,
  customers: (companyId?: string) => ["invoice-customers", companyId] as const,
  fixedKilowattCalculation: (companyId?: string, payload?: FixedKilowattCalculatePayload) =>
    ["invoice-fixed-kilowatt-calculation", companyId, payload] as const,
};

export function useInvoicesQuery(filters: InvoicesQueryFilters) {
  const { session } = useAuth();

  return useQuery({
    queryKey: invoiceQueryKeys.company(session?.companyId, filters),
    queryFn: () => fetchInvoices(filters, session?.token ?? ""),
    enabled: Boolean(session?.token),
    placeholderData: keepPreviousData,
  });
}

export function useInvoiceDetailQuery(id?: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: invoiceQueryKeys.detail(id),
    queryFn: () => fetchInvoiceDetail(id ?? "", session?.token ?? ""),
    enabled: Boolean(session?.token && id),
  });
}

export function useInvoiceCustomerOptionsQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: invoiceQueryKeys.customers(session?.companyId),
    queryFn: () => fetchInvoiceCustomerOptions(session?.token ?? ""),
    enabled: Boolean(session?.token),
    staleTime: 1000 * 60 * 30,
  });
}

export function useFixedKilowattCalculationQuery(payload?: FixedKilowattCalculatePayload) {
  const { session } = useAuth();

  return useQuery({
    queryKey: invoiceQueryKeys.fixedKilowattCalculation(session?.companyId, payload),
    queryFn: () => calculateFixedKilowatt(payload!, session?.token ?? ""),
    enabled: Boolean(session?.token && payload),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
