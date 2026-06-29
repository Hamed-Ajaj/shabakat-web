export type InvoiceStatus = "Unpaid" | "PartiallyPaid" | "Paid";
export type PaymentMethod = "Cash" | "Wish";
export type InvoiceCustomerPlan = "Ampere" | "Kilowatt" | "FixedKilowatt";
export type InvoiceCustomerType = "Residential" | "Commercial" | "Industrial";

export interface InvoiceRow {
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

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  notes: string;
  createdAt: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: number;
  customerName: string;
  invoiceStatus: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  fixedCharge: number;
  tva: number;
  totalAmount: number;
  paidAmount: number;
  amountDue: number;
  createdAt: string;
  updatedAt: string;
  payments: InvoicePayment[];
}

export interface InvoiceCustomerOption {
  id: string;
  name: string;
  plan: InvoiceCustomerPlan;
  customerType: InvoiceCustomerType;
  planValue: number;
}

export interface FixedKilowattCalculation {
  paymentAmount: number;
  kilowattAmount: number;
  unitPrice: number;
  fixedCharge: number;
  tva: number;
  planValue: number;
  customerType: InvoiceCustomerType;
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
