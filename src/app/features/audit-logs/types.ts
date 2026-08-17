export type AuditLogAction =
  | "CustomerCreated"
  | "CustomerUpdated"
  | "CustomerDeleted"
  | "InvoiceCreated"
  | "InvoiceBulkCreated"
  | "InvoicePaymentRecorded"
  | "InvoiceFixedKilowattCharge"
  | "ExpenseCreated"
  | "ExpenseUpdated"
  | "ExpenseDeleted";

export type AuditLogStatus = "Success" | "Failed";

export interface AuditLog {
  id: string;
  action: AuditLogAction;
  status: AuditLogStatus;
  messageKey: string;
  parameters: Record<string, unknown>;
  entityType: string | null;
  entityId: string | null;
  userEmail: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface AuditLogFilters {
  action: AuditLogAction | "";
  status: AuditLogStatus | "";
  createdFrom: string;
  createdTo: string;
  pageIndex: number;
  pageSize: number;
}

export interface AuditLogsPage {
  data: AuditLog[];
  totalCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
