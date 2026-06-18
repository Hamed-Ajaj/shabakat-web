import { apiRequest } from "../../shared/api/client";
import { formatDate, formatDateTime } from "./utils";
import type {
  InvoiceCustomerOption,
  InvoiceDetail,
  InvoicePayment,
  InvoicesPageData,
  InvoicesQueryFilters,
  InvoiceRow,
  InvoiceStatus,
  PaymentMethod,
} from "./types";

interface InvoiceSummaryResponse {
  id: string;
  invoiceNumber: number;
  customerName: string;
  invoiceStatus: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  amountDue: number;
  createdAt: string;
}

interface InvoiceDetailResponse extends InvoiceSummaryResponse {
  fixedCharge: number;
  tva: number;
  updatedAt: string;
  payments: PaymentResponse[];
}

interface PaymentResponse {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  notes: string | null;
  createdAt: string;
}

interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface CustomerSummaryResponse {
  id: string;
  name: string;
}

interface MessageResponse {
  message: string;
}

interface BulkCreateInvoiceResponse {
  created: number;
  skipped: number;
  message: string;
}

export interface CreateInvoicePayload {
  customerId: string;
}

export interface RecordPaymentPayload {
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateInvoicePayload {
  dueDate?: string;
  issueDate?: string;
}

export async function fetchInvoices(filters: InvoicesQueryFilters, token: string): Promise<InvoicesPageData> {
  const params = new URLSearchParams({
    pageNumber: String(filters.pageIndex + 1),
    pageSize: String(filters.pageSize),
  });

  if (filters.customerId) {
    params.set("customerId", filters.customerId);
  }

  if (filters.invoiceStatus) {
    params.set("invoiceStatus", filters.invoiceStatus);
  }

  if (filters.issueDateFrom) {
    params.set("issueDateFrom", filters.issueDateFrom);
  }

  if (filters.issueDateTo) {
    params.set("issueDateTo", filters.issueDateTo);
  }

  const response = await apiRequest<PagedResponse<InvoiceSummaryResponse>>(
    `/api/v1/invoices?${params.toString()}`,
    undefined,
    token,
  );

  return {
    data: response.data.map(mapInvoiceRow),
    totalCount: response.totalCount,
    pageNumber: response.pageNumber,
    pageSize: response.pageSize,
    pageCount: response.totalPages,
    hasNextPage: response.hasNextPage,
    hasPreviousPage: response.hasPreviousPage,
  };
}

export async function fetchInvoiceDetail(id: string, token: string): Promise<InvoiceDetail> {
  const response = await apiRequest<InvoiceDetailResponse>(`/api/v1/invoices/${id}`, undefined, token);

  return {
    id: response.id,
    invoiceNumber: response.invoiceNumber,
    customerName: response.customerName,
    invoiceStatus: response.invoiceStatus,
    issueDate: response.issueDate,
    issueDateLabel: formatDate(response.issueDate),
    dueDate: response.dueDate,
    dueDateLabel: formatDate(response.dueDate),
    fixedCharge: response.fixedCharge,
    tva: response.tva,
    totalAmount: response.totalAmount,
    paidAmount: response.paidAmount,
    amountDue: response.amountDue,
    createdAt: response.createdAt,
    createdAtLabel: formatDateTime(response.createdAt),
    updatedAt: response.updatedAt,
    updatedAtLabel: formatDateTime(response.updatedAt),
    payments: response.payments.map(mapPayment),
  };
}

export async function fetchInvoiceCustomerOptions(token: string): Promise<InvoiceCustomerOption[]> {
  const response = await apiRequest<PagedResponse<CustomerSummaryResponse>>(
    "/api/v1/customers?pageNumber=1&pageSize=200",
    undefined,
    token,
  );

  return response.data.map((customer) => ({
    id: customer.id,
    name: customer.name,
  }));
}

export function createInvoice(payload: CreateInvoicePayload, token: string) {
  return apiRequest<MessageResponse>(
    "/api/v1/invoices",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function bulkCreateInvoices(token: string) {
  return apiRequest<BulkCreateInvoiceResponse>(
    "/api/v1/invoices/bulk",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
    token,
  );
}

export function recordInvoicePayment(id: string, payload: RecordPaymentPayload, token: string) {
  return apiRequest<MessageResponse>(
    `/api/v1/invoices/${id}/pay`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function updateInvoice(id: string, payload: UpdateInvoicePayload, token: string) {
  return apiRequest<InvoiceDetailResponse>(
    `/api/v1/invoices/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteInvoice(id: string, token: string) {
  return apiRequest<void>(
    `/api/v1/invoices/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}

function mapInvoiceRow(invoice: InvoiceSummaryResponse): InvoiceRow {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    invoiceStatus: invoice.invoiceStatus,
    issueDate: invoice.issueDate,
    issueDateLabel: formatDate(invoice.issueDate),
    dueDate: invoice.dueDate,
    dueDateLabel: formatDate(invoice.dueDate),
    totalAmount: invoice.totalAmount,
    paidAmount: invoice.paidAmount,
    amountDue: invoice.amountDue,
    createdAt: invoice.createdAt,
  };
}

function mapPayment(payment: PaymentResponse): InvoicePayment {
  return {
    id: payment.id,
    invoiceId: payment.invoiceId,
    customerId: payment.customerId,
    customerName: payment.customerName,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    paymentDate: payment.paymentDate,
    paymentDateLabel: formatDateTime(payment.paymentDate),
    notes: payment.notes ?? "",
    createdAt: payment.createdAt,
  };
}
