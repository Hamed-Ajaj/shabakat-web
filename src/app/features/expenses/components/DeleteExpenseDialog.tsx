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
  const deleteExpense = useDeleteExpenseMutation();

  async function handleDelete() {
    if (!expenseId) {
      return;
    }

    await deleteExpense.mutateAsync(expenseId);
    toast.success("Expense deleted successfully.");
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
          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Delete {expenseLabel || "this expense"}? This is a soft delete in the backend.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteExpense.error instanceof Error ? <p className="text-sm text-red-300">{deleteExpense.error.message}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteExpense.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
