export type InvoiceStatus = "Unpaid" | "PartiallyPaid" | "Paid";
export type PaymentMethod = "Cash" | "Wish";

export interface InvoiceRow {
  id: string;
  invoiceNumber: number;
  customerName: string;
  invoiceStatus: InvoiceStatus;
  issueDate: string;
  issueDateLabel: string;
  dueDate: string;
  dueDateLabel: string;
  totalAmount: number;
  paidAmount: number;
  amountDue: number;
  createdAt: string;
}

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentDateLabel: string;
  notes: string;
  createdAt: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: number;
  customerName: string;
  invoiceStatus: InvoiceStatus;
  issueDate: string;
  issueDateLabel: string;
  dueDate: string;
  dueDateLabel: string;
  fixedCharge: number;
  tva: number;
  totalAmount: number;
  paidAmount: number;
  amountDue: number;
  createdAt: string;
  createdAtLabel: string;
  updatedAt: string;
  updatedAtLabel: string;
  payments: InvoicePayment[];
}

export interface InvoiceCustomerOption {
  id: string;
  name: string;
}

export interface InvoicesQueryFilters {
  customerId: string;
  invoiceStatus: "" | InvoiceStatus;
  issueDateFrom: string;
  issueDateTo: string;
  pageIndex: number;
  pageSize: number;
}

export interface InvoicesPageData {
  data: InvoiceRow[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
