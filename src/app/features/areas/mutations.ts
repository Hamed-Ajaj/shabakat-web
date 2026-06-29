import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { areaQueryKeys } from "./queries";
import { createArea, deleteArea, updateArea, type AreaPayload } from "./areasApi";

export function useCreateAreaMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AreaPayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to create an area.");
      }

      return createArea(payload, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: areaQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscribers"] }),
      ]);
    },
  });
}

export function useUpdateAreaMutation(id: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AreaPayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to update an area.");
      }

      return updateArea(id, payload, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: areaQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscribers"] }),
      ]);
    },
  });
}

export function useDeleteAreaMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!session?.token) {
        throw new Error("You must be signed in to delete an area.");
      }

      return deleteArea(id, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: areaQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscribers"] }),
      ]);
    },
  });
}
