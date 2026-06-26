import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { dashboardQueryKeys } from "../dashboard/queries";
import { createExpense, deleteExpense, updateExpense } from "./expensesApi";
import { expenseQueryKeys } from "./queries";
import type { ExpensePayload } from "./types";

export function useCreateExpenseMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ExpensePayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to create expenses.");
      }

      return createExpense(payload, session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
      ]),
  });
}

export function useUpdateExpenseMutation(id: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ExpensePayload) => {
      if (!session?.token) {
        throw new Error("You must be signed in to update expenses.");
      }

      return updateExpense(id, payload, session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
      ]),
  });
}

export function useDeleteExpenseMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!session?.token) {
        throw new Error("You must be signed in to delete expenses.");
      }

      return deleteExpense(id, session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: expenseQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
      ]),
  });
}
