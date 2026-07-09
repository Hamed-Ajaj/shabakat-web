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
import { useDeleteAmpereScheduleMutation } from "../mutations";
import type { AmpereScheduleRecord } from "../types";

interface DeleteAmpereScheduleDialogProps {
  open: boolean;
  schedule: AmpereScheduleRecord | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAmpereScheduleDialog({
  open,
  schedule,
  onOpenChange,
}: Readonly<DeleteAmpereScheduleDialogProps>) {
  const { t } = useI18n();
  const deleteAmpereSchedule = useDeleteAmpereScheduleMutation();

  async function handleDelete() {
    if (!schedule) {
      return;
    }

    await deleteAmpereSchedule.mutateAsync(schedule.id);
    toast.success(t("ampereSchedules.delete.success"));
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      deleteAmpereSchedule.reset();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("ampereSchedules.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("ampereSchedules.delete.description", {
              name: schedule?.name || t("ampereSchedules.delete.fallbackName"),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteAmpereSchedule.error instanceof Error ? (
          <p className="text-sm text-red-300">{deleteAmpereSchedule.error.message}</p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>{t("ampereSchedules.actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteAmpereSchedule.isPending
              ? t("ampereSchedules.actions.deleting")
              : t("ampereSchedules.actions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
