export type AuditLogStatus = "Success" | "Failed";

export interface AuditLog {
  id: string;
  action: string;
  status: AuditLogStatus;
  messageKey: string;
  parameters: Record<string, number | string | null | undefined>;
  entityType: string | null;
  entityId: string | null;
  userEmail: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface AuditLogsPage {
  data: AuditLog[];
  totalCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
