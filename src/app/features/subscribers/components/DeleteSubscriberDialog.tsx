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
import { useDeleteSubscriberMutation } from "../mutations";

interface DeleteSubscriberDialogProps {
  open: boolean;
  subscriberId: string | null;
  subscriberName: string;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSubscriberDialog({
  open,
  subscriberId,
  subscriberName,
  onOpenChange,
}: Readonly<DeleteSubscriberDialogProps>) {
  const deleteSubscriber = useDeleteSubscriberMutation();

  async function handleDelete() {
    if (!subscriberId) {
      return;
    }

    await deleteSubscriber.mutateAsync(subscriberId);
    toast.success("Subscriber deleted successfully.");
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      deleteSubscriber.reset();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
          <AlertDialogDescription>
            Delete {subscriberName || "this subscriber"}? This is a soft delete in the backend.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteSubscriber.error instanceof Error ? (
          <p className="text-sm text-red-300">{deleteSubscriber.error.message}</p>
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
            {deleteSubscriber.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
