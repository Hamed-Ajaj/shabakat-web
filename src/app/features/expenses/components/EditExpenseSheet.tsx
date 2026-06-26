import { useMemo } from "react";
import { toast } from "sonner";
import { mapExpenseDetailToFormInput, mapExpenseFormValuesToPayload } from "../formMappers";
import { useExpenseDetailQuery } from "../queries";
import { useUpdateExpenseMutation } from "../mutations";
import type { ExpenseFormInput, ExpenseFormOutput } from "../schema";
import { defaultExpenseFormValues } from "../schema";
import { ExpenseFormSheet } from "./ExpenseFormSheet";

interface EditExpenseSheetProps {
  expenseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExpenseSheet({
  expenseId,
  open,
  onOpenChange,
}: Readonly<EditExpenseSheetProps>) {
  const detailQuery = useExpenseDetailQuery(expenseId ?? undefined);
  const updateExpense = useUpdateExpenseMutation(expenseId ?? "");

  const initialValues = useMemo<ExpenseFormInput>(() => {
    if (!detailQuery.data) {
      return defaultExpenseFormValues;
    }

    return mapExpenseDetailToFormInput(detailQuery.data);
  }, [detailQuery.data]);

  async function handleSubmit(values: ExpenseFormOutput) {
    await updateExpense.mutateAsync(mapExpenseFormValuesToPayload(values));

    toast.success("Expense updated successfully.");
    onOpenChange(false);
  }

  const error =
    detailQuery.error instanceof Error
      ? detailQuery.error.message
      : updateExpense.error instanceof Error
        ? updateExpense.error.message
        : "";

  return (
    <ExpenseFormSheet
      description="Edit the expense line item and keep dashboard totals current."
      error={error}
      open={open}
      pending={detailQuery.isLoading || updateExpense.isPending}
      submitLabel="Save Changes"
      title="Edit Expense"
      values={initialValues}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          updateExpense.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
