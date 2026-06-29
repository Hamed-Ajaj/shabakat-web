import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchAreas } from "./areasApi";

export const areaQueryKeys = {
  all: ["areas"] as const,
  company: (companyId?: string) => ["areas", companyId] as const,
};

export function useAreasQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: areaQueryKeys.company(session?.companyId),
    queryFn: () => fetchAreas(session?.token ?? ""),
    enabled: Boolean(session?.token),
    staleTime: 1000 * 60 * 30,
  });
}
