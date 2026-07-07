import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { createBox, updateBox, type BoxPayload } from "./boxesApi";
import { boxQueryKeys } from "./queries";

export function useCreateBoxMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BoxPayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to create a distribution box.");
      }

      return createBox(payload, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: boxQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-distribution-boxes"] }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-detail"] }),
      ]);
    },
  });
}

export function useUpdateBoxMutation(id: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BoxPayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to update a distribution box.");
      }

      return updateBox(id, payload, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: boxQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-distribution-boxes"] }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-detail"] }),
      ]);
    },
  });
}

