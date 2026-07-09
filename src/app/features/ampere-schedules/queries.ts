import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchAmpereSchedules } from "./ampereSchedulesApi";

export const ampereScheduleQueryKeys = {
  all: ["ampere-schedules"] as const,
  company: (companyId?: string) => ["ampere-schedules", companyId] as const,
};

export function useAmpereSchedulesQuery(enabled = true) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ampereScheduleQueryKeys.company(session?.companyId),
    queryFn: () => fetchAmpereSchedules(session?.token ?? ""),
    enabled: Boolean(session?.token && enabled),
    staleTime: 60_000,
  });
}
