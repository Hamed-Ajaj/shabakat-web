import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchBoxes } from "./boxesApi";

export const boxQueryKeys = {
  all: ["distribution-boxes"] as const,
  company: (companyId?: string, areaId?: string) => ["distribution-boxes", companyId, areaId] as const,
};

export function useBoxesQuery(areaId?: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: boxQueryKeys.company(session?.companyId, areaId),
    queryFn: () => fetchBoxes(session?.token ?? "", areaId),
    enabled: Boolean(session?.token),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

