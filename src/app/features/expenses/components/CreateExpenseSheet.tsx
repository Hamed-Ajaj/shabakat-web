import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
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
  const { t } = useI18n();
  const createExpense = useCreateExpenseMutation();

  async function handleSubmit(values: ExpenseFormOutput) {
    await createExpense.mutateAsync(mapExpenseFormValuesToPayload(values));

    toast.success(t("expenses.toast.created"));
    onOpenChange(false);
  }

  return (
      <ExpenseFormSheet
      description={t("expenses.form.description.create")}
      error={createExpense.error instanceof Error ? createExpense.error.message : ""}
      open={open}
      pending={createExpense.isPending}
      submitLabel={t("expenses.actions.create")}
      title={t("expenses.form.title.create")}
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
