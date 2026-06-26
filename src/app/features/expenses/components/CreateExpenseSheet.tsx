import { toast } from "sonner";
import { mapExpenseFormValuesToPayload } from "../formMappers";
import { useCreateExpenseMutation } from "../mutations";
import type { ExpenseFormOutput } from "../schema";
import { ExpenseFormSheet } from "./ExpenseFormSheet";

interface CreateExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExpenseSheet({
  open,
  onOpenChange,
}: Readonly<CreateExpenseSheetProps>) {
  const createExpense = useCreateExpenseMutation();

  async function handleSubmit(values: ExpenseFormOutput) {
    await createExpense.mutateAsync(mapExpenseFormValuesToPayload(values));

    toast.success("Expense created successfully.");
    onOpenChange(false);
  }

  return (
    <ExpenseFormSheet
      description="Track fuel, maintenance, payroll, and other operating costs."
      error={createExpense.error instanceof Error ? createExpense.error.message : ""}
      open={open}
      pending={createExpense.isPending}
      submitLabel="Create Expense"
      title="Add Expense"
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createExpense.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
