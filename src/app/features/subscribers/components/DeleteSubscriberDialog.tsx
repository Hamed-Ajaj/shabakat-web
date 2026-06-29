import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
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
  const { t } = useI18n();
  const deleteSubscriber = useDeleteSubscriberMutation();

  async function handleDelete() {
    if (!subscriberId) {
      return;
    }

    await deleteSubscriber.mutateAsync(subscriberId);
    toast.success(t("subscribers.delete.success"));
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
          <AlertDialogTitle>{t("subscribers.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("subscribers.delete.description", {
              name: subscriberName || t("subscribers.delete.fallbackName"),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteSubscriber.error instanceof Error ? (
          <p className="text-sm text-red-300">{deleteSubscriber.error.message}</p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>{t("subscribers.actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteSubscriber.isPending ? t("subscribers.actions.deleting") : t("subscribers.actions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
