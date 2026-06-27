import type { InvoiceCustomerPlan } from "./types";
import { z } from "zod/v4";

export const createInvoiceSchema = z
  .object({
    customerId: z.string().trim().min(1, "Customer is required."),
    customerPlan: z.custom<InvoiceCustomerPlan>().optional(),
    paymentAmount: z.union([z.coerce.number(), z.nan()]).optional(),
    paymentMethod: z.enum(["Cash", "Wish"]).optional(),
    notes: z
      .string()
      .trim()
      .max(500, "Notes must be 500 characters or fewer.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((values, context) => {
    if (values.customerPlan !== "FixedKilowatt") {
      return;
    }

    if (!Number.isFinite(values.paymentAmount)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment amount is required.",
        path: ["paymentAmount"],
      });
    } else if (values.paymentAmount <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment amount must be greater than 0.",
        path: ["paymentAmount"],
      });
    }

    if (!values.paymentMethod) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment method is required.",
        path: ["paymentMethod"],
      });
    }
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
