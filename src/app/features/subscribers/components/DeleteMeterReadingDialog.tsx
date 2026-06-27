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
import { useDeleteMeterReadingMutation } from "../mutations";

interface DeleteMeterReadingDialogProps {
  customerId: string;
  open: boolean;
  readingId: string | null;
  readingLabel: string;
  onOpenChange: (open: boolean) => void;
}

export function DeleteMeterReadingDialog({
  customerId,
  open,
  readingId,
  readingLabel,
  onOpenChange,
}: Readonly<DeleteMeterReadingDialogProps>) {
  const deleteReading = useDeleteMeterReadingMutation(customerId);

  async function handleDelete() {
    if (!readingId) {
      return;
    }

    await deleteReading.mutateAsync(readingId);
    toast.success("Meter reading deleted successfully.");
    onOpenChange(false);
  }

  function handleDialogChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      deleteReading.reset();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleDialogChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Meter Reading</AlertDialogTitle>
          <AlertDialogDescription>
            Delete {readingLabel || "this reading"}? Use this only to correct a mistaken entry before recording the right one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteReading.error instanceof Error ? (
          <p className="text-sm text-red-300">{deleteReading.error.message}</p>
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
            {deleteReading.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
