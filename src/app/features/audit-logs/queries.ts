import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchAuditLogs } from "./auditLogsApi";

export const auditLogQueryKeys = {
  all: ["audit-logs"] as const,
  page: (companyId: string | undefined, pageIndex: number, pageSize: number) =>
    [...auditLogQueryKeys.all, companyId, pageIndex, pageSize] as const,
};

export function useAuditLogsQuery(pageIndex: number, pageSize: number) {
  const { session } = useAuth();

  return useQuery({
    queryKey: auditLogQueryKeys.page(session?.companyId, pageIndex, pageSize),
    queryFn: () => fetchAuditLogs(pageIndex, pageSize, session?.token ?? ""),
    enabled: Boolean(session?.token && session.role === "Owner"),
    placeholderData: keepPreviousData,
  });
}
