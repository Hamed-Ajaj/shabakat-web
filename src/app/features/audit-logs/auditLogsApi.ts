import { apiRequest } from "../../shared/api/client";
import type { AuditLogsPage } from "./types";

interface AuditLogsResponse extends Omit<AuditLogsPage, "pageCount"> {
  totalPages: number;
}

export async function fetchAuditLogs(pageIndex: number, pageSize: number, token: string): Promise<AuditLogsPage> {
  const response = await apiRequest<AuditLogsResponse>(
    `/api/v1/audit-logs?pageNumber=${pageIndex + 1}&pageSize=${pageSize}`,
    undefined,
    token,
  );

  return { ...response, pageCount: response.totalPages };
}
