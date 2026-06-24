import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { dashboardQueryKeys } from "../dashboard/queries";
import { subscriberQueryKeys } from "../subscribers/queries";
import {
  bulkCreateInvoices,
  createInvoice,
  deleteInvoice,
  recordInvoicePayment,
} from "./invoicesApi";
import { invoiceQueryKeys } from "./queries";

export function useCreateInvoiceMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      if (!session?.token) {
        throw new Error("You must be logged in to create invoices.");
      }

      return createInvoice({ customerId }, session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: subscriberQueryKeys.all }),
      ]),
  });
}

export function useBulkCreateInvoicesMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!session?.token) {
        throw new Error("You must be logged in to create invoices.");
      }

      return bulkCreateInvoices(session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: subscriberQueryKeys.all }),
      ]),
  });
}

export function useRecordInvoicePaymentMutation(invoiceId: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { amount: number; paymentMethod: "Cash" | "Wish"; notes?: string }) => {
      if (!session?.token) {
        throw new Error("You must be logged in to record payments.");
      }

      return recordInvoicePayment(invoiceId, payload, session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.detail(invoiceId) }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: subscriberQueryKeys.all }),
      ]),
  });
}

export function useDeleteInvoiceMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceId: string) => {
      if (!session?.token) {
        throw new Error("You must be logged in to delete invoices.");
      }

      return deleteInvoice(invoiceId, session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: invoiceQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: subscriberQueryKeys.all }),
      ]),
  });
}
