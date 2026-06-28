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
  const { t } = useI18n();
  const deleteReading = useDeleteMeterReadingMutation(customerId);

  async function handleDelete() {
    if (!readingId) {
      return;
    }

    await deleteReading.mutateAsync(readingId);
    toast.success(t("subscribers.meterReading.delete.success"));
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
          <AlertDialogTitle>{t("subscribers.meterReading.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("subscribers.meterReading.delete.description", {
              label: readingLabel || t("subscribers.meterReading.delete.fallbackLabel"),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteReading.error instanceof Error ? (
          <p className="text-sm text-red-300">{deleteReading.error.message}</p>
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
            {deleteReading.isPending ? t("subscribers.actions.deleting") : t("subscribers.actions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
