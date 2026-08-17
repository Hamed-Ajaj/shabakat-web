import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchAuditLogs } from "./auditLogsApi";
import type { AuditLogFilters } from "./types";

export const auditLogQueryKeys = {
  all: ["audit-logs"] as const,
  list: (companyId: string | undefined, filters: AuditLogFilters) =>
    [...auditLogQueryKeys.all, companyId, filters] as const,
};

export function useAuditLogsQuery(filters: AuditLogFilters) {
  const { session } = useAuth();

  return useQuery({
    queryKey: auditLogQueryKeys.list(session?.companyId, filters),
    queryFn: () => fetchAuditLogs(filters, session?.token ?? ""),
    enabled: Boolean(session?.token && session.role === "Owner"),
    placeholderData: keepPreviousData,
  });
}
