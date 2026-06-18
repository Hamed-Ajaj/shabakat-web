import { z } from "zod/v4";

export const createInvoiceSchema = z.object({
  customerId: z.string().trim().min(1, "Customer is required."),
});

export const recordPaymentSchema = z.object({
  amount: z.coerce.number().min(0.01, "Payment amount must be greater than 0."),
  paymentMethod: z.enum(["Cash", "Wish"], {
    message: "Payment method is required.",
  }),
  notes: z.string().trim().max(500, "Notes must be 500 characters or fewer.").optional().or(z.literal("")),
});

export type CreateInvoiceFormInput = z.input<typeof createInvoiceSchema>;
export type CreateInvoiceFormValues = z.output<typeof createInvoiceSchema>;
export type RecordPaymentFormInput = z.input<typeof recordPaymentSchema>;
export type RecordPaymentFormValues = z.output<typeof recordPaymentSchema>;
