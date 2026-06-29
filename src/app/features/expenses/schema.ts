import { z } from "zod/v4";

export const expenseFormSchema = z
  .object({
    expenseType: z.enum(["Fuel", "Maintenance", "Employees", "Other"], {
      message: "Expense type is required.",
    }),
    amount: z.coerce.number().min(0.0001, "Amount must be greater than zero."),
    expenseDate: z.string().optional().or(z.literal("")),
    label: z.string().trim().max(100, "Label must be 100 characters or fewer.").optional().or(z.literal("")),
    notes: z.string().trim().max(500, "Notes must be 500 characters or fewer.").optional().or(z.literal("")),
  })
  .superRefine((values, context) => {
    if (values.expenseType === "Other" && !values.label?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Label is required for Other expenses.",
        path: ["label"],
      });
    }
  });

export type ExpenseFormInput = z.input<typeof expenseFormSchema>;
export type ExpenseFormOutput = z.output<typeof expenseFormSchema>;

export const defaultExpenseFormValues: ExpenseFormInput = {
  expenseType: "Fuel",
  amount: 0,
  expenseDate: "",
  label: "",
  notes: "",
};
