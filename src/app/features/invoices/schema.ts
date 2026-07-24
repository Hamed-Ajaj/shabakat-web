import type { InvoiceCustomerPlan } from "./types";
import { z } from "zod/v4";

export const createInvoiceSchema = z
  .object({
    customerId: z.string().trim().min(1, "Customer is required."),
    customerPlan: z.custom<InvoiceCustomerPlan>().optional(),
    fixedKilowattMode: z.enum(["payment", "kilowatt"]).default("payment"),
    paymentAmount: z.union([z.coerce.number(), z.nan()]).optional(),
    kilowattAmount: z.union([z.coerce.number(), z.nan()]).optional(),
    paymentMethod: z.enum(["Cash", "Wish"]).optional(),
    notes: z
      .string()
      .trim()
      .max(500, "Notes must be 500 characters or fewer.")
      .optional()
      .or(z.literal("")),
    billedFrom: z.string().optional(),
    billedTo: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.customerPlan !== "FixedKilowatt") {
      return;
    }

    if (values.fixedKilowattMode === "payment") {
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
    } else if (!Number.isFinite(values.kilowattAmount)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kilowatt amount is required.",
        path: ["kilowattAmount"],
      });
    } else if (values.kilowattAmount <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kilowatt amount must be greater than 0.",
        path: ["kilowattAmount"],
      });
    }

    if (!values.paymentMethod) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment method is required.",
        path: ["paymentMethod"],
      });
    }
  })
  .superRefine((values, context) => {
    if (!values.billedFrom || !values.billedTo) {
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.billedFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(values.billedTo)) {
      return;
    }

    if (new Date(values.billedTo) < new Date(values.billedFrom)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The 'To' date must be on or after the 'From' date.",
        path: ["billedTo"],
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
