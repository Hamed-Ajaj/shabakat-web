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
import { useDeleteAreaMutation } from "../mutations";
import type { AreaRecord } from "../types";

interface DeleteAreaDialogProps {
  area: AreaRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAreaDialog({
  area,
  open,
  onOpenChange,
}: Readonly<DeleteAreaDialogProps>) {
  const deleteArea = useDeleteAreaMutation();

  async function handleDelete() {
    if (!area) {
      return;
    }

    await deleteArea.mutateAsync(area.id);
    toast.success("Area deleted successfully.");
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      deleteArea.reset();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Area</AlertDialogTitle>
          <AlertDialogDescription>
            Delete {area?.name || "this area"}? The backend blocks deletion if subscribers are still assigned to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteArea.error instanceof Error ? (
          <p className="text-sm text-red-300">{deleteArea.error.message}</p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteArea.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
