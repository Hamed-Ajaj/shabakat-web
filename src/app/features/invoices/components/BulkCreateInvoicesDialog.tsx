import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
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
import { useBulkCreateInvoicesMutation } from "../mutations";

interface BulkCreateInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkCreateInvoicesDialog({
  open,
  onOpenChange,
}: Readonly<BulkCreateInvoicesDialogProps>) {
  const { t } = useI18n();
  const bulkCreate = useBulkCreateInvoicesMutation();

  async function handleConfirm() {
    const result = await bulkCreate.mutateAsync();
    toast.success(result.message);
    onOpenChange(false);
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          bulkCreate.reset();
        }
      }}
    >
      <AlertDialogContent className="border-white/8 bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("invoices.bulk.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("invoices.bulk.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {bulkCreate.error instanceof Error ? <p className="text-sm text-red-300">{bulkCreate.error.message}</p> : null}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              {t("invoices.actions.cancel")}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="button" onClick={handleConfirm} disabled={bulkCreate.isPending}>
              {bulkCreate.isPending ? t("invoices.actions.generating") : t("invoices.actions.generate")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
