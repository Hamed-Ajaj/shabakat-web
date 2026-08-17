import { apiRequest } from "../../shared/api/client";
import type { AuditLogFilters, AuditLogsPage } from "./types";

interface AuditLogsResponse extends Omit<AuditLogsPage, "pageCount"> {
  totalPages: number;
}

export async function fetchAuditLogs(
  filters: AuditLogFilters,
  token: string,
): Promise<AuditLogsPage> {
  const params = new URLSearchParams({
    pageNumber: String(filters.pageIndex + 1),
    pageSize: String(filters.pageSize),
  });

  if (filters.action) {
    params.set("action", filters.action);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.createdFrom) {
    params.set("createdFrom", filters.createdFrom);
  }

  if (filters.createdTo) {
    // The API uses an inclusive DateTime comparison; include the full selected day.
    params.set("createdTo", `${filters.createdTo}T23:59:59.999`);
  }

  const response = await apiRequest<AuditLogsResponse>(
    `/api/v1/audit-logs?${params.toString()}`,
    undefined,
    token,
  );

  return { ...response, pageCount: response.totalPages };
}
