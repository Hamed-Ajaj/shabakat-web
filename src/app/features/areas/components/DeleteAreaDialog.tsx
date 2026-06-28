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
  const { t } = useI18n();
  const deleteArea = useDeleteAreaMutation();

  async function handleDelete() {
    if (!area) {
      return;
    }

    await deleteArea.mutateAsync(area.id);
    toast.success(t("areas.delete.success"));
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
          <AlertDialogTitle>{t("areas.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("areas.delete.description", {
              name: area?.name || t("areas.delete.fallbackName"),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteArea.error instanceof Error ? (
          <p className="text-sm text-red-300">{deleteArea.error.message}</p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>{t("areas.actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-500/90"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {deleteArea.isPending ? t("areas.actions.deleting") : t("areas.actions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
