import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { mapPreferencesToPayload, mapProfileResponse, removeCompanyLogo, saveCompanyPreferences, uploadCompanyLogo } from "./settingsApi";
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

export function useUploadCompanyLogoMutation() {
  const { session, updateSessionProfile } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!session?.token) {
        throw new Error("You must be logged in to update the company logo.");
      }

      const response = await uploadCompanyLogo(file, session.token);
      return mapProfileResponse(response);
    },
    onSuccess: (profile) => {
      updateSessionProfile({
        companyName: profile.name,
        logoUrl: profile.logoUrl,
      });
    },
  });
}

export function useRemoveCompanyLogoMutation() {
  const { session, updateSessionProfile } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!session?.token) {
        throw new Error("You must be logged in to update the company logo.");
      }

      const response = await removeCompanyLogo(session.companyName, session.token);
      return mapProfileResponse(response);
    },
    onSuccess: (profile) => {
      updateSessionProfile({
        companyName: profile.name,
        logoUrl: profile.logoUrl,
      });
    },
  });
}
