import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { useI18n } from "../../../providers/I18nProvider";
import { useDeleteExpenseMutation } from "../mutations";

interface DeleteExpenseDialogProps {
  expenseId: string | null;
  expenseLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteExpenseDialog({
  expenseId,
  expenseLabel,
  open,
  onOpenChange,
}: Readonly<DeleteExpenseDialogProps>) {
  const { t } = useI18n();
  const deleteExpense = useDeleteExpenseMutation();

  async function handleDelete() {
    if (!expenseId) {
      return;
    }

    await deleteExpense.mutateAsync(expenseId);
    toast.success(t("expenses.delete.success"));
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      deleteExpense.reset();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("expenses.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("expenses.delete.description").replace("{{name}}", expenseLabel || t("expenses.delete.fallbackName"))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteExpense.error instanceof Error ? <p className="text-sm text-red-300">{deleteExpense.error.message}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel>{t("expenses.actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteExpense.isPending ? t("expenses.actions.deleting") : t("expenses.actions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
