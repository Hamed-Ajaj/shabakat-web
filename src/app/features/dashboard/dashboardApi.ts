import { apiRequest } from "../../shared/api/client";
import type { DashboardInvoiceItem, DashboardSummary } from "./types";

interface InvoiceSummaryResponse {
  id: string;
  invoiceNumber: number;
  customerName: string;
  invoiceStatus: "Unpaid" | "PartiallyPaid" | "Paid";
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  amountDue: number;
  createdAt: string;
}

interface InvoicePageResponse {
  data: InvoiceSummaryResponse[];
}

export function fetchDashboardSummary(token: string) {
  return apiRequest<DashboardSummary>("/api/v1/dashboard/summary", undefined, token);
}

export async function fetchPaidInvoices(token: string): Promise<DashboardInvoiceItem[]> {
  return fetchInvoicesByStatus("Paid", token);
}

export async function fetchUnpaidInvoices(token: string): Promise<DashboardInvoiceItem[]> {
  return fetchInvoicesByStatus("Unpaid", token);
}

export async function fetchPartiallyPaidInvoices(token: string): Promise<DashboardInvoiceItem[]> {
  return fetchInvoicesByStatus("PartiallyPaid", token);
}

async function fetchInvoicesByStatus(
  invoiceStatus: "Unpaid" | "PartiallyPaid" | "Paid",
  token: string,
): Promise<DashboardInvoiceItem[]> {
  const params = new URLSearchParams({
    invoiceStatus,
    pageNumber: "1",
    pageSize: "20",
  });

  const response = await apiRequest<InvoicePageResponse>(
    `/api/v1/invoices?${params.toString()}`,
    undefined,
    token,
  );

  return response.data.map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    totalAmount: invoice.totalAmount,
    paidAmount: invoice.paidAmount,
    amountDue: invoice.amountDue,
    createdAt: invoice.createdAt,
  }));
}
