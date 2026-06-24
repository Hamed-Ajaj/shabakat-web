import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchCompanyPreferences } from "./settingsApi";

export const settingsQueryKeys = {
  preferences: (companyId?: string) => ["company-preferences", companyId] as const,
};

export function useCompanyPreferencesQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: settingsQueryKeys.preferences(session?.companyId),
    queryFn: () => fetchCompanyPreferences(session?.token ?? ""),
    enabled: Boolean(session?.token),
  });
}
