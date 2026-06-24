import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { mapPreferencesToPayload, saveCompanyPreferences } from "./settingsApi";
import { settingsQueryKeys } from "./queries";
import type { CompanyPreferences } from "./types";

export function useSaveCompanyPreferencesMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: CompanyPreferences) => {
      if (!session?.token) {
        throw new Error("You must be logged in to update company preferences.");
      }

      return saveCompanyPreferences(mapPreferencesToPayload(preferences), session.token);
    },
    onSuccess: async (_, preferences) => {
      queryClient.setQueryData(settingsQueryKeys.preferences(session?.companyId), preferences);
    },
  });
}
