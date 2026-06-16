import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import {
  createSubscriber,
  deleteSubscriber,
  updateSubscriber,
  type CreateSubscriberPayload,
  type UpdateSubscriberPayload,
} from "./subscribersApi";
import { subscriberQueryKeys } from "./queries";

export function useCreateSubscriberMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSubscriberPayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to create a subscriber.");
      }

      return createSubscriber(payload, session.token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subscriberQueryKeys.all,
      });
    },
  });
}

export function useUpdateSubscriberMutation(id: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSubscriberPayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to update a subscriber.");
      }

      return updateSubscriber(id, payload, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: subscriberQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: subscriberQueryKeys.detail(id) }),
      ]);
    },
  });
}

export function useDeleteSubscriberMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!session?.token) {
        throw new Error("You must be signed in to delete a subscriber.");
      }

      return deleteSubscriber(id, session.token);
    },
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: subscriberQueryKeys.all }),
        queryClient.removeQueries({ queryKey: subscriberQueryKeys.detail(id) }),
      ]);
    },
  });
}
