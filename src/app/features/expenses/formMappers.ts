import type { ExpenseFormInput, ExpenseFormOutput } from "./schema";
import type { ExpenseDetail, ExpensePayload } from "./types";

export function mapExpenseFormValuesToPayload(values: ExpenseFormOutput): ExpensePayload {
  return {
    expenseType: values.expenseType,
    amount: values.amount,
    expenseDate: values.expenseDate || undefined,
    label: values.label?.trim() || null,
    notes: values.notes?.trim() || null,
  };
}

export function mapExpenseDetailToFormInput(expense: ExpenseDetail): ExpenseFormInput {
  return {
    expenseType: expense.expenseType,
    amount: expense.amount,
    expenseDate: expense.expenseDate,
    label: expense.label,
    notes: expense.notes,
  };
}
