import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import {
  createAmpereSchedule,
  deleteAmpereSchedule,
  updateAmpereSchedule,
  type AmpereSchedulePayload,
} from "./ampereSchedulesApi";
import { ampereScheduleQueryKeys } from "./queries";

export function useCreateAmpereScheduleMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AmpereSchedulePayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to create an ampere schedule.");
      }

      return createAmpereSchedule(payload, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ampereScheduleQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-ampere-schedules"] }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-detail"] }),
      ]);
    },
  });
}

export function useUpdateAmpereScheduleMutation(id: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AmpereSchedulePayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to update an ampere schedule.");
      }

      return updateAmpereSchedule(id, payload, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ampereScheduleQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-ampere-schedules"] }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-detail"] }),
      ]);
    },
  });
}

export function useDeleteAmpereScheduleMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!session?.token) {
        throw new Error("You must be signed in to delete an ampere schedule.");
      }

      return deleteAmpereSchedule(id, session.token);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ampereScheduleQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-ampere-schedules"] }),
        queryClient.invalidateQueries({ queryKey: ["subscriber-detail"] }),
      ]);
    },
  });
}
