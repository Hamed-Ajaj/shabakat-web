import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { dashboardQueryKeys } from "../dashboard/queries";
import { subscriberQueryKeys } from "../subscribers/queries";
import {
  bulkCreateInvoices,
  createInvoice,
  deleteInvoice,
  recordInvoicePayment,
  type CreateInvoicePayload,
} from "./invoicesApi";
import { invoiceQueryKeys } from "./queries";
import type { BulkCreatePlanType } from "./types";

export function useCreateInvoiceMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInvoicePayload) => {
      if (!session?.token) {
        throw new Error("You must be logged in to create invoices.");
      }

      return createInvoice(payload, session.token);
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
    mutationFn: async (planType?: BulkCreatePlanType) => {
      if (!session?.token) {
        throw new Error("You must be logged in to create invoices.");
      }

      return bulkCreateInvoices(session.token, planType);
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
